import { useState } from 'react';
import CourseDashboard from './components/CourseDashboard';
import StudentDashboard from './components/StudentDashboard';
import StatsBar from './components/StatsBar';
import Toast from './components/Toast'; // Import our new Toast!

function App() {
  const [activeTab, setActiveTab] = useState('courses');
  
  // --- TOAST STATE ---
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // The function we will pass to our dashboards to trigger pop-ups
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans relative">
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

      <main className="p-8 pb-24">
        <StatsBar /> 
        
        {/* Pass the showToast function down as a prop to our components */}
        {activeTab === 'courses' ? 
          <CourseDashboard showToast={showToast} /> : 
          <StudentDashboard showToast={showToast} />
        }
      </main>

      {/* The Global Toast Component */}
      <Toast 
        message={toastMessage} 
        type={toastType} 
        onClose={() => setToastMessage('')} 
      />
    </div>
  );
}

export default App;