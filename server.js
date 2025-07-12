require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const websiteInfo = require('./websiteInfo');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ask', async (req, res) => {
  const question = req.body.question;

  const prompt = `
You are a chatbot assistant for zantechbd.com. Use only the following information:

${websiteInfo}

Question: ${question}
Answer:
`;

  try {
        const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
        model: 'openai/gpt-4', 
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 256 
    },
    {
        headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yourwebsite.com',
        'X-Title': 'Website Chatbot',
        },
    }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
