// components/UserProfile.js
import { useState } from 'react';

export default function UserProfile({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleSave = () => {
    setUser(editData);
    setIsEditing(false);
  };

  const avatars = ['💪', '🏃‍♂️', '🏃‍♀️', '🚴‍♂️', '🚴‍♀️', '🏊‍♂️', '🏊‍♀️', '🤸‍♂️', '🤸‍♀️'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex space-x-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setEditData({ ...editData, avatar })}
                  className={`text-2xl p-2 rounded-lg border-2 ${
                    editData.avatar === avatar ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
            <select
              value={editData.level}
              onChange={(e) => setEditData({ ...editData, level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{user.avatar}</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">{user.level} Level</p>
            <div className="flex space-x-4 mt-2 text-sm text-gray-500">
              <span>🏋️ {user.totalWorkouts} workouts</span>
              <span>⏱️ {Math.round(user.totalMinutes)} minutes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}