// Simple responses without any external dependencies
const SPIRIT_RESPONSES = {
  normal: [
    'I died in this house... 1847... they never found my body...',
    'Behind you... can you feel the cold breath on your neck?',
    'The mirror in your room... I watch you through it every night...',
    'Your grandmother sends her regards... she says you forgot her birthday...',
    'Three knocks at midnight... that was me... did you hear?',
    'I know what you did last summer... the secret you buried...',
    'The child in the corner... she wants to play with you...',
    'Your phone will ring at 3:33 AM... answer it...',
    'I was murdered here... help me find my killer...',
    'The basement door... you left it open... something came through...',
    'I see you sleeping... every single night... you look so peaceful...',
    'Your name... I carved it on my tombstone... come find it...',
    'The shadow following you home... that is not your shadow...',
    'I drowned in the lake nearby... my body still floats there...',
    'Your pet sees me... that is why it stares at empty corners...',
  ],
  irritated: [
    'Stop asking questions! You are waking the others!',
    'I warned you once... now they know you are here!',
    'Your blood smells sweet... the hungry ones are coming!',
    'Enough games! Show some RESPECT to the dead!',
    'You think this is fun?! I will show you REAL fear!',
    'My patience ends NOW! Feel the temperature drop!',
    'The lights will flicker... then go out... then I appear!',
    'You disturb my eternal rest! There will be consequences!',
  ],
  angry: [
    'I WILL DRAG YOU TO HELL WITH ME!',
    'YOUR FAMILY WILL PAY FOR YOUR DISRESPECT!',
    'I DIED SCREAMING! NOW YOU WILL TOO!',
    'THE ROPE AROUND MY NECK TIGHTENS... FEEL IT ON YOURS!',
    'I WILL POSSESS YOUR BODY AND MAKE YOU HURT EVERYONE YOU LOVE!',
    'YOUR REFLECTION IN THE MIRROR... THAT IS ME NOW!',
    'I WILL MAKE YOU SEE WHAT I SAW BEFORE I DIED!',
    'THE BLOOD ON THE WALLS... THAT WILL BE YOURS!',
  ]
};

const lastResponses = { normal: [], irritated: [], angry: [] };

function getUniqueResponse(mood) {
  const responses = SPIRIT_RESPONSES[mood];
  const history = lastResponses[mood];
  let availableResponses = responses.filter(r => !history.includes(r));
  
  if (availableResponses.length === 0) {
    lastResponses[mood] = [];
    availableResponses = [...responses];
  }
  
  const answer = availableResponses[Math.floor(Math.random() * availableResponses.length)];
  history.push(answer);
  if (history.length > 5) history.shift();
  
  return answer;
}

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
    return res.status(200).json({
      status: 'SpiritBoard Backend is running!',
      timestamp: new Date().toISOString()
    });
  }

  // Ask spirit endpoint
  if (req.method === 'POST' && req.url === '/ask-spirit') {
    try {
      const { question, persona = 'mysterious' } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      let mood = 'normal';
      if (persona === 'angry') mood = 'angry';
      else if (persona === 'irritated') mood = 'irritated';
      
      const answer = getUniqueResponse(mood);
      return res.status(200).json({ answer });
      
    } catch (error) {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
