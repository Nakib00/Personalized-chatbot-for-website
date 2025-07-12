require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const websiteUrl = 'https://www.zantechbd.com/';

// Function to fetch and clean website text
async function getWebsiteText(url) {
  try {
    const response = await axios.get(url);
    // Basic cleaning of HTML tags. 
    // For more complex sites, a more advanced parser like Cheerio might be better.
    const text = response.data.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text;
  } catch (error) {
    console.error('Error fetching website data:', error);
    return '';
  }
}

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  const websiteText = await getWebsiteText(websiteUrl);

  if (!websiteText) {
    return res.status(500).json({ error: 'Could not fetch website information.' });
  }

  const prompt = `
You are a chatbot assistant for zantechbd.com. Use only the following real-time information from the website:

${websiteText}

Question: ${question}
Answer:
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});