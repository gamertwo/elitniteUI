import { useState, useEffect, useRef } from 'react';

export default function WorkoutTimer({ onWorkoutComplete }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutType, setWorkoutType] = useState('General');
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const intervalRef = useRef();

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const startWorkout = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const stopWorkout = () => {
    if (time > 0) {
      onWorkoutComplete({
        type: workoutType,
        duration: Math.floor(time / 60),
        exercises: exercises,
        timestamp: new Date().toISOString()
      });
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setExercises([]);
  };

  const addExercise = () => {
    if (currentExercise.trim()) {
      setExercises(prev => [...prev, {
        name: currentExercise,
        sets: sets || '1',
        reps: reps || '10',
        timestamp: time
      }]);
      setCurrentExercise('');
      setSets('');
      setReps('');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const workoutTypes = ['General', 'Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">⏱️</span>
        Workout Timer
      </h2>

      <div className="text-center mb-6">
        <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center space-x-3 mb-4">
          {!isRunning ? (
            <button
              onClick={startWorkout}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>▶️</span>
              <span>Start</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseWorkout}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <span>{isPaused ? '▶️' : '⏸️'}</span>
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={stopWorkout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <span>⏹️</span>
                <span>Stop</span>
              </button>
            </>
          )}
        </div>

        <div className="mb-4">
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            disabled={isRunning}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {isRunning && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Add Exercise</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Exercise name"
                value={currentExercise}
                onChange={(e) => setCurrentExercise(e.target.value)}
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addExercise}
                disabled={!currentExercise.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                Add
              </button>
            </div>
          </div>

          {exercises.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Current Session:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {exercises.map((exercise, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-gray-600 ml-2">
                      {exercise.sets}x{exercise.reps} @ {formatTime(exercise.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}