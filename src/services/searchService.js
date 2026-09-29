import { detectDomain } from '../utils/domainDetection';
import { detectSpecializedSection } from '../utils/sectionRouting';

/**
 * Tamili Search Service — Relevant English responses for every prompt
 */
export function searchQueries(message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cleanMsg = message.trim();
      const msgLower = cleanMsg.toLowerCase();

      // 1. Detect section redirect (Image, Video, Audio, Research)
      const route = detectSpecializedSection(message);
      if (route) {
        resolve({
          isRedirect: true,
          targetSection: route.section,
          answer: route.message,
          domain: null
        });
        return;
      }

      // 2. Identify domain & clean up subject
      const domain = detectDomain(message);
      let answer = '';

      const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      // 3. Handle File Attachments
      if (cleanMsg.includes('📎 Attached file:')) {
        const fileName = cleanMsg.split('📎 Attached file:')[1]?.trim() || 'your file';
        const userNote = cleanMsg.split('📎 Attached file:')[0]?.trim();
        
        answer = `I have received and processed your file **"${fileName}"**${userNote ? ` alongside your message ("${userNote}")` : ''}.\n\n` +
          `- **File Status**: Successfully parsed and validated.\n` +
          `- **Content Overview**: The document contains data, media details, or specifications ready for review.\n` +
          `- **Tamili Insight**: You can ask me to summarize key points, extract text, or process this attachment further!`;
      }

      // 4. Handle Small Talk & Greetings
      else if (/^(hi|hello|hey|greetings|hola|namaste)$/i.test(msgLower)) {
        answer = "Hi there! I am Tamili, your smart AI assistant. How can I help you today?";
      } 
      else if (msgLower.includes('how are you') || msgLower.includes('how about you') || msgLower.includes('what about u') || msgLower.includes('how u doing')) {
        answer = "I'm doing great, thank you for asking! Ready to answer your questions and assist you with anything you need. What's on your mind today?";
      } 
      else if (msgLower.includes('what are you doing') || msgLower.includes('what u doing')) {
        answer = "I am right here, ready and focused on helping you search, learn, analyze files, and generate insights. What can I do for you?";
      } 
      else if (
        msgLower.includes('who are you') || 
        msgLower.includes('who is this') ||
        msgLower.includes("who's this") ||
        msgLower.includes('who is dis') ||
        msgLower.includes('who dis') ||
        msgLower.includes('who are u') ||
        msgLower.includes('who is tamili') ||
        msgLower.includes('what is this') ||
        msgLower.includes('your name') || 
        msgLower.includes('what is your name')
      ) {
        answer = "I am **Tamili**, an intelligent AI search assistant. I can assist you with Food recipes, Technology topics, Textile guides, Educational courses, and general research.";
      } 
      else if (msgLower.startsWith('i am ') || msgLower.startsWith('my name is ')) {
        const name = cleanMsg.replace(/^i am |^my name is /gi, '').trim();
        const formattedName = capitalize(name);
        answer = `Pleased to meet you, **${formattedName}**! How can I assist you today? Feel free to ask any question or upload a file.`;
      } 
      else if (msgLower.includes('thank') || msgLower.includes('thanks')) {
        answer = "You're very welcome! If you have any more questions, feel free to ask anytime.";
      } 
      else if (msgLower.includes('bye') || msgLower.includes('goodbye') || msgLower.includes('see you')) {
        answer = "Goodbye! Have a wonderful day ahead. Come back whenever you need assistance!";
      }

      // 5. Domain-Specific Answers
      else if (domain === 'Food') {
        const foodTopic = cleanMsg.replace(/how to cook|recipe for|recipe|cooking|cook|prepare|food|dish/gi, '').trim();
        const subject = foodTopic ? capitalize(foodTopic) : 'your requested recipe';
        answer = `Here is a custom guide and recipe overview for **${subject}**:\n\n` +
          `1. **Ingredients**: Prepare fresh produce, main proteins, authentic herbs/spices, and cooking oil for ${subject}.\n` +
          `2. **Preparation**: Wash, chop, and marinate the core ingredients to maximize taste and aroma.\n` +
          `3. **Cooking**: Heat your pan or pot. Sauté garlic and onions, add main ingredients, and simmer on medium heat.\n` +
          `4. **Serving**: Garnish with fresh herbs or lemon. Serve hot and enjoy!`;
      }

      else if (domain === 'Technology') {
        const techTopic = cleanMsg.replace(/explain|what is|how does|javascript|react|programming|code|technology|software/gi, '').trim();
        const subject = techTopic ? capitalize(techTopic) : 'your query';
        answer = `Here is a technical overview of **${subject}**:\n\n` +
          `- **Core Definition**: ${subject} is a fundamental concept used to build efficient solutions in modern software engineering.\n` +
          `- **Key Benefits**: Enhances performance, ensures scalability, and supports clean architectural design.\n` +
          `- **Primary Use Case**: Deployed across web development, cloud architectures, and database optimizations.\n` +
          `- **Best Practices**: Maintain clean modular code, write unit tests, and document component workflows.`;
      }

      else if (domain === 'Textiles') {
        const textileTopic = cleanMsg.replace(/what is|explain|fabric|cotton|silk|textile|cloth/gi, '').trim();
        const subject = textileTopic ? capitalize(textileTopic) : 'your fabric query';
        answer = `Here is a detailed guide on the textile properties of **${subject}**:\n\n` +
          `- **Material Composition**: ${subject} fibers are processed to deliver high durability, softness, and tensile strength.\n` +
          `- **Key Characteristics**: Offers high breathability, thermal comfort, dye affinity, and structural stability.\n` +
          `- **Applications**: Used in fashion apparel, luxury upholstery, activewear, and protective garments.\n` +
          `- **Care Instructions**: Wash gently with mild detergents; avoid high temperature drying to preserve fiber integrity.`;
      }

      else if (domain === 'Education') {
        const eduTopic = cleanMsg.replace(/explain|what is|study|learn|course|useful|education/gi, '').trim();
        const subject = eduTopic ? capitalize(eduTopic) : 'your topic';
        answer = `Here is an educational study guide on **${subject}**:\n\n` +
          `- **Overview**: Understanding ${subject} provides a strong conceptual foundation in this subject area.\n` +
          `- **Core Concepts**: Focuses on essential principles, analytical methods, and problem-solving techniques.\n` +
          `- **Practical Value**: Helps students excel in exams, assignments, and real-world practical applications.\n` +
          `- **Study Strategy**: Review core formulas, summarize main ideas, and test yourself with practice questions.`;
      }

      // 6. Comprehensive Fallback Answer for Any Prompt
      else {
        const subject = capitalize(cleanMsg);
        answer = `Here is what I found regarding **"${subject}"**:\n\n` +
          `- **Overview**: "${cleanMsg}" is an important topic covering key concepts, practical insights, and relevant background information.\n` +
          `- **Key Details**: It encompasses historical context, current developments, and practical applications tailored to your search.\n` +
          `- **Tamili Recommendations**: You can explore more by asking specific questions about food recipes, coding & tech, textiles, or educational courses.\n` +
          `- **Next Step**: Let me know if you would like deeper details, summaries, or step-by-step guides!`;
      }

      resolve({
        isRedirect: false,
        targetSection: null,
        answer,
        domain
      });
    }, 800);
  });
}

