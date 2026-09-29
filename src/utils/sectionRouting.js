import { sectionRoutes } from '../data/sectionRoutes';

export function detectSpecializedSection(message) {
  if (!message) return null;
  const msgLower = message.toLowerCase();

  for (const route of sectionRoutes) {
    for (const keyword of route.keywords) {
      if (msgLower.includes(keyword)) {
        return route;
      }
    }
  }

  return null;
}
