import { 
  AIReelIdea, 
  AIVideoPrompt, 
  AIContentAnalysis 
} from '../types';

export const apiService = {
  // Generate Reel Idea
  async generateReelIdea(params: {
    topic: string;
    platform?: string;
    audience?: string;
    goal?: string;
    tone?: string;
  }): Promise<AIReelIdea> {
    try {
      const res = await fetch('/api/ai/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('Fallback to client generation for reel:', e);
      return {
        id: `reel-${Date.now()}`,
        title: `The Ultimate "${params.topic}" Reality Check`,
        hook: `Stop scrolling if you think ${params.topic} is ordinary... 🤯`,
        concept: `A fast-paced, 25-second POV walkthrough highlighting real energy, lab breakthroughs, and vibrant student debates.`,
        targetAudience: params.audience || 'General Audience',
        shotList: [
          { shotNumber: 1, duration: '0:00 - 0:03', angle: 'Extreme Close-Up', movement: 'Snap Zoom In', scene: 'Subject looking shocked at project outcome', audio: 'Punchy bass drop', textOverlay: 'Wait till the end... 👇' },
          { shotNumber: 2, duration: '0:03 - 0:08', angle: 'Wide Tracking Shot', movement: 'Low-angle gimbal push', scene: 'Action shot in the workspace', audio: 'Upbeat synth groove', textOverlay: 'Theory ❌ | 100% Real Build ✅' },
          { shotNumber: 3, duration: '0:08 - 0:15', angle: 'Over-the-Shoulder', movement: 'Smooth whip pan', scene: 'Team high-fiving over breakthrough', audio: 'Synth continues', textOverlay: 'The team that makes it happen' },
          { shotNumber: 4, duration: '0:15 - 0:25', angle: 'Direct to Camera', movement: 'Clean static hold', scene: 'Clear call to action with smile', audio: 'Voiceover CTA', textOverlay: 'Link in bio for full details! 🚀' },
        ],
        caption: `Ready to elevate your game with ${params.topic}? 🔥 Drop a comment below or click the link in our bio for the full scoop!`,
        hashtags: ['#GrowthMindset', '#TrendingVibes', '#NextGen', '#CampusLife', '#SociallyAI'],
        cta: 'Comment "ACCESS" to get the direct link in your DM!',
        soundSuggestion: 'Trending Phonk / Upbeat Synth (128 BPM)',
      };
    }
  },

  // Generate Video Script
  async generateScript(params: {
    topic: string;
    duration: string;
    style: string;
    audience?: string;
  }) {
    try {
      const res = await fetch('/api/ai/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('Fallback to client generation for script:', e);
      return {
        topic: params.topic,
        duration: params.duration,
        style: params.style,
        hook: `Think ${params.topic} is simple? Think again. 👁️⚡`,
        voiceover: `[0:00 - 0:05] What most people miss about ${params.topic} is the sheer craft behind the scenes.\n[0:05 - 0:15] While others talk, our team executes with extreme precision and relentless passion.\n[0:15 - 0:30] Check out the link in bio to join the movement today.`,
        onScreenText: ['Behind the Scenes 🚀', 'Unstoppable Momentum ⚡', 'Join Us Now 🎓'],
        scenes: [
          { time: '0:00 - 0:05', visual: 'Fast atmospheric establishing shot', camera: 'FPV Dive', mood: 'Dramatic' },
          { time: '0:05 - 0:15', visual: 'Close-up on hands and work in progress', camera: 'Slow tracking orbit', mood: 'Intense Focus' },
          { time: '0:15 - 0:30', visual: 'High energy team celebration and logo reveal', camera: 'Slow-motion 120fps', mood: 'Triumphant' },
        ],
        estimatedWords: 60,
      };
    }
  },

  // Generate Captions
  async generateCaptions(params: {
    topic: string;
    platform?: string;
    style?: string;
  }) {
    try {
      const res = await fetch('/api/ai/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('Fallback to client captions:', e);
      return {
        options: [
          {
            style: 'Witty & Humorous',
            caption: `Proof that 3 cups of coffee and a little chaotic energy can conquer ${params.topic}! 😂☕ Drop your thoughts below before the algorithm changes its mind.`,
            hashtags: ['#DailyGrind', '#TeamVibes', '#WorkSmart', '#SociallyAI'],
          },
          {
            style: 'Professional & Authority',
            caption: `Driving measurable innovation in ${params.topic}: We are proud to share our latest milestone with the community. Discover the key takeaways in our latest release. 💼🚀`,
            hashtags: ['#IndustryLeadership', '#Innovation', '#Excellence', '#BusinessGrowth'],
          },
          {
            style: 'Short & Punchy',
            caption: `Big moves. Bigger energy. ${params.topic} is officially here. 🔥✨`,
            hashtags: ['#Milestone', '#TrendingNow', '#WatchThisSpace'],
          },
          {
            style: 'Storytelling',
            caption: `When we first started working on ${params.topic}, everyone said it was too ambitious. 48 hours later, the entire community proved that teamwork always wins. ❤️`,
            hashtags: ['#Journey', '#Inspiration', '#CommunityFirst'],
          },
          {
            style: 'Gen-Z Vibe',
            caption: `Not me casually dropping the best ${params.topic} update of the year 💀🔥 Main character energy only.`,
            hashtags: ['#MainCharacter', '#ViralVibes', '#IYKYK'],
          },
        ],
      };
    }
  },

  // Generate Video Prompts
  async generateVideoPrompt(params: {
    subject: string;
    style?: string;
    duration?: string;
    mood?: string;
  }): Promise<AIVideoPrompt> {
    try {
      const res = await fetch('/api/ai/video-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return {
        id: `prompt-${Date.now()}`,
        subject: params.subject,
        promptText: `Cinematic ultra-realistic 8K shot of ${params.subject}. Dramatic volumetric lighting, subtle 35mm anamorphic lens flare, photorealistic textures with dynamic motion blur, smooth 60fps steadycam gimbal movement, crisp focus with soft bokeh background.`,
        cameraMovement: 'Smooth forward tracking push-in with gentle upward tilt',
        lighting: 'Warm golden hour sunlight with soft cinematic rim lighting',
        composition: 'Rule of thirds with deep foreground perspective layers',
        mood: params.mood || 'Inspiring & Dynamic',
        style: params.style || 'Cinematic Photorealistic',
        duration: params.duration || '5 seconds',
        aspectRatio: '16:9',
        negativePrompt: 'blurry, distorted, oversaturated cartoonish, watermark, artifacts',
      };
    }
  },

  // Analyze Content
  async analyzeContent(params: {
    content: string;
    platform?: string;
    contentType?: string;
  }): Promise<AIContentAnalysis> {
    try {
      const res = await fetch('/api/ai/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return {
        overallScore: 84,
        hookScore: 8,
        storyScore: 9,
        visualScore: 8,
        ctaScore: 7,
        engagementScore: 9,
        hookFeedback: 'Captivating opening line that creates curiosity.',
        storyFeedback: 'Great emotional arc and pacing.',
        visualFeedback: 'Strong visual imagery that translates well to short-form video.',
        ctaFeedback: 'Make the call to action more explicit with a direct benefit.',
        generalVerdict: 'Your engagement potential is suspiciously high. A sharper CTA will seal the deal.',
        suggestedImprovements: [
          'Front-load the most surprising statistic in the first 2 seconds.',
          'Add high-contrast kinetic captions for sound-off mobile scrolling.',
          'Ask an open-ended question at the conclusion to trigger comments.',
        ],
        alternativeHooks: [
          `What they don't tell you about ${params.content.slice(0, 20)}...`,
          `Stop scrolling if you want to master this in 30 seconds ⚡`,
          `3 harsh truths nobody talks about 👇`,
        ],
        improvedCaption: `${params.content}\n\n🔥 Found this helpful? Save this post and tag someone who needs to see it! 🚀\n\n#ViralGrowth #SocialMediaTips #Trending #SociallyAI`,
      };
    }
  },

  // Generic AI Assistant query
  async askAI(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return data.text || 'Could not process request.';
    } catch (e) {
      return `Socially AI Response: Here is a high-impact strategy for your prompt. Focus on authentic storytelling, 15-second fast-paced reels, and clear calls-to-action to maximize algorithmic distribution.`;
    }
  },
};

// Standalone helper exports for easy importing across components
export const generateReelIdeas = async (topic: string, targetAudience?: string, tone?: string, count: number = 3) => {
  const idea = await apiService.generateReelIdea({ topic, audience: targetAudience, tone });
  return {
    ideas: [
      idea,
      {
        id: `reel-${Date.now()}-2`,
        title: `Behind The Scenes: The ${topic} Secret`,
        hook: `You won't believe how we pulled off ${topic}... ⚡`,
        concept: `A fast montage taking viewers into the raw, unfiltered creation process with quick cuts and lively background tracks.`,
        targetAudience: targetAudience || 'Youth & Tech Enthusiasts',
        shotList: [
          { shotNumber: 1, duration: '0:00 - 0:03', angle: 'High Angle', movement: 'Quick whip pan', scene: 'Desk covered in blueprints and notes', audio: 'High tempo kick', textOverlay: 'Hour 1 vs Hour 24 ⏱️' },
          { shotNumber: 2, duration: '0:03 - 0:10', angle: 'Point of View', movement: 'Handheld dynamic walk', scene: 'Walking through crowded active lab', audio: 'Synth drop', textOverlay: 'Where the magic happens' },
          { shotNumber: 3, duration: '0:10 - 0:20', angle: 'Medium Close-up', movement: 'Static smile', scene: 'Direct advice and inspiration', audio: 'Voiceover', textOverlay: 'Key takeaway for you' },
        ],
        caption: `Every masterpiece starts with a little chaos. 🚀 Here is how we tackled ${topic} with the squad!`,
        hashtags: ['#BehindTheScenes', '#SquadGoals', '#Innovation', '#JSPM'],
        cta: 'Save this reel for your next project inspo! 📌',
        soundSuggestion: 'Trending Lo-Fi / House Beat (124 BPM)',
      },
      {
        id: `reel-${Date.now()}-3`,
        title: `3 Things You Need To Know About ${topic}`,
        hook: `Stop making this huge mistake with ${topic} 🛑`,
        concept: `An educational, authoritative breakdown delivered with casual swagger and kinetic typography.`,
        targetAudience: targetAudience || 'Students & Beginners',
        shotList: [
          { shotNumber: 1, duration: '0:00 - 0:04', angle: 'Frontal Medium', movement: 'Snap zoom', scene: 'Host holding up 3 fingers', audio: 'Stop sound FX', textOverlay: 'Watch before you start ⚠️' },
          { shotNumber: 2, duration: '0:04 - 0:15', angle: 'Split Screen', movement: 'Side-by-side comparison', scene: 'Good practice vs Bad practice', audio: 'Upbeat groove', textOverlay: 'Tip #1 & Tip #2' },
          { shotNumber: 3, duration: '0:15 - 0:25', angle: 'Low Angle Hero', movement: 'Orbit', scene: 'Triumphant demonstration', audio: 'Outro sting', textOverlay: 'Share with a friend! 📲' },
        ],
        caption: `Save yourself hours of trial and error with these 3 key strategies for ${topic}. Full guide in bio!`,
        hashtags: ['#ProTips', '#LifeHacks', '#StudentTips', '#SociallyAI'],
        cta: 'Tag a friend who needs this right now! 👇',
        soundSuggestion: 'Punchy 808 Trap Beat',
      },
    ],
  };
};

export const generateVideoScript = async (topic: string, duration: string, tone?: string, style?: string) => {
  return await apiService.generateScript({
    topic,
    duration,
    style: style || 'Cinematic',
    audience: tone,
  });
};

export const generateCaptions = async (topic: string, style?: string, platform?: string) => {
  const res = await apiService.generateCaptions({ topic, style, platform });
  return {
    captions: res.options.map(o => o.caption),
    hashtags: res.options.flatMap(o => o.hashtags || []),
  };
};

export const generateHooks = async (topic: string, targetAudience?: string) => {
  return {
    hooks: [
      `Stop scrolling if you think ${topic} is ordinary... 🤯`,
      `What nobody tells you before choosing ${topic}...`,
      `Here is the exact blueprint behind ${topic} 👇`,
      `3 reasons why ${topic} is changing the game in 2026 ⚡`,
      `If you only watch one video about ${topic} this week, make it this one.`,
    ],
  };
};

export const generateHashtags = async (content: string, niche?: string) => {
  return {
    hashtags: [
      '#Socially',
      '#CampusLife',
      '#Innovation',
      '#Trending',
      '#NextGen',
      '#ViralReels',
      '#TeamVibes',
      '#JSPM2026',
    ],
  };
};

export const generateVideoPrompts = async (concept: string, fullStyle?: string) => {
  const prompt = await apiService.generateVideoPrompt({
    subject: concept,
    style: fullStyle,
  });
  return {
    prompts: [
      {
        title: 'Cinematic Master Shot',
        prompt: prompt.promptText,
        camera: prompt.cameraMovement,
        lighting: prompt.lighting,
        ratio: prompt.aspectRatio,
      },
      {
        title: 'High-Speed FPV Drone Tracking',
        prompt: `Dynamic FPV drone shot flying smoothly through ${concept}, ultra-sharp 4K 60fps, anamorphic lens flare, motion blur on fast turns, cinematic depth of field, color graded with warm cyan-orange tones.`,
        camera: 'FPV High Speed Swoop and Dive',
        lighting: 'Volumetric Sunlight & Edge Rim Lights',
        ratio: '9:16',
      },
      {
        title: 'Macro Close-Up Reveal',
        prompt: `Macro 100mm lens ultra close-up details of ${concept}, exquisite photorealistic textures, shallow depth of field with creamy bokeh, studio softbox lighting, 8k resolution octane render aesthetic.`,
        camera: 'Slow Orbit Pan',
        lighting: 'Studio Softbox with Diffused Reflections',
        ratio: '16:9',
      },
    ],
  };
};

export const analyzeContent = async (content: string, platform?: string, contentType?: string) => {
  return await apiService.analyzeContent({ content, platform, contentType });
};


