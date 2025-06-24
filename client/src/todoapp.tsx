import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stylesheet.css'
import { Link } from 'react-router-dom';



interface Todo {
  todono: number;
  details: string;
  done: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/');
      setTodos(res.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async () => {
    try {
      await axios.post('http://localhost:5000/', { details: newTodo });
      //setNewTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const deleteTodo = async (todoNo: number) => {
    console.log('on click: ', todoNo)
    try {
      await axios.delete(`http://localhost:5000/${todoNo}`);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const toggleDone = async (todo: Todo) => {
    try {
        if(todo.done==='Yes')
        {
            await axios.put('http://localhost:5000/', {
              todoNo: todo.todono,
              Done: 'No'
            });
        }
        else
        {
            await axios.put('http://localhost:5000/', {
              todoNo: todo.todono,
              Done: 'Yes'
            });
        }
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const UpdateDetails = async (todo: Todo) => {
    try {
        if(todo.done==='Yes')
        {
            await axios.put('http://localhost:5000/', {
              todoNo: todo.todono,
              Done: 'No'
            });
        }
        else
        {
            await axios.put('http://localhost:5000/', {
              todoNo: todo.todono,
              Done: 'Yes'
            });
        }
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className='body'>
    <div className="flex-container">
      <h2>Todo List</h2>
      <input 
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.todono}>
            
            <span
              style={{ textDecoration: todo.done==='Yes' ? 'line-through' : 'none', cursor: 'pointer' }}
              onClick={() => toggleDone(todo)}
            >
              <div className='details'>
              {todo.details}
              </div>
            </span>
            <button className='button2' onClick={() => deleteTodo(todo.todono)}>❌</button>
            <button onClick={() => window.location.href = `/todos/${todo.todono}`}>Details</button>
            
          </li>
        ))}
      </ul>
    </div>
     </div>
  );
};

export default TodoApp;
