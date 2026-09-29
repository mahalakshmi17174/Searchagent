/**
 * Mock Authentication Service
 * Future-ready: Can be integrated with an identity server or real OAuth API.
 */

export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Basic simulation
      if (email && password) {
        // Derive name from email for mock
        const namePart = email.split('@')[0];
        const displayName = namePart.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Mock success
        resolve({
          userId: email.replace(/[^a-zA-Z0-9]/g, '_'),
          name: displayName || 'Maha Lakshmi',
          email: email
        });
      } else {
        reject(new Error('Please provide email and password.'));
      }
    }, 800);
  });
}
