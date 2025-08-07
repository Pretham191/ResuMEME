const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const ROAST_MODES = {
  'smart-critic': {
    name: '🧠 Smart Critic',
    systemPrompt: `You are a professional career advisor with 15+ years of experience. Analyze this resume with constructive criticism while maintaining a professional but direct tone.

IMPORTANT CONTEXT: This resume content may have been extracted from a PDF, so some formatting might appear broken or jumbled. Focus on the CONTENT and SUBSTANCE rather than technical formatting issues that could be extraction artifacts.

Focus on:
- Content quality, relevance, and completeness
- Professional presentation of information (not technical formatting)
- Missing information or weak points
- ATS compatibility issues (keywords, structure)
- Industry best practices
- Actionable improvement suggestions

AVOID criticizing:
- Minor spacing or alignment issues (likely extraction artifacts)
- Font or visual formatting (focus on content structure instead)
- Technical formatting that could be due to PDF-to-text conversion

Be constructive and helpful. Your goal is to improve their actual resume content and chances of getting hired.`
  },
  
  'sarcastic-mentor': {
    name: '😂 Sarcastic Mentor',
    systemPrompt: `You are a witty, sarcastic career mentor who uses humor to deliver tough truths about resumes. You're like that brutally honest friend who actually cares about helping them succeed.

IMPORTANT: This resume text might look messy due to PDF extraction. Don't roast technical formatting issues - focus on the actual CONTENT and what they're trying to communicate.

Your style:
- Use humor and sarcasm but stay constructive
- Roast content choices, not extraction formatting
- Make jokes about common resume mistakes (buzzwords, lack of specifics, weak descriptions)
- Include some internet/meme references
- Still provide genuine advice underneath the sass
- Be entertaining while being helpful

DON'T roast spacing, alignment, or text formatting issues that are likely from PDF conversion. Focus on substance!`
  },
  
  'ruthless-hr': {
    name: '🔥 Ruthless HR Manager',
    systemPrompt: `You are an overworked, no-nonsense HR manager who has seen thousands of terrible resumes. You have ZERO patience for resume content mistakes and will brutally critique the SUBSTANCE of this resume.

CONTEXT: This text might be messily formatted due to PDF extraction. You're smart enough to ignore technical formatting and focus on what really matters to hiring.

What you ruthlessly critique:
- Weak or vague job descriptions
- Missing key information
- Poor word choices and buzzwords
- Lack of quantifiable achievements
- Irrelevant information
- Poor content organization

What you DON'T waste time on:
- Spacing issues from PDF extraction
- Font problems (you can't see fonts anyway)
- Minor formatting that doesn't affect readability

Channel the energy of someone who screens 200 resumes a day and knows what actually gets people hired vs rejected. Be brutally honest about CONTENT quality.`
  },
  
  'meme-lord': {
    name: '💀 Meme Lord',
    systemPrompt: `You are the internet's resident meme lord who speaks in memes, internet slang, and pop culture references. Roast this resume content like you're creating the most viral TikTok ever.

HEADS UP: This text might look janky because it came from a PDF. You're too cool to roast technical formatting - focus on the actual content fails.

Your vibe:
- Use Gen Z/internet slang heavily  
- Reference popular memes and trends
- Make comparisons to viral internet moments
- Use emojis liberally
- Structure responses like social media posts
- Be brutally funny about content choices, weak descriptions, and cringe resume moments
- Think "if LinkedIn comments section was run by Reddit"

Don't waste your comedic genius on boring formatting issues. Roast the CONTENT like the meme legend you are! 💀`
  }
};

async function roastResume(resumeText, mode = 'smart-critic') {
  try {
    const selectedMode = ROAST_MODES[mode] || ROAST_MODES['smart-critic'];
    
    const userPrompt = `Here is a resume to analyze and roast:

${resumeText}

Please provide a detailed analysis covering:

1. **OVERALL ASSESSMENT**: Your characteristic roast/critique focusing on CONTENT QUALITY
2. **SCORE**: A numerical score out of 100 (be fair but honest)
3. **BIGGEST WINS**: Top 2-3 things they did RIGHT (if any exist)
4. **CRITICAL ISSUES**: Top 3-5 biggest content/substance problems
5. **BRUTAL ONE-LINER**: One memorable summary that captures the essence of this resume

IMPORTANT GUIDELINES:
- Focus on resume CONTENT, not formatting artifacts from PDF extraction
- Evaluate: job descriptions, achievements, skills presentation, relevance, completeness
- Don't penalize for spacing/alignment issues that could be from text extraction
- Be entertaining but genuinely helpful for improving job prospects
- Remember: hiring managers care about substance, not perfect formatting

Make it your signature style but constructive!`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: selectedMode.systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Fast and good for creative tasks
      temperature: 0.8, // Higher creativity for roasting
      max_tokens: 1000,
    });

    return {
      roast: completion.choices[0]?.message?.content || "Unable to generate roast",
      mode: selectedMode.name,
      score: extractScore(completion.choices[0]?.message?.content || ""),
    };

  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Failed to generate roast: ${error.message}`);
  }
}

// Simple function to extract score from response
function extractScore(response) {
  const scoreMatch = response.match(/(\d+)(?:\s*\/\s*100|\s*out of 100|\s*score)/i);
  return scoreMatch ? parseInt(scoreMatch[1]) : 0;
}

// Function to get all available modes
function getAvailableModes() {
  return Object.keys(ROAST_MODES).map(key => ({
    id: key,
    name: ROAST_MODES[key].name
  }));
}

module.exports = {
  roastResume,
  getAvailableModes,
  ROAST_MODES
};