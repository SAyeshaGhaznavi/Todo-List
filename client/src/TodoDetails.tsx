import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './stylesheet.css'

interface Todo {
  todono: number;
  details: string;
  done: string;
}

function TodoDetails() {
  const { id } = useParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [newdetails, setnewdetails]=useState('');

  const UpdateDetails = async (newdetails: string, todo:Todo) => {
    try {
        await axios.put(`http://localhost:5000/`, {
          todoNo:todo.todono,
          details: newdetails
        });
      //fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/todos/${id}`)
      .then(res => setTodo(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!todo) return <p>Loading...</p>; 

  return (
    <div className='flex-container'>
      <h2>Todo # {todo.todono}</h2>
      <p>{todo.details}</p>
      <p>Status: {todo.done === 'Yes' ? '✅ Done' : '❌ Not done'}</p>
      <input
      value={newdetails}
      onChange={(e)=> setnewdetails(e.target.value)}
      placeholder='Update Task'
      />
      <button onClick={()=>UpdateDetails(newdetails, todo)}>Update</button>
        <br/>
        <br/>
        <br/>
    </div>
  );
}

export default TodoDetails;
