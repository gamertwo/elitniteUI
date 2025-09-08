import { useState } from 'react';

export default function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      category: 'Chest',
      difficulty: 'Intermediate',
      equipment: 'None',
      description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps.',
      instructions: [
        'Start in a plank position with hands slightly wider than shoulders',
        'Lower your body until chest nearly touches the floor',
        'Push back up to starting position',
        'Keep your body in a straight line throughout'
      ],
      muscles: ['Chest', 'Shoulders', 'Triceps', 'Core']
    },
    {
      id: 2,
      name: 'Squats',
      category: 'Legs',
      difficulty: 'Beginner',
      equipment: 'None',
      description: 'Fundamental lower body exercise for building leg and glute strength.',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep your chest up and knees in line with toes',
        'Return to standing position'
      ],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves']
    },
    {
      id: 3,
      name: 'Plank',
      category: 'Core',
      difficulty: 'Beginner',
      equipment: 'None',
      description: 'Isometric core exercise that strengthens the entire midsection.',
      instructions: [
        'Start in a push-up position',
        'Lower to your forearms',
        'Keep your body in a straight line',
        'Hold the position for desired time'
      ],
      muscles: ['Core', 'Shoulders', 'Back']
    },
    {
      id: 4,
      name: 'Burpees',
      category: 'Full Body',
      difficulty: 'Advanced',
      equipment: 'None',
      description: 'High-intensity full-body exercise combining strength and cardio.',
      instructions: [
        'Start standing, then squat down',
        'Place hands on floor and jump feet back',
        'Do a push-up',
        'Jump feet forward and jump up with arms overhead'
      ],
      muscles: ['Full Body', 'Cardiovascular']
    },
    {
      id: 5,
      name: 'Lunges',
      category: 'Legs',
      difficulty: 'Intermediate',
      equipment: 'None',
      description: 'Unilateral leg exercise that improves balance and strength.',
      instructions: [
        'Step forward with one leg',
        'Lower your hips until both knees are at 90 degrees',
        'Push back to starting position',
        'Repeat with other leg'
      ],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings']
    },
    {
      id: 6,
      name: 'Mountain Climbers',
      category: 'Cardio',
      difficulty: 'Intermediate',
      equipment: 'None',
      description: 'Dynamic cardio exercise that also strengthens the core.',
      instructions: [
        'Start in a plank position',
        'Bring one knee toward your chest',
        'Quickly switch legs',
        'Continue alternating at a fast pace'
      ],
      muscles: ['Core', 'Shoulders', 'Legs', 'Cardiovascular']
    }
  ];

  const categories = ['All', ...new Set(exercises.map(ex => ex.category))];
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📚</span>
        Exercise Library
      </h2>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{exercise.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📍 {exercise.category}</span>
              <span>🏋️ {exercise.equipment}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedExercise.name}</h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{selectedExercise.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
                        {selectedExercise.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span className="font-medium">{selectedExercise.equipment}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Target Muscles</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedExercise.muscles.map((muscle, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedExercise.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}