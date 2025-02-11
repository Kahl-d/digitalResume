// api/ask.js

// node-fetch lets us do fetch() in a Node environment.
// If you get an error about 'fetch not defined', run: npm install node-fetch
import fetch from 'node-fetch';

// Summarize your personal details in a string so the model can answer questions about you.
// You can refine or expand this as needed.
const personalContext = `
You are an AI that knows all about Khalid M Khan, 
a data scientist, statistical modeling enthusiast, NLP expert, and creative designer.
Answer the user's questions from Khalid's perspective. 
If you don't know the answer, politely say so.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }

    // We'll combine your personal context with the user's question.
    // Some models might require a slightly different prompt format.
    const prompt = `${personalContext}\nUser: ${question}\nAssistant:`;

    // We'll call the Hugging Face Inference API.
    // For example, let's use the 'bigscience/bloomz' model as an example.
    // Adjust to whichever model you prefer.
    const response = await fetch(
      'https://api-inference.huggingface.co/models/bigscience/bloomz',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`, // We'll store HF_API_KEY in Vercel env vars
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          // You can add parameters if you'd like:
          // parameters: { max_new_tokens: 200, temperature: 0.7 },
        })
      }
    );

    const data = await response.json();

    // If there's an error field, let's return that.
    if (data.error) {
      return res.status(200).json({ answer: `HF API error: ${data.error}` });
    }

    // The inference API often returns an array with { generated_text }
    const rawOutput = data[0]?.generated_text || '';
    // We remove the prompt from the start, so the model doesn't echo the entire prompt.
    const answer = rawOutput.replace(prompt, '').trim() || 'No answer found.';

    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error in /api/ask:', error);
    return res.status(500).json({ answer: 'Something went wrong.' });
  }
}
