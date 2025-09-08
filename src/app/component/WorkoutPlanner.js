import { useState } from 'react';

export default function WorkoutPlanner({ currentWorkout, setCurrentWorkout }) {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  const quickExercises = [
    { name: 'Push-ups', defaultSets: 3, defaultReps: 12 },
    { name: 'Squats', defaultSets: 3, defaultReps: 15 },
    { name: 'Plank', defaultSets: 3, defaultReps: '30s' },
    { name: 'Lunges', defaultSets: 3, defaultReps: 12 },
    { name: 'Burpees', defaultSets: 3, defaultReps: 8 },
    { name: 'Mountain Climbers', defaultSets: 3, defaultReps: 20 },
    { name: 'Jumping Jacks', defaultSets: 3, defaultReps: 25 },
    { name: 'Sit-ups', defaultSets: 3, defaultReps: 15 }
  ];

  const workoutTemplates = [
    {
      name: 'Quick HIIT',
      exercises: [
        { name: 'Burpees', sets: 3, reps: 8 },
        { name: 'Mountain Climbers', sets: 3, reps: 20 },
        { name: 'Jumping Jacks', sets: 3, reps: 25 },
        { name: 'Plank', sets: 3, reps: '30s' }
      ]
    },
    {
      name: 'Upper Body',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 12 },
        { name: 'Pike Push-ups', sets: 3, reps: 8 },
        { name: 'Tricep Dips', sets: 3, reps: 10 },
        { name: 'Plank', sets: 3, reps: '45s' }
      ]
    },
    {
      name: 'Lower Body',
      exercises: [
        { name: 'Squats', sets: 4, reps: 15 },
        { name: 'Lunges', sets: 3, reps: 12 },
        { name: 'Calf Raises', sets: 3, reps: 20 },
        { name: 'Wall Sit', sets: 3, reps: '30s' }
      ]
    }
  ];

  const addExercise = (exercise) => {
    const newExercise = {
      id: Date.now(),
      name: exercise.name,
      sets: exercise.defaultSets || 3,
      reps: exercise.defaultReps || 10,
      notes: ''
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const updateExercise = (id, field, value) => {
    setSelectedExercises(prev =>
      prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
    );
  };

  const removeExercise = (id) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const saveWorkout = () => {
    if (workoutName && selectedExercises.length > 0) {
      const workout = {
        id: Date.now(),
        name: workoutName,
        exercises: selectedExercises,
        createdAt: new Date().toISOString()
      };
      setSavedWorkouts(prev => [workout, ...prev]);
      setWorkoutName('');
      setSelectedExercises([]);
    }
  };

  const loadTemplate = (template) => {
    setWorkoutName(template.name);
    setSelectedExercises(template.exercises.map(ex => ({
      ...ex,
      id: Date.now() + Math.random()
    })));
  };

  const loadSavedWorkout = (workout) => {
    setWorkoutName(workout.name);
    setSelectedExercises(workout.exercises.map(ex => ({
      ...ex,
      id: Date.now() + Math.random()
    })));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📋</span>
          Workout Planner
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Create Workout</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Workout name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div>
                <h4 className="font-medium mb-2">Quick Add Exercises</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickExercises.map((exercise, index) => (
                    <button
                      key={index}
                      onClick={() => addExercise(exercise)}
                      className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedExercises.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Selected Exercises</h4>
                  {selectedExercises.map((exercise) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{exercise.name}</span>
                        <button
                          onClick={() => removeExercise(exercise.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Sets</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Reps</label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Notes (optional)"
                        value={exercise.notes}
                        onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows="1"
                      />
                    </div>
                  ))}
                  <button
                    onClick={saveWorkout}
                    disabled={!workoutName}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    Save Workout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Templates & Saved Workouts</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Quick Templates</h4>
              <div className="space-y-2">
                {workoutTemplates.map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{template.name}</span>
                      <button
                        onClick={() => loadTemplate(template)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Use
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {template.exercises.map(ex => ex.name).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {savedWorkouts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Your Saved Workouts</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedWorkouts.map((workout) => (
                    <div key={workout.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{workout.name}</span>
                        <button
                          onClick={() => loadSavedWorkout(workout)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Load
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        {workout.exercises.length} exercises
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(workout.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}