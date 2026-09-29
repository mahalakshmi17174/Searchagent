/**
 * Mock Audio Generation & Transcription Service
 */

const mockAudios = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
];

export function generateAudio(input, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!input || input.trim() === '') {
        reject(new Error('Input text/prompt is required.'));
        return;
      }

      if (input.toLowerCase().includes('error')) {
        reject(new Error('Audio synthesis failed. Server timeout.'));
        return;
      }

      const randomIdx = Math.floor(Math.random() * mockAudios.length);
      
      resolve({
        id: `aud-${Date.now()}`,
        input,
        url: mockAudios[randomIdx],
        voice: options.voice || 'Male (Deep)',
        duration: '0:35',
        createdAt: new Date().toLocaleTimeString(),
        status: 'completed'
      });
    }, 1300);
  });
}
