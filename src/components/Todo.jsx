import React, { useEffect, useRef, useState } from 'react';
import todo_icon from '../assets/todo_icon.png';
import TodoItems from './TodoItems';
import delete_icon from '../assets/delete.png';
import Chatbot from './chatbot';

const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [week, setWeek] = useState("");
  const [weeks, setWeeks] = useState(localStorage.getItem("weeks") ? JSON.parse(localStorage.getItem("weeks")) : []);
  const inputRef = useRef();
  const weekRef = useRef();
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    if (week) {
      const savedTodos = localStorage.getItem(week);
      setTodoList(savedTodos ? JSON.parse(savedTodos) : []);
    }
  }, [week]);

  const add = (taskDetails = {}) => {
    const inputText = taskDetails.text || inputRef.current.value.trim();
    if (inputText === "") return;

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
      day: taskDetails.day || "",
      time: taskDetails.time || "",
      category: taskDetails.category || ""
    };
    
    setTodoList(prev => [...prev, newTodo]);
    
    if (!taskDetails.text) {
      inputRef.current.value = "";
    }
  };

  const deleteToDo = (id) => {
    setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const toggle = (id) => {
    setTodoList(prevTodos => prevTodos.map(todo => (
      todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
    )));
  };

  const updateDay = (id, day) => {
    setTodoList(prevTodos => prevTodos.map(todo => (
      todo.id === id ? { ...todo, day } : todo
    )));
  };

  const updateTime = (id, time) => {
    setTodoList(prevTodos => prevTodos.map(todo => (
      todo.id === id ? { ...todo, time } : todo
    )));
  };

  const updateCategory = (id, category) => {
    setTodoList(prevTodos => prevTodos.map(todo => (
      todo.id === id ? { ...todo, category } : todo
    )));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') add();
  };

  const handleWeekKeyPress = (event) => {
    if (event.key === 'Enter') createNewWeek();
  };

  const saveCurrentWeek = () => {
    if (week) {
      localStorage.setItem(week, JSON.stringify(todoList));
      localStorage.setItem("weeks", JSON.stringify(weeks));
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (selectedTaskId !== null) {
      updateCategory(selectedTaskId, category);
    } else if (todoList.length > 0) {
      const latestTaskId = todoList[todoList.length - 1].id;
      updateCategory(latestTaskId, category);
    }
  };

  const sortTasks = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    setTodoList(prevTodos => {
      const sortedTodos = [...prevTodos].sort((a, b) => {
        const dayA = daysOfWeek.indexOf(a.day);
        const dayB = daysOfWeek.indexOf(b.day);
        return dayA === dayB ? a.time.localeCompare(b.time) : dayA - dayB;
      });
      return sortedTodos;
    });
  };

  const createNewWeek = () => {
    const newWeek = weekRef.current.value.trim();
    if (newWeek && !weeks.includes(newWeek)) {
      setWeeks(prevWeeks => [...prevWeeks, newWeek]);
      setWeek(newWeek);
      weekRef.current.value = "";
      setTodoList([]);
    }
  };

  const deleteWeek = (weekToDelete) => {
    setWeeks(prevWeeks => prevWeeks.filter(w => w !== weekToDelete));
    localStorage.removeItem(weekToDelete);
    if (week === weekToDelete) {
      setWeek("");
      setTodoList([]);
    }
    localStorage.setItem("weeks", JSON.stringify(weeks.filter(w => w !== weekToDelete)));
  };

  const CategoryButton = ({ category, label, bgColor, selectedBgColor }) => (
    <button
      onClick={() => handleCategoryClick(category)}
      className={`border-none rounded-full w-24 h-10 text-white font-medium cursor-pointer ${selectedCategory === category ? selectedBgColor : bgColor}`}
      aria-label={`Select ${label} category`}
    >
      {label}
    </button>
  );

  return (
    <div className='bg-white place-self-center w-full max-w-6xl flex flex-col items-start'>
      {/* Move New Week button to the top-left corner */}
      <div className='flex w-full justify-between'>
        <button
          onClick={createNewWeek}
          className='border-none rounded-full bg-blue-600 w-32 h-12 text-white text-lg font-medium cursor-pointer mt-4 ml-4'
          aria-label="Create new week"
        >
          New Week
        </button>
      </div>
      <div className='w-full flex flex-row'>
        <div className='w-1/4 bg-gray-100 p-4 rounded-xl'>
          <div className='flex flex-col'>
            <h2 className='text-2xl font-semibold mb-4'>Weeks</h2>
            {weeks.map((weekItem, index) => (
              <div key={index} className="flex items-center justify-between my-2">
                <button
                  onClick={() => setWeek(weekItem)}
                  className={`border-none rounded-full bg-gray-300 w-full h-10 text-black text-lg font-medium cursor-pointer ${week === weekItem ? 'bg-gray-500 text-white' : ''}`}
                  aria-label={`Switch to week ${weekItem}`}
                >
                  {weekItem}
                </button>
                <img
                  onClick={() => deleteWeek(weekItem)}
                  src={delete_icon}
                  alt="Delete week"
                  className='w-5 ml-2 cursor-pointer'
                  role="button"
                  aria-label="Delete week"
                />
              </div>
            ))}
          </div>
        </div>
        <div className='w-3/4 flex flex-col p-10 min-h-[650px] rounded-xl'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <img className='w-12' src={todo_icon} alt="todo icon" />
              <h1 className='text-4xl font-semibold'>To-Do List {week && `- Week of ${week}`}</h1>
            </div>
            <button
              onClick={saveCurrentWeek}
              className='border-none rounded-full bg-green-600 w-40 h-10 text-white text-lg font-medium cursor-pointer'
              aria-label="Save current week"
            >
              Save Week
            </button>
          </div>
          <div className='flex items-center my-4'>
            <input 
              ref={weekRef} 
              className='bg-transparent border-0 outline-none flex-1 h-12 pl-2 pr-2 placeholder:text-slate-600 text-xl'
              type="text" 
              placeholder='Enter the week'
              onKeyPress={handleWeekKeyPress}
              aria-label="Enter the week"
            />
          </div>
          <div className='flex items-center my-10 bg-gray-200 rounded-full'>
            <input
              ref={inputRef}
              className='bg-transparent border-0 outline-none flex-1 h-16 pl-8 pr-4 placeholder:text-slate-600 text-xl'
              type="text"
              placeholder='Add your task'
              onKeyPress={handleKeyPress}
              aria-label="Add your task"
            />
            <button
              onClick={add}
              className='border-none rounded-full bg-orange-600 w-40 h-16 text-white text-xl font-medium cursor-pointer'
              aria-label="Add task"
            >
              ADD+
            </button>
          </div>
          <div className='flex justify-around my-4'>
            <CategoryButton category="daily" label="Daily" bgColor="bg-yellow-300" selectedBgColor="bg-yellow-500" />
            <CategoryButton category="important" label="Important" bgColor="bg-red-300" selectedBgColor="bg-red-500" />
            <CategoryButton category="leisure" label="Leisure" bgColor="bg-green-300" selectedBgColor="bg-green-500" />
          </div>
          <div className='flex justify-center my-4'>
            <button
              onClick={sortTasks}
              className='border-none rounded-full bg-blue-600 w-40 h-10 text-white text-lg font-medium cursor-pointer'
              aria-label="Arrange tasks"
            >
              Arrange
            </button>
          </div>
          <div>
            {todoList.map((item) => (
              <div key={item.id} onClick={() => setSelectedTaskId(item.id)}>
                <TodoItems
                  text={item.text}
                  id={item.id}
                  isComplete={item.isComplete}
                  deleteToDo={deleteToDo}
                  toggle={toggle}
                  day={item.day}
                  time={item.time}
                  category={item.category}
                  updateDay={updateDay}
                  updateTime={updateTime}
                  updateCategory={updateCategory}
                />
              </div>
            ))}
          </div>
          {/* Chatbot integration */}
          <div className='mt-10'>
            <Chatbot 
              addTaskToWeek={(week, taskDetails) => {
                setWeek(week);
                
                // Add the task after setting the week
                setTodoList(prevTodos => [...prevTodos, {
                  id: Date.now(),
                  text: taskDetails.text,
                  isComplete: false,
                  day: taskDetails.day,
                  time: taskDetails.time,
                  category: taskDetails.category
                }]);
              }} 
              weeks={weeks} 
              setWeeks={setWeeks} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
