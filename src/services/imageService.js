/**
 * Mock Image Generation & Editing Service
 */

const mockImages = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=60', // Abstract art
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=60', // Fluid art
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=60', // Landscape
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60'  // Misty mountains
];

export function generateImage(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!prompt || prompt.trim() === '') {
        reject(new Error('Prompt is required to generate an image.'));
        return;
      }
      
      // Simulate occasional error for demonstration
      if (prompt.toLowerCase().includes('error')) {
        reject(new Error('Failed to connect to the Image Generation API. Please try again.'));
        return;
      }

      // Pick a random image from mock gallery
      const randomIndex = Math.floor(Math.random() * mockImages.length);
      const url = mockImages[randomIndex];

      resolve({
        id: `img-${Date.now()}`,
        prompt,
        url,
        dimensions: options.dimensions || '1024x1024',
        createdAt: new Date().toLocaleTimeString(),
        status: 'completed'
      });
    }, 1500);
  });
}
