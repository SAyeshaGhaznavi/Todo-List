//import express from 'express';
import express,{ Request, Response, NextFunction } from 'express';
import pool from './db';
import cors from 'cors';

interface TodoRequestBody {
  todoNo: number;
  details?: string;
  Done?: boolean;
}

const app = express();
const port: number = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let todoID:number=1;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', async (_req, res) => {

  try {
    const result = await pool.query('SELECT * FROM TODO order by todoNo asc');
    res.send(result.rows);
    
  } catch (error) {
    console.error('Error fetching TODOs:', error);
    res.status(500).json({ message: 'Error fetching TODOs' });
  }
});

app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM TODO WHERE todoNo = $1', [id]);
    const todo = result.rows[0];
    res.json(todo);
  } catch (error) {
    console.error('Error fetching TODO by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/', async (req, res) => {
  const details = req.body;
  console.log("Body ",req.body);
  console.log("details: ", details.details)

  try {
    const tempresult = await pool.query('SELECT MAX(todoNo) FROM TODO');
    const maxTodoNo = tempresult.rows[0].max || 0; // fallback to 0 if table is empty
    const todoID = maxTodoNo + 1;

    const result = await pool.query(
      `INSERT INTO TODO(todoNo, details) VALUES(${todoID},'${details.details}')`
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting TODO:', error);
    res.status(500).json({ message: 'Error creating TODO' });
  }
});

app.delete('/:id', async (req, res) => {
  //const { todoNo } = req.params.id;
  console.log("Deleting todoNo: ", req.params.id);

  try {
    await pool.query(`DELETE FROM TODO WHERE todoNo = $1`, [req.params.id]);
    //await pool.query(`UPDATE TODO SET todoNo = todoNo - 1 WHERE todoNo > $1`, [req.params.id]);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting TODO:', error);
    res.status(500).json({ message: 'Error' });
  }
});


app.put('/', async (req: Request<{}, {}, TodoRequestBody>, res: Response) => {
  const { todoNo, details, Done } = req.body;

  try {
    if (details !== undefined) {
      await pool.query(`UPDATE TODO SET details = $1 WHERE todoNo = $2`, [details, todoNo]);
    }

    if (Done !== undefined) {
      await pool.query(`UPDATE TODO SET Done = $1 WHERE todoNo = $2`, [Done, todoNo]);
    }

    res.status(200).json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('Error updating TODO:', error);
    res.status(500).json({ message: 'Error' });
  }
});


