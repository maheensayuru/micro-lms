import { useState, useEffect } from 'react';

export default function CourseDashboard() {
  // --- CORE COURSE STATE ---
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // --- EDITING STATE ---
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // --- ASSIGNMENT VIEW STATE ---
  const [activeCourse, setActiveCourse] = useState(null); // Which course's assignments are we viewing?
  const [assignments, setAssignments] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- COURSE API LOGIC ---
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) { console.error('Failed to fetch courses:', error); }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) { fetchCourses(); setTitle(''); setDescription(''); }
    } catch (error) { console.error('Failed to add course:', error); }
  };

  const handleUpdateCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (response.ok) { fetchCourses(); setEditingId(null); }
    } catch (error) { console.error('Failed to update course:', error); }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/courses/${id}`, { method: 'DELETE' });
      if (response.ok) fetchCourses();
    } catch (error) { console.error('Failed to delete course:', error); }
  };

  const startEditing = (course) => {
    setEditingId(course.id);
    setEditTitle(course.title);
    setEditDescription(course.description);
  };

  // --- ASSIGNMENT API LOGIC ---
  const openAssignments = async (course) => {
    setActiveCourse(course);
    fetchAssignments(course.id);
  };

  const fetchAssignments = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/courses/${courseId}/assignments`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) { console.error('Failed to fetch assignments:', error); }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/courses/${activeCourse.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, description: taskDesc, dueDate: taskDate }),
      });
      if (response.ok) {
        fetchAssignments(activeCourse.id);
        setTaskTitle(''); setTaskDesc(''); setTaskDate('');
      }
    } catch (error) { console.error('Failed to add assignment:', error); }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/assignments/${assignmentId}`, { method: 'DELETE' });
      if (response.ok) fetchAssignments(activeCourse.id);
    } catch (error) { console.error('Failed to delete assignment:', error); }
  };

  // --- RENDER: ASSIGNMENT VIEW ---
  if (activeCourse) {
    return (
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setActiveCourse(null)} 
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition duration-200"
        >
          ← Back to Courses
        </button>
        
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">{activeCourse.title} Assignments</h1>
          <p className="text-gray-400">{activeCourse.description}</p>
        </div>

        {/* Add Assignment Form */}
        <form onSubmit={handleAddAssignment} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Create New Task</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500" required />
            <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <textarea placeholder="Task Description Details..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500 mb-4" rows="2" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-200">Publish Assignment</button>
        </form>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map(task => (
            <div key={task.id} className="bg-gray-800 border border-gray-700 p-5 rounded-lg flex justify-between items-center shadow-sm hover:border-gray-600 transition duration-200">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  {task.title}
                  <span className="text-xs font-medium bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-700/50">
                    Due: {task.dueDate}
                  </span>
                </h3>
                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
              </div>
              <button onClick={() => handleDeleteAssignment(task.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold transition duration-200 px-4 py-2 hover:bg-red-900/20 rounded">
                Delete
              </button>
            </div>
          ))}
          {assignments.length === 0 && (
            <p className="text-gray-500 text-center py-8 bg-gray-800 rounded-lg border border-dashed border-gray-700">No assignments published for this course yet.</p>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN COURSE GRID ---
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Micro-LMS Dashboard</h1>

      {/* Add Course Form (Same as before) */}
      <form onSubmit={handleAddCourse} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Create New Course</h2>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500" required />
          <textarea placeholder="Course Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500" rows="3" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 self-start">Add Course</button>
        </div>
      </form>

      {/* Course List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md flex flex-col justify-between">
            {editingId === course.id ? (
              /* Edit Mode */
              <div className="flex flex-col gap-3">
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-gray-700 border border-gray-500 rounded p-1 text-white focus:outline-none focus:border-blue-400 text-lg font-bold" />
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-gray-700 border border-gray-500 rounded p-1 text-white focus:outline-none focus:border-blue-400 text-sm" rows="3" />
                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={() => handleUpdateCourse(course.id)} className="text-green-400 hover:text-green-300 text-sm font-bold">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300 text-sm font-bold">Cancel</button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                </div>
                
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <button 
                    onClick={() => openAssignments(course)}
                    className="w-full bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 border border-blue-700/50 font-semibold py-2 rounded transition duration-200 mb-3"
                  >
                    Manage Assignments
                  </button>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => startEditing(course)} className="text-gray-400 hover:text-white text-sm font-semibold transition duration-200">Edit</button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold transition duration-200">Delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        {courses.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-8">No courses available. Create one above!</p>
        )}
      </div>
    </div>
  );
}