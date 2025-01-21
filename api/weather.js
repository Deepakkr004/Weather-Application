const axios = require('axios');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { city } = req.body;
        const apiKey = process.env.API_KEY;

        if (!city) {
            return res.status(400).json({ error: 'City name is required' });
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            const response = await axios.get(url);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
