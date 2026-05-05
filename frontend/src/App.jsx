import { useState } from 'react';
import CourseDashboard from './components/CourseDashboard';
import StudentDashboard from './components/StudentDashboard';
import StatsBar from './components/StatsBar'; // Import our new component

function App() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
            Micro-LMS v1.0
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'students' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Students
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-8">
        {/* The Stats Bar lives globally above the tabs! */}
        <StatsBar /> 
        
        {activeTab === 'courses' ? <CourseDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
}

export default App;