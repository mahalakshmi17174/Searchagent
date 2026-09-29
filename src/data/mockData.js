/**
 * Initial Mock Data for Demonstration
 */

export const mockUsers = [
  {
    userId: 'demo_aurqo_com',
    name: 'Maha Lakshmi',
    email: 'demo@aurqo.com',
    plan: 'Plus'
  },
  {
    userId: 'john_doe_aurqo_com',
    name: 'John Doe',
    email: 'john.doe@aurqo.com',
    plan: 'Free'
  }
];

export const initialUserData = {
  demo_aurqo_com: {
    history: [
      { id: 'hist-1', title: 'Biryani Dum Recipe', type: 'search', domain: 'Food', timestamp: '2026-08-26 10:15 AM' },
      { id: 'hist-2', title: 'Futuristic Cyberpunk Skyline', type: 'image', timestamp: '2026-08-26 10:20 AM' },
      { id: 'hist-3', title: 'React Hooks Deep Dive', type: 'search', domain: 'Technology', timestamp: '2026-08-26 10:30 AM' }
    ],
    saved: [
      { id: 'saved-1', title: 'React Hooks Explanation', content: 'React component state updates trigger selective virtual DOM comparison...', type: 'search', timestamp: '2026-08-26 10:30 AM' }
    ]
  },
  john_doe_aurqo_com: {
    history: [
      { id: 'hist-4', title: 'Study tips for exams', type: 'search', domain: 'Education', timestamp: '2026-08-26 11:00 AM' }
    ],
    saved: []
  }
};
