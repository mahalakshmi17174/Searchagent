import { Image, Video, Volume2, BookOpen } from 'lucide-react';

export const sectionRoutes = [
  {
    section: 'image',
    name: 'Image',
    icon: Image,
    keywords: [
      'image', 'image creation', 'image generation', 'image editing', 'create an image', 'generate an image',
      'make an image', 'edit my image', 'change image background', 'remove an object from an image',
      'modify this photo', 'enhance an image', 'remove background', 'change background',
      'photo enhancement', 'object removal', 'object addition'
    ],
    message: 'This is not the right place for image creation or editing. Please go to the Image section.',
    description: 'Create or edit images in the dedicated Image section.',
    buttonLabel: 'Go to Image Section',
    destination: 'image'
  },
  {
    section: 'video',
    name: 'Video',
    icon: Video,
    keywords: [
      'video', 'video generation', 'video creation', 'video editing', 'video modification',
      'create video', 'generate video', 'edit video', 'modify video',
      'create a video', 'generate a video', 'make a video'
    ],
    message: 'This is not the right place for video generation or editing. Please go to the Video section.',
    description: 'Create and sequence motion graphics in the dedicated Video section.',
    buttonLabel: 'Go to Video Section',
    destination: 'video'
  },
  {
    section: 'audio',
    name: 'Audio',
    icon: Volume2,
    keywords: [
      'audio', 'audio generation', 'voice generation', 'text-to-speech', 'audio editing',
      'audio transcription', 'generate audio', 'create voice', 'text to speech',
      'create audio', 'transcription', 'voiceover', 'synthesize voice'
    ],
    message: 'This is not the right place for audio tasks. Please go to the Audio section.',
    description: 'Generate voice tracks, text-to-speech, or transcribe files in the dedicated Audio section.',
    buttonLabel: 'Go to Audio Section',
    destination: 'audio'
  },
  {
    section: 'research',
    name: 'Research',
    icon: BookOpen,
    keywords: [
      'research', 'research paper', 'deep research', 'research workflow', 'research paper creation', 'research paper generation',
      'source-based detailed research', 'create research paper', 'generate research paper',
      'detailed research', 'start research'
    ],
    message: 'This request belongs to the Research section. Please go to the Research section.',
    description: 'Explore databases, synthesize scientific reviews, and draft papers in the dedicated Research section.',
    buttonLabel: 'Go to Research Section',
    destination: 'research'
  }
];

export function getSectionRoute(keyword) {
  const lowerKey = keyword.toLowerCase();
  return sectionRoutes.find(route => 
    route.keywords.some(k => lowerKey.includes(k.toLowerCase()))
  );
}
