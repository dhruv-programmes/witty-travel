import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const usePlannerStore = create(
  persist(
    (set, get) => ({
      // Session Management
      sessions: [],
      activeSessionId: null,

      // Inputs (Current)
      inputs: {
        budget: 50000,
        days: 3,
        city: '',
        origin: '',
        preferences: [],
        transportMode: 'auto',
        foodPreferences: ['no-restrictions'],
        travelStyle: 'balanced',
        pace: 'moderate'
      },
      
      // Results (Current)
      itinerary: [],
      breakdown: null,
      theme: null, // New theme state
      heroImageQuery: null, // Hero image search query
      iterations: 0,
      
      // UI State
      isPlanning: false,
      currentPhase: 'input',
      progressMessage: '',
      error: null,
      logs: [],

      // Actions
      setInputs: (inputs) => set((state) => ({ inputs: { ...state.inputs, ...inputs } })),
      
      // Session Actions
      createSession: () => {
        const id = uuidv4();
        const newSession = {
          id,
          createdAt: new Date().toISOString(),
          title: 'New Trip',
          inputs: get().inputs, // Start with current inputs or defaults
          itinerary: [],
          breakdown: null,
          theme: null,
          heroImageQuery: null,
          status: 'draft'
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: id,
          // Reset current workspace
          inputs: { 
            budget: 50000, 
            days: 3, 
            city: '', 
            origin: '',
            preferences: [],
            transportMode: 'auto',
            foodPreferences: ['no-restrictions'],
            travelStyle: 'balanced',
            pace: 'moderate'
          },
          itinerary: [],
          breakdown: null,
          theme: null,
          heroImageQuery: null,
          iterations: 0,
          isPlanning: false,
          currentPhase: 'input',
          logs: [],
          error: null
        }));
        return id;
      },

      loadSession: (id) => {
        const session = get().sessions.find(s => s.id === id);
        if (session) {
          set({
            activeSessionId: id,
            inputs: session.inputs,
            itinerary: session.itinerary || [],
            breakdown: session.breakdown,
            theme: session.theme || null,
            heroImageQuery: session.heroImageQuery || null,
            currentPhase: session.status === 'complete' ? 'complete' : 'input',
            // Reset temp UI states
            isPlanning: false,
            logs: [], 
            error: null
          });
        }
      },

      deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
        activeSessionId: state.activeSessionId === id ? null : state.activeSessionId
      })),

      saveSession: () => {
        const { activeSessionId, inputs, itinerary, breakdown, theme, heroImageQuery, sessions } = get();
        if (!activeSessionId) return;

        const updatedSessions = sessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: inputs.city ? `Trip to ${inputs.city}` : 'Untitled Trip',
              inputs,
              itinerary,
              breakdown,
              theme,
              heroImageQuery,
              updatedAt: new Date().toISOString(),
              status: itinerary.length > 0 ? 'complete' : 'draft'
            };
          }
          return s;
        });

        set({ sessions: updatedSessions });
      },

      // Legacy/Current Actions (Wrapped to auto-save)
      setPlanning: (isPlanning) => set({ isPlanning }),
      setPhase: (phase) => {
        set({ currentPhase: phase });
        get().saveSession(); 
      },
      setProgress: (message) => set({ progressMessage: message }),
      addLog: (log) => set((state) => ({ logs: [...state.logs, { ...log, timestamp: new Date() }] })),
      setError: (error) => set({ error }),
      
      setResults: (itinerary, breakdown, theme, heroImageQuery) => {
        set({ itinerary, breakdown, theme, heroImageQuery });
        get().saveSession();
      },
      
      reset: () => {
        // Just resets current view, not session data unless explicitly overwritten
        set({
          itinerary: [],
          breakdown: null,
          theme: null,
          heroImageQuery: null,
          iterations: 0,
          isPlanning: false,
          currentPhase: 'input',
          progressMessage: '',
          error: null,
          logs: []
        });
      }
    }),
    {
      name: 'travel-planner-storage', // local storage key
      partialize: (state) => ({ sessions: state.sessions }), // Only persist sessions
    }
  )
);

export default usePlannerStore;
