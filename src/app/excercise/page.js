"use client"
import { useState, useEffect } from 'react';

export default function ExerciseTracker() {
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 });
  const [workoutNotes, setWorkoutNotes] = useState({});
  const [showStats, setShowStats] = useState(false);
  const [workoutTypes, setWorkoutTypes] = useState({});
  const [personalBest, setPersonalBest] = useState({ date: null, count: 0 });
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [weeklyTodos, setWeeklyTodos] = useState({});

  const quotes = [
    "The only bad workout is the one that didn't happen! 💪",
    "Progress, not perfection! 🌟",
    "Your future self will thank you! 🚀",
    "Stronger every day! 💯",
    "Consistency is everything! ⭐",
    "You're building a better you! 🏆",
    "Small steps, big results! 🎯",
    "Keep pushing forward! 🔥"
  ];

  useEffect(() => {
    // Load data from storage on component mount
    const savedWorkouts = JSON.parse(localStorage.getItem('exerciseTracker') || '{}');
    const savedNotes = JSON.parse(localStorage.getItem('workoutNotes') || '{}');
    const savedStreak = JSON.parse(localStorage.getItem('streakData') || '{"current": 0, "longest": 0}');
    const savedTypes = JSON.parse(localStorage.getItem('workoutTypes') || '{}');
    const savedBest = JSON.parse(localStorage.getItem('personalBest') || '{"date": null, "count": 0}');
    const savedTodos = JSON.parse(localStorage.getItem('weeklyTodos') || '{}');

    setCompletedWorkouts(savedWorkouts);
    setWorkoutNotes(savedNotes);
    setStreakData(savedStreak);
    setWorkoutTypes(savedTypes);
    setPersonalBest(savedBest);
    setWeeklyTodos(savedTodos);

    // Set random motivational quote
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    // Save to storage whenever data changes
    localStorage.setItem('exerciseTracker', JSON.stringify(completedWorkouts));
    calculateStreaks();
  }, [completedWorkouts]);

  useEffect(() => {
    localStorage.setItem('workoutNotes', JSON.stringify(workoutNotes));
  }, [workoutNotes]);

  useEffect(() => {
    localStorage.setItem('streakData', JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    localStorage.setItem('workoutTypes', JSON.stringify(workoutTypes));
  }, [workoutTypes]);

  useEffect(() => {
    localStorage.setItem('personalBest', JSON.stringify(personalBest));
  }, [personalBest]);

  useEffect(() => {
    localStorage.setItem('weeklyTodos', JSON.stringify(weeklyTodos));
  }, [weeklyTodos]);

  const calculateStreaks = () => {
    const weeks = getAllWeeksFromData();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedWeeks = weeks.sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
    
    for (let i = 0; i < sortedWeeks.length; i++) {
      const weekKey = sortedWeeks[i].key;
      const completedCount = getCompletedCount(weekKey);
      
      if (completedCount >= 3) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        if (i === 0) currentStreak = 0;
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    setStreakData({ current: currentStreak, longest: longestStreak });
  };

  const getAllWeeksFromData = () => {
    const weeks = [];
    Object.keys(completedWorkouts).forEach(weekKey => {
      const weekStart = getWeekStartFromKey(weekKey);
      if (weekStart) {
        weeks.push({ key: weekKey, weekStart });
      }
    });
    return weeks;
  };

  const getWeekStartFromKey = (weekKey) => {
    try {
      const parts = weekKey.split('-');
      if (parts.length >= 4) {
        const timestamp = parseInt(parts[3]);
        return new Date(timestamp);
      }
    } catch (e) {
      console.error('Error parsing week key:', weekKey);
    }
    return null;
  };

  const toggleWorkout = (weekKey, dayIndex, workoutType = 'General') => {
    const dayKey = `${weekKey}-day-${dayIndex}`;
    const isCompleting = !completedWorkouts[dayKey];
    
    if (isCompleting && !canAddMoreWorkouts(weekKey)) {
      return;
    }
    
    setCompletedWorkouts(prev => ({
      ...prev,
      [dayKey]: isCompleting
    }));

    if (isCompleting) {
      setWorkoutTypes(prev => ({
        ...prev,
        [dayKey]: workoutType
      }));
    } else {
      setWorkoutTypes(prev => {
        const newTypes = { ...prev };
        delete newTypes[dayKey];
        return newTypes;
      });
    }

    setTimeout(() => {
      updatePersonalBest();
    }, 100);
  };

  const updatePersonalBest = () => {
    const weeks = getAllWeeksFromData();
    let bestWeek = { date: null, count: 0 };
    
    weeks.forEach(week => {
      const count = getCompletedCount(week.key);
      if (count > bestWeek.count) {
        bestWeek = { date: week.weekStart.toISOString(), count };
      }
    });
    
    setPersonalBest(bestWeek);
  };

  const addWorkoutNote = (dayKey, note) => {
    setWorkoutNotes(prev => ({
      ...prev,
      [dayKey]: note
    }));
  };

  const addTodoItem = (weekKey, todoText) => {
    if (!todoText.trim()) return;
    
    const todoId = Date.now().toString();
    setWeeklyTodos(prev => ({
      ...prev,
      [weekKey]: [
        ...(prev[weekKey] || []),
        { id: todoId, text: todoText, completed: false }
      ]
    }));
  };

  const toggleTodo = (weekKey, todoId) => {
    setWeeklyTodos(prev => ({
      ...prev,
      [weekKey]: (prev[weekKey] || []).map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const deleteTodo = (weekKey, todoId) => {
    setWeeklyTodos(prev => ({
      ...prev,
      [weekKey]: (prev[weekKey] || []).filter(todo => todo.id !== todoId)
    }));
  };

  const getWeeksInMonth = (year, month) => {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let currentWeek = [];
    let currentDate = new Date(firstDay);
    
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    while (currentDate <= lastDay || currentWeek.length > 0) {
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      
      currentWeek.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      
      if (currentDate > lastDay && currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        break;
      }
    }
    
    return weeks;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getWeeksInMonth(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekKey = (week) => {
    const monday = week.find(day => day.getDay() === 1) || week[0];
    const weekOfMonth = Math.ceil(monday.getDate() / 7);
    return `${monday.getFullYear()}-W${weekOfMonth}-${monday.getMonth()}-${monday.getTime()}`;
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === month;
  };

  const getCompletedCount = (weekKey) => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const dayKey = `${weekKey}-day-${i}`;
      if (completedWorkouts[dayKey]) count++;
    }
    return count;
  };

  const canAddMoreWorkouts = (weekKey) => {
    return getCompletedCount(weekKey) < 3;
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setCompletedWorkouts({});
      setWorkoutNotes({});
      setWorkoutTypes({});
      setWeeklyTodos({});
      setStreakData({ current: 0, longest: 0 });
      setPersonalBest({ date: null, count: 0 });
      
      // Clear localStorage
      localStorage.removeItem('exerciseTracker');
      localStorage.removeItem('workoutNotes');
      localStorage.removeItem('workoutTypes');
      localStorage.removeItem('weeklyTodos');
      localStorage.removeItem('streakData');
      localStorage.removeItem('personalBest');
    }
  };

  const exportData = () => {
    const data = {
      completedWorkouts,
      workoutNotes,
      workoutTypes,
      weeklyTodos,
      streakData,
      personalBest,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exercise-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (confirm('This will replace all current data. Continue?')) {
            setCompletedWorkouts(data.completedWorkouts || {});
            setWorkoutNotes(data.workoutNotes || {});
            setWorkoutTypes(data.workoutTypes || {});
            setWeeklyTodos(data.weeklyTodos || {});
            setStreakData(data.streakData || { current: 0, longest: 0 });
            setPersonalBest(data.personalBest || { date: null, count: 0 });
          }
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const WorkoutTypeSelector = ({ dayKey, currentType, onSelect }) => {
    const types = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Sports', 'Other'];
    
    return (
      <select
        value={currentType || 'General'}
        onChange={(e) => onSelect(e.target.value)}
        className="text-xs px-1 py-0.5 border border-gray-500 rounded w-full bg-gray-700 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <option value="General">General</option>
        {types.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    );
  };

  const NoteInput = ({ dayKey, currentNote, onSave }) => {
    const [note, setNote] = useState(currentNote || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
      onSave(note);
      setIsEditing(false);
    };

    if (!isEditing) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="text-xs text-blue-400 hover:underline w-full text-left"
        >
          {currentNote ? '📝' : '+ Note'}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg p-2 z-20">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add workout notes..."
          className="w-full px-2 py-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
          rows="2"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex justify-end space-x-1 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
            }}
            className="px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  const TodoList = ({ weekKey }) => {
    const [newTodo, setNewTodo] = useState('');
    const todos = weeklyTodos[weekKey] || [];

    const handleAddTodo = (e) => {
      e.preventDefault();
      if (newTodo.trim()) {
        addTodoItem(weekKey, newTodo);
        setNewTodo('');
      }
    };

    return (
      <div className="bg-gray-800 rounded-lg p-4 mt-4 border border-gray-600 shadow-lg">
        <div className="flex items-center mb-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
          <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wider">Weekly Todo List</h4>
          <div className="flex-1 h-px bg-gray-600 ml-3"></div>
        </div>
        
        <div className="mb-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a todo item..."
              className="flex-1 text-xs px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTodo(e);
                }
              }}
            />
            <button
              onClick={handleAddTodo}
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded text-xs hover:bg-gray-500 transition-all duration-200"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded border border-gray-600 hover:border-gray-500 transition-all duration-200">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(weekKey, todo.id)}
                  className="w-4 h-4 opacity-0 absolute"
                />
                <div className={`w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  todo.completed 
                    ? 'bg-green-600 border-green-600' 
                    : 'border-gray-400 hover:border-gray-300'
                }`}>
                  {todo.completed && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </div>
              <span className={`flex-1 text-xs transition-all duration-200 ${
                todo.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-white'
              }`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(weekKey, todo.id)}
                className="text-red-400 hover:text-red-300 text-sm font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-red-400/20 transition-all duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {todos.length === 0 && (
          <div className="text-center py-4">
            <div className="text-gray-500 text-xs italic">
              No todos yet. Add one above!
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-2 border-t border-gray-600">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">
              {todos.filter(t => t.completed).length}/{todos.length} completed
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(107, 114, 128, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6b7280, #4b5563);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9ca3af, #6b7280);
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            💪 Enhanced Exercise Tracker
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            Daily workout tracking with weekly todos!
          </p>
          <p className="text-gray-400 font-medium italic">
            {motivationalQuote}
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">{streakData.current}</div>
              <div className="text-sm text-gray-300">Current Streak</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <div className="text-2xl font-bold text-green-400">{streakData.longest}</div>
              <div className="text-sm text-gray-300">Best Streak</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <div className="text-2xl font-bold text-purple-400">
                {Object.keys(completedWorkouts).filter(key => completedWorkouts[key]).length}
              </div>
              <div className="text-sm text-gray-300">Total Workouts</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <div className="text-2xl font-bold text-orange-400">{personalBest.count}</div>
              <div className="text-sm text-gray-300">Weekly Best</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousMonth}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Previous</span>
              </button>
              
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={goToNextMonth}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm"
              >
                📊 Stats
              </button>
              
              <button
                onClick={exportData}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
              >
                📤 Export
              </button>
              
              <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm cursor-pointer">
                📥 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={clearAllData}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Stats Panel */}
        {showStats && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">📈 Detailed Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Workout Types</h4>
                <div className="space-y-2">
                  {Object.values(workoutTypes).reduce((acc, type) => {
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {}) && 
                    Object.entries(
                      Object.values(workoutTypes).reduce((acc, type) => {
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-gray-400">{type}:</span>
                        <span className="font-medium text-white">{count}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Weekly Progress</h4>
                <div className="text-sm space-y-1">
                  {weeks.slice(-4).map((week, index) => {
                    const weekKey = getWeekKey(week);
                    const completed = getCompletedCount(weekKey);
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-400">Week {index + 1}:</span>
                        <span className={completed >= 3 ? 'text-green-400 font-bold' : 'text-white'}>{completed}/3</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Achievements</h4>
                <div className="space-y-2 text-sm">
                  {streakData.current >= 4 && (
                    <div className="text-yellow-400">🏆 Month Master!</div>
                  )}
                  {streakData.longest >= 8 && (
                    <div className="text-purple-400">👑 Consistency King!</div>
                  )}
                  {Object.keys(completedWorkouts).filter(key => completedWorkouts[key]).length >= 50 && (
                    <div className="text-blue-400">🎯 Workout Warrior!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
          <div className="space-y-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-300 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => {
              const weekKey = getWeekKey(week);
              const completedThisWeek = getCompletedCount(weekKey);
              
              return (
                <div key={weekIndex} className="border-2 border-gray-600 rounded-xl p-4 bg-gray-700">
                  {/* Week progress indicator */}
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                      completedThisWeek >= 3 
                        ? 'bg-green-700 text-green-300 border border-green-600' 
                        : completedThisWeek > 0
                        ? 'bg-yellow-700 text-yellow-300 border border-yellow-600'
                        : 'bg-gray-600 text-gray-300 border border-gray-500'
                    }`}>
                      <span>
                        {completedThisWeek >= 3 ? '🎉' : completedThisWeek > 0 ? '💪' : '⏳'}
                      </span>
                      <span>
                        {completedThisWeek}/3 workouts this week
                      </span>
                    </div>
                  </div>

                  {/* Days with workout checkboxes */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {week.map((date, dayIndex) => {
                      const dayKey = `${weekKey}-day-${dayIndex}`;
                      const isCompleted = completedWorkouts[dayKey];
                      const workoutType = workoutTypes[dayKey] || 'General';
                      const note = workoutNotes[dayKey];
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`relative border-2 rounded-lg p-2 transition-all ${
                            isCurrentMonth(date)
                              ? 'border-gray-600 bg-gray-800'
                              : 'border-gray-700 bg-gray-750'
                          } ${
                            date.toDateString() === new Date().toDateString()
                              ? 'ring-2 ring-blue-400'
                              : ''
                          }`}
                        >
                          {/* Date number */}
                          <div className={`text-center font-medium mb-3 ${
                            isCurrentMonth(date) ? 'text-white' : 'text-gray-500'
                          }`}>
                            {date.getDate()}
                          </div>

                          {/* Workout checkbox */}
                          <div className="text-center mb-3">
                            <button
                              onClick={() => toggleWorkout(weekKey, dayIndex, workoutType)}
                              disabled={!isCompleted && !canAddMoreWorkouts(weekKey)}
                              className={`w-12 h-12 rounded-full border-3 transition-all duration-200 flex items-center justify-center text-lg font-bold ${
                                isCompleted
                                  ? 'bg-green-600 border-green-500 text-white hover:bg-green-500 shadow-lg'
                                  : !canAddMoreWorkouts(weekKey)
                                  ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-700 border-gray-500 text-gray-400 hover:border-green-500 hover:bg-gray-600'
                              }`}
                            >
                              {isCompleted ? '✓' : ''}
                            </button>
                          </div>

                          {/* Controls */}
                          {isCurrentMonth(date) && (
                            <div className="space-y-1">
                              <WorkoutTypeSelector
                                dayKey={dayKey}
                                currentType={workoutType}
                                onSelect={(type) => setWorkoutTypes(prev => ({
                                  ...prev,
                                  [dayKey]: type
                                }))}
                              />
                              
                              <div className="relative">
                                <NoteInput
                                  dayKey={dayKey}
                                  currentNote={note}
                                  onSave={(note) => addWorkoutNote(dayKey, note)}
                                />
                              </div>
                              
                              {note && (
                                <div className="text-xs text-gray-400 truncate" title={note}>
                                  💭
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Weekly Todo List */}
                  <TodoList weekKey={weekKey} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            📊 Monthly Summary
          </h3>
          
          {(() => {
            const monthWeeks = weeks.filter(week => 
              week.some(date => isCurrentMonth(date))
            );
            
            const totalPossible = monthWeeks.length * 3;
            const totalCompleted = monthWeeks.reduce((sum, week) => {
              return sum + getCompletedCount(getWeekKey(week));
            }, 0);
            
            const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
            
            return (
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-blue-400">
                  {totalCompleted}/{totalPossible}
                </div>
                <div className="text-lg text-gray-300">
                  workouts completed this month
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-2xl font-bold text-white">
                  {percentage}% Complete
                </div>
                
                {percentage === 100 && (
                  <div className="text-green-400 font-semibold text-lg">
                    🏆 Perfect month! You are unstoppable!
                  </div>
                )}
                {percentage >= 75 && percentage < 100 && (
                  <div className="text-blue-400 font-semibold">
                    🌟 Outstanding! You are almost there!
                  </div>
                )}
                {percentage >= 50 && percentage < 75 && (
                  <div className="text-yellow-400 font-semibold">
                    💪 Great progress! Keep the momentum!
                  </div>
                )}
                {percentage < 50 && percentage > 0 && (
                  <div className="text-orange-400 font-semibold">
                    🚀 Every step counts! You have got this!
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}