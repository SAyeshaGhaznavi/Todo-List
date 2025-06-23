import express from 'express';
import pool from './db';
import cors from 'cors';


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

app.get('/:id', (req, res) => {
  const { todoNo } = req.query;
  res.send(`New Page: ${todoNo}`);
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

app.delete('/', async(req, res)=>{
    const deleteID=req.body;
    console.log("Body ",req.body);
    console.log("details: ", deleteID.todoNo)

    try {

        const result=await pool.query(`DELETE from TODO where todoNo=${deleteID.todoNo}`);
        pool.query(`UPDATE TODO set todoNo=todoNo-1 where todoNo>${deleteID.todoNo}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting TODO:', error);
        res.status(500).json({ message: 'Error' });
    }

});

app.put('/', async(req, res)=>{
    const Update=req.body;
    console.log("Body ",req.body);
    console.log("ID: ", Update.todoNo);
    
    if(!Update.Done)
    {
        try {
            console.log("Details: ", Update.details);
            const result=await pool.query(`UPDATE TODO 
                SET details='${Update.details}' 
                where todoNO=${Update.todoNo};`);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error Updating TODO:', error);
            res.status(500).json({ message: 'Error' });
        }
    }
    else if(!Update.details)
    {
        try {
            console.log("Done: ", Update.Done);
            const result=await pool.query(`UPDATE TODO 
                SET Done='${Update.Done}' 
                where todoNO=${Update.todoNo};`);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error Updating TODO:', error);
            res.status(500).json({ message: 'Error' });
        }
    }
});

