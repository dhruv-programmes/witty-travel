
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = 'gemini-2.5-flash';

const TRAVEL_STYLES = [
  { id: 'budget', label: 'Budget', desc: 'Cost-effective choices' },
  { id: 'balanced', label: 'Balanced', desc: 'Mix of value & comfort' },
  { id: 'luxury', label: 'Luxury', desc: 'Premium experiences' },
];

const PACE_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed', desc: '2-3 activities/day' },
  { id: 'moderate', label: 'Moderate', desc: '4-5 activities/day' },
  { id: 'packed', label: 'Packed', desc: '6+ activities/day' },
];

class AgentService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn("Gemini API Key is missing or default. Please check .env file.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  async queryLLM(prompt, jsonMode = true) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (jsonMode) {
        try {
          // Clean up markdown blocks if present (Gemini often wraps in ```json ... ```)
          const cleanText = text.replace(/```json\n/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (e) {
             console.warn("JSON parse failed, trying regex extraction on:", text);
             const match = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
             if (match) return JSON.parse(match[0]);
             throw new Error("Failed to parse JSON from LLM response");
        }
      }
      return text;
    } catch (error) {
      console.error('Agent Service Error:', error);
      throw error;
    }
  }

  async generateItinerary(inputs, onProgress) {
    // Helper to validate and extract array from LLM response
    const validateStructure = (data) => {
        if (Array.isArray(data)) return data;
        if (data?.days && Array.isArray(data.days)) return data.days;
        if (data?.itinerary && Array.isArray(data.itinerary)) return data.itinerary;
        if (data?.plan && Array.isArray(data.plan)) return data.plan;
        // Handle single day object case
        if (data?.day && data?.activities) return [data];
        return null;
    };

    try {
      // 1. PLANNING - Initial Attempt
      onProgress('planning', `Drafting initial ${inputs.days}-day itinerary to ${inputs.city}...`);
      let rawPlan = await this.planPhase(inputs);
      
      // Extract theme and heroImageQuery if available
      const theme = rawPlan.theme || null;
      const heroImageQuery = rawPlan.heroImageQuery || null;
      let itinerary = validateStructure(rawPlan);
      
      // Basic validation
      if (!itinerary) {
         console.error("Invalid Structure Received:", rawPlan);
         // Fallback: Try generating just Day 1 to start
         onProgress('planning', `Initial plan structure invalid. Retrying Day 1...`);
         rawPlan = await this.planPhase(inputs, 1);
         itinerary = validateStructure(rawPlan);
         if (!itinerary) throw new Error("Could not generate valid itinerary structure.");
      }

      // 1.5. EXTENSION LOOP - Ensure we have all days
      // The model often generates just Day 1. We must force it to generate the rest.
      const targetDays = parseInt(inputs.days);
      
      // Limits to prevent infinite loops (Target + 2 buffer)
      let safetyLoopCount = 0;
      const MAX_SAFETY_LOOPS = targetDays + 3;

      while (itinerary.length < targetDays && safetyLoopCount < MAX_SAFETY_LOOPS) {
          safetyLoopCount++;
          const nextDayNum = itinerary.length + 1;
          onProgress('planning', `Model returned ${itinerary.length}/${targetDays} days. Generating Day ${nextDayNum}...`);
          
          try {
              const nextDayRaw = await this.planPhase(inputs, nextDayNum);
              const nextDayParsed = validateStructure(nextDayRaw);
              
              if (nextDayParsed && nextDayParsed.length > 0) {
                  // Find the day object we want (usually the first one if we asked for a specific day)
                  const dayObj = nextDayParsed.find(d => d.day === nextDayNum) || nextDayParsed[0];
                  
                  // Ensure correct day number index
                  dayObj.day = nextDayNum; // force correct number
                  itinerary.push(dayObj);
              } else {
                  console.warn(`Failed to generate Day ${nextDayNum}`);
              }
          } catch (e) {
              console.error(`Error generating day ${nextDayNum}:`, e);
          }
      }

      let iterations = 0;
      const MAX_ITERATIONS = 3;
      
      while (iterations < MAX_ITERATIONS) {
        // 2. CHECKING
        onProgress('checking', `Validating constraints (Iteration ${iterations})...`);
        const validation = this.checkConstraints(itinerary, inputs);
        
        if (validation.valid) {
          // 4. FINALIZING (Success)
          onProgress('finalizing', 'Plan looks good! Finalizing...');
          const breakdown = this.generateBreakdown(itinerary);
          onProgress('complete', 'Itinerary ready!');
          return { itinerary, breakdown, iterations, theme, heroImageQuery };
        }
        
        // 3. REPLANNING
        iterations++;
        onProgress('replanning', `Issues found: ${validation.issues[0]}. Replanning (Attempt ${iterations}/${MAX_ITERATIONS})...`);
        
        const newRawPlan = await this.replanPhase(itinerary, inputs, validation.issues, iterations);
        const newPlan = validateStructure(newRawPlan);
        
        // Safety check if replan returns valid structure
        if (newPlan && newPlan.length > 0) {
             // If replan returned a full new list, use it.
             // But if it returned truncated list, we might be in trouble.
             // For safety, only accept if length is close to target, otherwise merge changes?
             // Simple approach: if newPlan has same length, take it.
             if (newPlan.length === targetDays) {
                 itinerary = newPlan;
             } else {
                 // Hybrid: failed to replan full list. Stick to old list but maybe warn?
                 // Or try to replan per-day? Too complex for now.
                 // Let's accept it if it's not empty, but if length dropped, triggering extension loop again would be weird here.
                 // Let's just keep the old one if the new one is broken.
                 console.warn("Replan returned incomplete list, discarding changes to avoid data loss.");
             }
        }
      }
      
      // If loop finishes without valid plan, return best effort with warning
      onProgress('complete', 'Max iterations reached. Showing best effort plan.');
      const breakdown = this.generateBreakdown(itinerary);
      return { itinerary, breakdown, iterations, warning: "Budget constraints could not be fully met.", theme, heroImageQuery };
      
    } catch (error) {
      console.error(error);
      onProgress('error', error.message || "Something went wrong during generation");
      throw error;
    }
  }

  async planPhase(inputs, specificDay = null) {
    let prompt = '';
    
    if (specificDay) {
        // Generating a SPECIFIC single day
        prompt = `
You are an expert travel planner.
DETAILS:
- Destination: ${inputs.city}
- Origin: ${inputs.origin || 'Not specified'}
- Journey Context: Planning a trip from ${inputs.origin || 'starting point'} to ${inputs.city}
- Budget: ₹${inputs.budget}
- Transport Mode: ${inputs.transportMode === 'auto' ? 'AI Choice (choose best for destination)' : inputs.transportMode}
- Food Preferences: ${inputs.foodPreferences?.join(', ') || 'No restrictions'}
- Activity Preferences: ${inputs.preferences.join(', ')}.
- Travel Style: ${inputs.travelStyle} (${TRAVEL_STYLES.find(s => s.id === inputs.travelStyle)?.desc || ''})
- Trip Pace: ${inputs.pace} (${PACE_OPTIONS.find(p => p.id === inputs.pace)?.desc || ''})

TASK: Create the itinerary for **Day ${specificDay} ONLY**.

REQUIREMENTS:
1. Return a JSON ARRAY with ONE object for Day ${specificDay}.
2. Structure: [{
    "day": ${specificDay}, 
    "daySummary": "Short 1-sentence summary of the day's theme",
    "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3"],
    "imageSearchQuery": "...", 
    "activities": [...]
}]
3. Include 3-4 activities with: "time", "name", "description", "cost" (in INR), "duration", "category".
4. Categories: sightseeing, food, culture, adventure, relaxation, shopping, nightlife.
5. All costs must be in INR.
6. INTEREST PRIORITIZATION:
   - Your primary focus is on these activities: ${inputs.preferences.join(', ') || 'General Sightseeing'}.
   - Diversify but ensure the user's specific interests are the core of the plan.
7. JOURNEY LOGISTICS (CRITICAL):
   - If this is Day 1, you MUST include an activity for traveling from ${inputs.origin} to ${inputs.city}.
   - Specify the mode (Flight/Train/Bus), estimated time, and cost of travel.
8. TRANSPORT CONSIDERATIONS:
   - If transport mode is walking/biking: suggest nearby attractions within reasonable distance
   - If transport mode is plane/train: can include day trips to nearby cities
   - Ensure activities are accessible by the specified transport mode
9. LANDMARK/TREK DESTINATIONS:
   - If ${inputs.city} is a trek, mountain, or specific landmark, identify the nearest base city/village and plan logistics (e.g., base camp arrival, trek route, specific gear/guides needed).
10. FOOD CONSIDERATIONS (STRICT):
   - Dietary restrictions are MANDATORY: ${inputs.foodPreferences?.join(', ') || 'No restrictions'}.
   - If 'Vegetarian' or 'Vegan' is selected, suggest ONLY restaurants that are 100% compliant.
   - Every food activity description MUST explicitly mention its compliance with the user's dietary needs.
6. **daySummary**: A brief, engaging 1-sentence summary of what this day is about (e.g., "Explore ancient temples and savor authentic street food")
7. **highlights**: Array of 3 key highlights/experiences for this day (short phrases, 3-5 words each)
8. **imageSearchQuery**: A specific, optimized Pexels search query for this day that will return beautiful, iconic images of ${inputs.city}. 
   - Focus on famous landmarks, iconic views, or recognizable places in ${inputs.city}.
   - Example: "Tokyo Tower sunset skyline" or "Eiffel Tower Paris cityscape" or "Taj Mahal sunrise India"
   - Make it specific to capture the essence of ${inputs.city}.

IMPORTANT: Return ONLY valid JSON. No markdown.
`;
    } else {
        // Generating FULL itinerary
        const budgetPerDay = Math.floor(inputs.budget / inputs.days);
        prompt = `
You are an expert travel planner. Create a comprehensive day-by-day trip itinerary.
DETAILS:
- Destination: ${inputs.city}
- Origin: ${inputs.origin || 'Not specified'}
- Journey Context: Planning a trip from ${inputs.origin || 'starting point'} to ${inputs.city}
- Duration: ${inputs.days} days
- Total Budget: ₹${inputs.budget}
- Budget per day (approximate): ₹${budgetPerDay}
- Transport Mode: ${inputs.transportMode === 'auto' ? 'AI Choice (choose best for destination)' : inputs.transportMode}
- Food Preferences: ${inputs.foodPreferences?.join(', ') || 'No restrictions'}
- Activity Preferences: ${inputs.preferences.length > 0 ? inputs.preferences.join(', ') : 'General Interest'}
- Travel Style: ${inputs.travelStyle} (${TRAVEL_STYLES.find(s => s.id === inputs.travelStyle)?.desc || ''})
- Trip Pace: ${inputs.pace} (${PACE_OPTIONS.find(p => p.id === inputs.pace)?.desc || ''})

REQUIREMENTS:
1. Provide a JSON OBJECT containing:
   - "heroImageQuery": A Pexels search query for an AMAZING, iconic image of the broader region/country/state where ${inputs.city} is located.
     * For cities: use the country or state name with iconic landscapes
     * Examples: 
       - "Kedarnath Trek" → "Uttarakhand Himalayan mountains landscape"
       - "Tokyo" → "Japan Mount Fuji cherry blossom"
       - "Paris" → "France countryside lavender fields"
       - "Goa" → "Goa India beaches sunset palm trees"
     * Focus on the most recognizable, beautiful natural or cultural landscapes of that region
   - "itinerary": Array of ${inputs.days} day objects.
   - "theme": Array of 2 Tailwind CSS gradient colors (string) representing the flag/vibe of the ${inputs.city} (e.g. ["from-red-600", "to-white"] for Japan/Tokyo).
2. Structure must be valid JSON.

EXAMPLE OUTPUT FORMAT:
{
  "heroImageQuery": "Japan Mount Fuji cherry blossom landscape",
  "theme": ["from-blue-600", "to-red-600"],
  "itinerary": [
    {
      "day": 1,
      "daySummary": "Discover Tokyo's iconic landmarks and vibrant culture",
      "highlights": ["Tokyo Tower views", "Traditional temples", "Street food tour"],
      "imageSearchQuery": "Tokyo Tower sunset cityscape skyline",
      "activities": [
        { "time": "10:00", "name": "Activity 1", "description": "...", "cost": 1500, "duration": 2, "category": "sightseeing" }
      ]
    }
  ]
}

3. Each day object MUST include:
   - "day": Day number
   - "daySummary": A brief, engaging 1-sentence summary of the day's theme (e.g., "Explore ancient temples and savor authentic street food")
   - "highlights": Array of exactly 3 key highlights/experiences for this day (short phrases, 3-5 words each)
   - "imageSearchQuery": A specific, optimized Pexels search query that will return beautiful, iconic images of ${inputs.city}.
     * Focus on famous landmarks, iconic views, skylines, or recognizable places.
     * Make each day's query unique - use different landmarks/views for variety.
     * Examples: "Shibuya Crossing Tokyo night", "Mount Fuji sunrise Japan", "Tokyo Skytree aerial view"
   - "activities": Array of activities
4. Activities must have: "time", "name", "description", "cost" (number, INR only), "duration" (hours), "category".
5. Categories allowed: "sightseeing", "food", "culture", "adventure", "relaxation", "shopping", "nightlife".
6. Be specific with activity names and REALISTIC with prices.
7. INTEREST PRIORITIZATION:
   - Heavily prioritize these user interests: ${inputs.preferences.length > 0 ? inputs.preferences.join(', ') : 'General Interest'}.
   - Most activities should align with these chosen categories while maintaining a balanced overall flow.

8. JOURNEY LOGISTICS (CRITICAL):
   - DAY 1 MUST START with the journey from ${inputs.origin} to ${inputs.city}.
   - Include details like "Flight from ${inputs.origin}", "Train journey", or "Drive to destination" with realistic costs and durations.
   - The user's experience starts the moment they leave ${inputs.origin}.

TRANSPORT CONSIDERATIONS:
- Transport Mode: ${inputs.transportMode === 'auto' ? 'AI to decide optimal transport (Plane, Train, Car, Bike, or Walking) based on destination geography and budget' : inputs.transportMode}
- If walking/biking: Focus on nearby attractions within 5-10km radius, suggest walkable neighborhoods
- If plane/train: Can include day trips to nearby cities, longer distances acceptable
- If car/bus: Flexible routing, can cover wider area
- Ensure all suggested activities are realistically accessible by the chosen transport mode

FOOD CONSIDERATIONS (NON-NEGOTIABLE):
- Dietary Restrictions: ${inputs.foodPreferences?.join(', ') || 'No restrictions'}
- STRICT ENFORCEMENT: If 'Vegetarian' is selected, suggest ONLY vegetarian restaurants. Do NOT suggest a steakhouse because it has a salad. Every food recommendation MUST be 100% compliant.
- If 'Vegan' is selected, ensure 100% plant-based recommendations.
- For Halal/Kosher, mention specific certified or known-to-be-compliant spots.
- All food activity descriptions MUST confirm they meet the user's dietary criteria.

LANDMARK/TREK DESTINATIONS:
- If the destination "${inputs.city}" is a specific landmark, mountain, or trek rather than a city, you MUST:
  1. Identify the nearest base city or transit hub.
  2. Plan the journey from the base city to the landmark.
  3. Include specific trek/landmark related activities (e.g., "Arrive at Sankri base camp", "Start trek to Juda Ka Talab").
  4. Ensure costs include permits, guides, or specific gear if applicable.

CRITICAL BUDGET RULES:
- Total cost across ALL ${inputs.days} days should be approximately ₹${inputs.budget} (±10%).
- Distribute budget evenly: aim for ~₹${budgetPerDay} per day.
- Mix of paid and free activities is good, but NEVER make everything free.
- If budget is tight, include more free activities (parks, temples, walking tours) but still have some paid ones.
- Food activities should ALWAYS have a cost (even budget meals cost ₹100-500).
- Entry fees, transport, experiences should have realistic costs.
- DO NOT make all activities free just because budget is running low - adjust activity types instead.

IMPORTANT:
- You MUST generate ALL ${inputs.days} days.
- Each day MUST have a unique, specific imageSearchQuery for ${inputs.city}.
- The heroImageQuery MUST represent the broader region/country/state, not the specific city.
- Return ONLY the JSON Object.
- Do NOT output markdown code blocks.
`;
    }
    
    return this.queryLLM(prompt, true);
  }
  
  checkConstraints(itinerary, inputs) {
    let totalCost = 0;
    // Calculate total cost
    itinerary.forEach(day => {
      if (day.activities) {
        day.activities.forEach(act => totalCost += (Number(act.cost) || 0));
      }
    });
    
    const issues = [];
    const tolerance = 5000; // ₹5000 tolerance
    
    if (totalCost > inputs.budget + tolerance) {
      issues.push(`Total cost (₹${totalCost}) exceeds budget (₹${inputs.budget}) by ₹${totalCost - inputs.budget}`);
    } else if (totalCost < inputs.budget * 0.5) {
         // Optional: warn if underutilized? "Under budget" isn't usually an error but valid check.
    }
    
    if (itinerary.length !== parseInt(inputs.days)) {
        issues.push(`Itinerary has ${itinerary.length} days, expected ${inputs.days}`);
    }
    
    return {
      valid: issues.length === 0,
      issues,
      totalCost
    };
  }
  
  async replanPhase(currentItinerary, inputs, issues, iteration) {
    const prompt = `
The previous itinerary for ${inputs.city} has issues:
${issues.join('\n')}

Original Request: ${inputs.days} days, Budget ₹${inputs.budget}.

Current Plan (JSON):
${JSON.stringify(currentItinerary)}

TASK:
Fix the issues strictly. 
- If the issue is "Itinerary has X days, expected Y", you MUST generate the full ${inputs.days} days.
- If over budget, replace expensive activities with cheaper alternatives or free ones.
- Keep the same JSON structure.
- Do NOT output markdown, just the JSON.

Return the CORRECTED JSON array with exactly ${inputs.days} items.
`;
    
    return this.queryLLM(prompt, true);
  }

  generateBreakdown(itinerary) {
      const categories = {};
      let total = 0;
      const dailyCosts = [];
      
      itinerary.forEach(day => {
          let dayCost = 0;
          if (day.activities) {
              day.activities.forEach(act => {
                  const cost = Number(act.cost) || 0;
                  const cat = act.category || 'other';
                  categories[cat] = (categories[cat] || 0) + cost;
                  total += cost;
                  dayCost += cost;
              });
          }
          dailyCosts.push({ day: day.day, cost: dayCost });
      });
      
      const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
      
      return { 
          totalCost: total,
          categoryData, // For Pie Chart
          dailyCosts    // For Bar Chart
      };
  }
}

export const agentService = new AgentService();
