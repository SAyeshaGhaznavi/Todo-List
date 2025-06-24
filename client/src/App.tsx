import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoApp from './todoapp';
import TodoDetails from './TodoDetails'; // You need to create this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/todos/:id" element={<TodoDetails />} />
      </Routes>
    </Router>
  );
}

export default App