import { useState, useMemo } from 'react';

export default function ProgressTracker({ workoutHistory, user }) {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('workouts');

  const periods = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const metrics = [
    { value: 'workouts', label: 'Workouts' },
    { value: 'duration', label: 'Duration (mins)' },
    { value: 'exercises', label: 'Exercises' }
  ];

  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = selectedPeriod === 'all' ? new Date(0) : 
                      new Date(now.getTime() - (parseInt(selectedPeriod) * 24 * 60 * 60 * 1000));
    
    return workoutHistory.filter(workout => new Date(workout.date) >= cutoffDate);
  }, [workoutHistory, selectedPeriod]);

  const chartData = useMemo(() => {
    const days = selectedPeriod === 'all' ? 30 : parseInt(selectedPeriod);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = filteredData.filter(w => 
        new Date(w.date).toDateString() === date.toDateString()
      );
      
      let value = 0;
      if (selectedMetric === 'workouts') {
        value = dayWorkouts.length;
      } else if (selectedMetric === 'duration') {
        value = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      } else if (selectedMetric === 'exercises') {
        value = dayWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
      }
      
      data.push({
        date: dateStr,
        value: value,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  }, [filteredData, selectedPeriod, selectedMetric]);

  const stats = useMemo(() => {
    const totalWorkouts = filteredData.length;
    const totalDuration = filteredData.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalExercises = filteredData.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    
    const workoutTypes = {};
    filteredData.forEach(w => {
      workoutTypes[w.type] = (workoutTypes[w.type] || 0) + 1;
    });
    
    return {
      totalWorkouts,
      totalDuration,
      totalExercises,
      avgDuration,
      workoutTypes
    };
  }, [filteredData]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">📈</span>
            Progress Tracker
          </h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.totalDuration}</div>
            <div className="text-sm text-gray-600">Total Minutes</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.totalExercises}</div>
            <div className="text-sm text-gray-600">Total Exercises</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.avgDuration}</div>
            <div className="text-sm text-gray-600">Avg Duration</div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Activity Chart</h3>
          <div className="h-64 flex items-end space-x-1 bg-gray-50 rounded-lg p-4">
            {chartData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${(day.value / maxValue) * 200}px`,
                    minHeight: day.value > 0 ? '4px' : '0px'
                  }}
                  title={`${day.label}: ${day.value} ${selectedMetric}`}
                />
                <div className="text-xs text-gray-600 mt-2 transform -rotate-45">
                  {day.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(stats.workoutTypes).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Workout Types</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.workoutTypes).map(([type, count]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xl font-bold text-gray-700">{count}</div>
                  <div className="text-sm text-gray-600">{type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {workoutHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {workoutHistory.slice(0, 10).map((workout) => (
              <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-800">{workout.type} Workout</span>
                    <div className="text-sm text-gray-600">
                      {new Date(workout.date).toLocaleDateString()} • {workout.duration} minutes
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {workout.exercises?.length || 0} exercises
                    </div>
                  </div>
                </div>
                
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.slice(0, 3).map((exercise, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {exercise.name} ({exercise.sets}x{exercise.reps})
                        </span>
                      ))}
                      {workout.exercises.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{workout.exercises.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}