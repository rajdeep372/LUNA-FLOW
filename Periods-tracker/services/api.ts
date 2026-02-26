// import { User, PeriodLog, UserProfile } from '../types';

// const API_URL = 'http://localhost:5000/api';

// export const api = {
//   login: async (email: string, password: string) => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) throw new Error('Login failed');
//     return res.json();
//   },

//   register: async (user: User) => {
//     const res = await fetch(`${API_URL}/auth/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(user),
//     });
//     if (!res.ok) throw new Error('Registration failed');
//     return res.json();
//   },

//   getUserData: async (userId: string) => {
//     const res = await fetch(`${API_URL}/data/${userId}`);
//     if (!res.ok) throw new Error('Failed to fetch data');
//     return res.json();
//   },

//   addLog: async (userId: string, log: any, age: number) => {
//     const res = await fetch(`${API_URL}/logs`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, log, age }),
//     });
//     if (!res.ok) throw new Error('Failed to add log');
//     return res.json();
//   },

//   updateProfile: async (userId: string, profile: UserProfile) => {
//     const res = await fetch(`${API_URL}/profile/${userId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ profile }),
//     });
//     if (!res.ok) throw new Error('Failed to update profile');
//     return res.json();
//   },

//   // DELETE FUNCTION 
//   deleteLog: async (logId: string, userId: string) => {
//     const res = await fetch(`${API_URL}/logs/${logId}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId }),
//     });
//     if (!res.ok) throw new Error('Failed to delete log');
//     return res.json();
//   },

//   // --- RESET FUNCTION ---
//   resetData: async (userId: string) => {
//     const res = await fetch(`${API_URL}/reset/${userId}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) throw new Error('Failed to reset data');
//     return res.json();
//   },

//   // --- NEW: ML Health Prediction Function ---
//   predictHealthRisk: async (cycleData: any) => {
//     const res = await fetch(`${API_URL}/predict`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(cycleData),
//     });
//     if (!res.ok) throw new Error('Prediction request failed');
//     return res.json();
//   }
// };
import { User, PeriodLog, UserProfile } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  register: async (user: User) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  getUserData: async (userId: string) => {
    const res = await fetch(`${API_URL}/data/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  },

  addLog: async (userId: string, log: any, age: number) => {
    const res = await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, log, age }),
    });
    if (!res.ok) throw new Error('Failed to add log');
    return res.json();
  },

  updateProfile: async (userId: string, profile: UserProfile) => {
    const res = await fetch(`${API_URL}/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // DELETE FUNCTION 
  deleteLog: async (logId: string, userId: string) => {
    const res = await fetch(`${API_URL}/logs/${logId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to delete log');
    return res.json();
  },

  // --- RESET FUNCTION ---
  resetData: async (userId: string) => {
    const res = await fetch(`${API_URL}/reset/${userId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to reset data');
    return res.json();
  },

  // --- ML Health Prediction Function ---
  predictHealthRisk: async (cycleData: any) => {
    const res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cycleData),
    });
    if (!res.ok) throw new Error('Prediction request failed');
    return res.json();
  },

  // --- NEW: Save Analysis Function ---
  saveAnalysis: async (userId: string, geminiAnalysis: any, mlPrediction: any) => {
    const res = await fetch(`${API_URL}/analysis/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, geminiAnalysis, mlPrediction }),
    });
    if (!res.ok) throw new Error('Failed to save analysis');
    return res.json();
  },

  // --- NEW: Fetch Saved Analysis Function ---
  getSavedAnalyses: async (userId: string) => {
    const res = await fetch(`${API_URL}/analysis/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch saved analyses');
    return res.json();
  }
};