export const domainKeywords = {
  Food: ['dosa', 'idli', 'vada', 'sambar', 'pongal', 'rasam', 'biryani', 'recipe', 'cooking', 'food', 'breakfast', 'lunch', 'dinner', 'cook', 'meal', 'dessert', 'cuisine', 'eat', 'chicken', 'mutton', 'vegetable', 'fruit', 'kitchen', 'bake', 'chef', 'dish', 'fry', 'paneer', 'curry', 'naan', 'chapati', 'parotta', 'upma', 'chutney', 'tea', 'coffee', 'soup', 'noodle', 'burger', 'pizza', 'salad', 'snack', 'spicy'],
  Technology: ['react', 'javascript', 'computer', 'software', 'coding', 'programming', 'code', 'web', 'dev', 'api', 'git', 'database', 'html', 'css', 'server', 'application', 'technology', 'ai', 'tech', 'python', 'java', 'c++', 'ux', 'ui', 'mobile', 'cloud', 'data'],
  Textiles: ['cotton', 'fabric', 'textile', 'silk', 'wool', 'cloth', 'weaving', 'yarn', 'apparel', 'garment', 'polyester', 'nylon', 'designer', 'clothes', 'fashion', 'thread', 'fiber', 'pattern', 'saree', 'dress', 'shirt'],
  Education: ['school', 'study', 'learn', 'student', 'college', 'homework', 'math', 'physics', 'chemistry', 'science', 'lesson', 'teacher', 'university', 'curriculum', 'course', 'useful', 'education', 'degree', 'exam', 'class', 'syllabus', 'academic', 'teaching', 'read', 'write', 'book']
};

export function detectDomain(message) {
  if (!message) return null;
  const msgLower = message.toLowerCase();

  // Explicit domain tag check (e.g. "[Food Domain]", "[Food]", "[Technology Domain]", etc.)
  for (const domain of Object.keys(domainKeywords)) {
    const domainLower = domain.toLowerCase();
    if (
      msgLower.includes(`[${domainLower} domain]`) || 
      msgLower.includes(`[${domainLower}]`) ||
      msgLower.startsWith(`${domainLower}:`)
    ) {
      return domain;
    }
  }

  // Basic check for casual conversation greetings/expressions
  const casualPhrases = [
    'hi', 'hello', 'how are you', 'good morning', 'good afternoon', 'good evening', 
    'hey', 'thank you', 'thanks', 'goodbye', 'bye', 'sup', 'yo'
  ];

  const isCasual = casualPhrases.some(phrase => {
    // exact word match or starting/ending boundaries
    const regex = new RegExp(`\\b${phrase}\\b`, 'i');
    return regex.test(msgLower);
  });

  // If casual (short greeting), classify as null -> Normal Conversation
  if (isCasual && msgLower.split(/\s+/).length <= 4) {
    return null;
  }

  // Check matching keywords for domains
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(msgLower)) {
        return domain;
      }
    }
  }

  return null; // Goes to normal conversation if no domain matched
}
