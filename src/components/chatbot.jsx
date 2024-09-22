import React, { useState, useRef } from 'react';

const Chatbot = ({ weeks, addTaskToWeek, setWeeks }) => {
  const [step, setStep] = useState(0);
  const [week, setWeek] = useState('');
  const [taskName, setTaskName] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [inputValue, setInputValue] = useState(''); // Controlled input value

  const handleUserInput = (input) => {
    switch (step) {
      case 0: // Week Selection
        if (weeks.includes(input)) {
          setWeek(input);
          setStep(1);
        } else {
          // If the week doesn't exist, add it to the weeks list
          setWeek(input);
          setWeeks([...weeks, input]);  // Update weeks state correctly
          setStep(1);
        }
        break;
      case 1: // Task Name
        setTaskName(input);
        setStep(2);
        break;
      case 2: // Day Selection
        setDay(input);  // Directly set the entered day
        setStep(3);
        break;
      case 3: // Time Selection
        setTime(input); // Directly set the entered time
        setStep(4);
        break;
      case 4: // Category Selection
        setCategory(input);
        confirmTask();
        break;
      default:
        break;
    }

    setInputValue(''); // Clear the input after each step
  };

  const confirmTask = () => {
    addTaskToWeek(week, {
      text: taskName,
      day: day,
      time: time,
      category: category,
    });
    resetChatbot();
  };

  const resetChatbot = () => {
    setStep(0);
    setWeek('');
    setTaskName('');
    setDay('');
    setTime('');
    setCategory('');
  };

  const renderBotMessage = () => {
    switch (step) {
      case 0:
        return 'Which week would you like to add the task to?';
      case 1:
        return 'What is the task name?';
      case 2:
        return 'On which day should the task be done? (e.g., Monday)';
      case 3:
        return 'At what time should the task be done? (e.g., 3:00 PM)';
      case 4:
        return 'What category does this task belong to? (daily, important, leisure)';
      default:
        return '';
    }
  };

  return (
    <div className="chatbot bg-gray-100 p-4 rounded-lg">
      <div className="bot-message mb-2 text-lg font-semibold">
        {renderBotMessage()}
      </div>
      <input
        type="text"
        value={inputValue} // Controlled component
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleUserInput(e.target.value);
        }}
        className="w-full p-2 border rounded"
        placeholder="Type your answer here..."
        aria-label="Chatbot input"
      />
    </div>
  );
};

export default Chatbot;
