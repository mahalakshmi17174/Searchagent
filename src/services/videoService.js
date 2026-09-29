/**
 * Mock Video Generation Service
 * Simulates states: queued, processing, completed, failed
 */

const mockVideos = [
  { url: 'https://assets.mixkit.co/videos/preview/mixkit-nebula-in-deep-space-11537-large.mp4', title: 'Nebula Space Journey' },
  { url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41764-large.mp4', title: 'Cyberpunk Lasers' },
  { url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4', title: 'Scenic Forest Waterfall' }
];

export function generateVideo(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!prompt || prompt.trim() === '') {
        reject(new Error('Prompt is required to generate a video.'));
        return;
      }

      if (prompt.toLowerCase().includes('error')) {
        reject(new Error('VRAM limit exceeded. Failed to generate video.'));
        return;
      }

      const randomIdx = Math.floor(Math.random() * mockVideos.length);
      const chosen = mockVideos[randomIdx];

      resolve({
        id: `vid-${Date.now()}`,
        prompt,
        url: chosen.url,
        title: chosen.title,
        aspectRatio: options.aspectRatio || '16:9',
        duration: '0:10',
        createdAt: new Date().toLocaleTimeString(),
        status: 'completed'
      });
    }, 1800);
  });
}
