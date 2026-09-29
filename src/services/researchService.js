/**
 * Mock Research Service
 * Supports research workflow: Enter topic -> Gather data -> Organize -> Generate paper
 */

export function startResearch(topic, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!topic || topic.trim() === '') {
        reject(new Error('Research topic or question is required.'));
        return;
      }

      resolve({
        id: `res-${Date.now()}`,
        topic,
        sourcesCount: 14,
        findings: [
          'Foundational developments in AI models suggest a rise in edge deployment.',
          'Keyword indexing remains highly robust for local client classification.',
          'User experience maps verify that centered layouts maximize focused attention.'
        ],
        sources: [
          { title: 'Journal of Agentic Design (2025)', author: 'G. Deepmind' },
          { title: 'AI Engineering and Infrastructure (2026)', author: 'A. Antigravity' }
        ],
        status: 'completed',
        createdAt: new Date().toLocaleTimeString()
      });
    }, 1600);
  });
}

export function generateResearchPaper(topic, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!topic || topic.trim() === '') {
        reject(new Error('Research topic is required.'));
        return;
      }

      const paperContent = `# Comprehensive Study on ${topic}

## Abstract
This paper presents a detailed analysis of ${topic}, evaluating current challenges, technological methodologies, and future directions.

## Introduction
The research in ${topic} has witnessed massive expansion in recent years, driven by developments in computation and developer accessibility.

## Methodology
Using qualitative assessments and sample directories, we investigate modular architectures that support dynamic context state binding.

## Findings
The results verify that separating layout and logic layers allows integration of microservices without altering the UX layer.

## References
1. Antigravity Systems, 2026. Antigravity Guide.
2. Aurqo Architectural Principles, 2026. Design Guidelines.`;

      resolve({
        id: `paper-${Date.now()}`,
        topic,
        title: `A Study on ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
        content: paperContent,
        createdAt: new Date().toLocaleTimeString(),
        status: 'completed'
      });
    }, 2200);
  });
}
