# Witty Travel
Agentic Journey Planner

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-000000?style=for-the-badge&logo=bun&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-black?style=for-the-badge)
![MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## Getting started

### Clone the repository
```bash
git clone https://github.com/dhruv-programmes/witty-travel.git
cd witty-travel
```

### Install dependencies
```bash
bun install
```

### Environment setup
Create a `.env` file in the project root.
```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_PEXELS_API_KEY=your_pexels_key
```

### Run locally
```bash
bun run dev
```

Open the local server and start planning trips that actually fit your wallet.

---

## What this is

Witty Travel is a hackathon built agentic journey planner focused on budget realism.  
It does not guess or oversell. It plans checks fixes and repeats until the trip makes sense.

The system treats constraints as rules and refuses to ship broken itineraries.

---

## Why it exists

Most travel tools generate ideas.  
This one generates plans that survive basic math.

You give it money days cities and a rough vibe.  
It returns a realistic day by day itinerary with costs that line up.

If something does not fit the budget or timeline the agent corrects itself.

---

## How the agent behaves

Inputs are normalized into a single planning state.  
A full itinerary is generated including transport stays and activities.  
Every day is validated against budget and feasibility.  
If something breaks the rules the agent replans and checks again.  
Only valid plans are returned. Impossible trips fail honestly.

---

## Tech stack

React for the interface  
Tailwind CSS for styling  
Vite for development  
Bun for runtime speed  
Gemini Flash for planning logic  
Zustand for state  
Pexels for images


---

## License

MIT License

---

## Author

Dhruv Padhiyar
