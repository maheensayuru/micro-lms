import { useState, useEffect } from 'react';

export default function StatsBar() {
  const [stats, setStats] = useState({ courses: 0, students: 0, assignments: 0 });

  // We fetch all three numbers at the same time when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courseRes, studentRes, assignmentRes] = await Promise.all([
          fetch('http://localhost:8081/api/courses/count'),
          fetch('http://localhost:8081/api/students/count'),
          fetch('http://localhost:8081/api/assignments/count')
        ]);

        const courses = await courseRes.json();
        const students = await studentRes.json();
        const assignments = await assignmentRes.json();

        setStats({ courses, students, assignments });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
    // This sets up a timer to refresh the stats every 5 seconds so they stay accurate!
    const interval = setInterval(fetchStats, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Course Stat Card */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center justify-between shadow-sm">
        <div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Active Courses</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{stats.courses}</p>
        </div>
        <div className="p-3 bg-blue-900/30 rounded-full">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      {/* Student Stat Card */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center justify-between shadow-sm">
        <div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Enrolled Students</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{stats.students}</p>
        </div>
        <div className="p-3 bg-green-900/30 rounded-full">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>

      {/* Assignment Stat Card */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center justify-between shadow-sm">
        <div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Assignments</p>
          <p className="text-3xl font-bold text-purple-400 mt-1">{stats.assignments}</p>
        </div>
        <div className="p-3 bg-purple-900/30 rounded-full">
          <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}