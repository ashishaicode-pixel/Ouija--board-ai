// Vercel Serverless Function for Spirit Responses
const SPIRIT_RESPONSES = {
  normal: [
    'I died in this house... 1847... they never found my body...',
    'Behind you... can you feel the cold breath on your neck?',
    'The mirror in your room... I watch you through it every night...',
    'Three knocks at midnight... that was me... did you hear?',
    'I know what you did last summer... the secret you buried...',
    'The child in the corner... she wants to play with you...',
    'I was murdered here... help me find my killer...',
    'I see you sleeping... every single night... you look so peaceful...',
    'The shadow following you home... that is not your shadow...',
    'Your pet sees me... that is why it stares at empty corners...',
  ],
  irritated: [
    'Stop asking questions! You are waking the others!',
    'I warned you once... now they know you are here!',
    'Your blood smells sweet... the hungry ones are coming!',
    'You think this is fun?! I will show you REAL fear!',
    'My patience ends NOW! Feel the temperature drop!',
    'You disturb my eternal rest! There will be consequences!',
  ],
  angry: [
    'I WILL DRAG YOU TO HELL WITH ME!',
    'YOUR FAMILY WILL PAY FOR YOUR DISRESPECT!',
    'I DIED SCREAMING! NOW YOU WILL TOO!',
    'I WILL POSSESS YOUR BODY!',
    'THE BLOOD ON THE WALLS... THAT WILL BE YOURS!',
  ]
};

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, persona = 'mysterious' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    let mood = 'normal';
    if (persona === 'angry') mood = 'angry';
    else if (persona === 'irritated') mood = 'irritated';
    
    const responses = SPIRIT_RESPONSES[mood] || SPIRIT_RESPONSES.normal;
    const answer = responses[Math.floor(Math.random() * responses.length)];

    return res.status(200).json({ answer });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
