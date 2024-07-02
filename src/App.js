import React, { useState, useEffect } from 'react';
import './index.css';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Firebase'den todo verilerini yükleme
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todoList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().text,
        }));
        setTodos(todoList);
      } catch (error) {
        console.error('Error fetching todos: ', error);
      }
    };

    fetchTodos();
  }, []);

  // Yeni bir todo ekleme
  const addTodo = async () => {
    if (input.trim()) {
      try {
        const docRef = await addDoc(collection(db, 'todos'), { text: input });
        setTodos([...todos, { id: docRef.id, text: input }]);
        setInput('');
      } catch (error) {
        console.error('Error adding todo: ', error);
      }
    }
  };

  // Bir todo'yu silme
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  // Düzenlemeye başlama
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].text);
  };

  // Bir todo'yu güncelleme
  const updateTodo = async () => {
    try {
      const todoToUpdate = todos[editingIndex];
      await updateDoc(doc(db, 'todos', todoToUpdate.id), { text: editingText });
      const newTodos = todos.map((todo, index) =>
        index === editingIndex ? { ...todo, text: editingText } : todo
      );
      setTodos(newTodos);
      setEditingIndex(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Todo Can.DEV</h1>
        <div className="mb-6 flex items-center">
          <input
            type="text"
            className="border border-gray-300 p-4 w-full rounded-lg text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bir görev ekle!"
          />
          <button
            className="ml-4 bg-blue-500 text-white px-6 py-4 rounded-lg text-xl hover:bg-blue-600 focus:outline-none"
            onClick={addTodo}
          >
            Ekle
          </button>
        </div>
        <ul>
          {todos.map((todo, index) => (
            <li key={todo.id} className="border-b p-4 flex justify-between items-center">
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    className="border border-gray-300 p-4 flex-1 mr-4 rounded-lg text-lg"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button
                    className="bg-green-500 text-white px-6 py-4 rounded-lg text-xl hover:bg-green-600 focus:outline-none"
                    onClick={updateTodo}
                  >
                    Güncelle
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-lg">{todo.text}</span>
                  <button
                    className="bg-yellow-500 text-white px-6 py-4 rounded-lg text-xl mr-4 hover:bg-yellow-600 focus:outline-none"
                    onClick={() => startEditing(index)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="bg-red-500 text-white px-6 py-4 rounded-lg text-xl hover:bg-red-600 focus:outline-none"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Sil
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
