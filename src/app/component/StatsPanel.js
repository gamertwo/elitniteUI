export default function StatsPanel({ user, workoutHistory }) {
  const today = new Date().toDateString();
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const todayWorkouts = workoutHistory.filter(w => 
    new Date(w.date).toDateString() === today
  ).length;
  
  const weekWorkouts = workoutHistory.filter(w => 
    new Date(w.date) >= thisWeek
  ).length;
  
  const currentStreak = () => {
    let streak = 0;
    const sortedWorkouts = workoutHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dayWorkouts = sortedWorkouts.filter(w => 
        new Date(w.date).toDateString() === checkDate.toDateString()
      );
      
      if (dayWorkouts.length > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Keep pushing forward! 💪",
      "You're doing great! 🔥",
      "Consistency is key! ⭐",
      "Stay strong! 🚀",
      "Every workout counts! 💯"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Quick Stats
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{todayWorkouts}</div>
          <div className="text-sm text-gray-600">Today's Workouts</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{weekWorkouts}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{currentStreak()}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{user.level}</div>
          <div className="text-sm text-gray-600">Fitness Level</div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-1">
            {getMotivationalMessage()}
          </div>
          <div className="text-xs text-gray-500">
            You've completed {user.totalWorkouts} workouts!
          </div>
        </div>
      </div>
    </div>
  );
}