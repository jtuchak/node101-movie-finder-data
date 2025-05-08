const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const app = express();

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
app.use(morgan('dev'));
const cache = {};
const API_KEY = '97d8afb5';
const OMDB_URL = 'http://www.omdbapi.com/';

app.get('/', async (req, res) => {
  const { i, t } = req.query;
  const cacheKey = i ? `i=${i}` : t ? `t=${t.toLowerCase()}` : null;

  if (!cacheKey) {
    return res.status(400).json({ error: 'Missing i or t parameter' });
  }

  if (cache[cacheKey]) {
    return res.json(cache[cacheKey]);
  }

  try {
    const response = await axios.get(OMDB_URL, {
      params: {
        ...(i && { i }),
        ...(t && { t }),
        apikey: API_KEY,
      },
    });

    cache[cacheKey] = response.data;
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

module.exports = app;