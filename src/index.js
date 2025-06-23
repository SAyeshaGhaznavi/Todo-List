// src/index.ts
import express from 'express';
import pool from './db';

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM TODO');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
