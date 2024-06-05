const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-message', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not found' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150, // Increased max tokens for complete message
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const generatedMessage = response.data.choices.map(choice => choice.message.content).join('\n');
            res.json({ message: generatedMessage });
        } else {
            res.status(500).json({ error: 'Invalid response from OpenAI API' });
        }
    } catch (error) {
        console.error('Error generating message:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate message' });
    }
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
