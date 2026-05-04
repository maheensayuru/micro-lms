import { useState, useEffect } from 'react';

export default function CourseDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // UI State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        fetchCourses();
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  const handleUpdateCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (response.ok) {
        fetchCourses();
        setEditingId(null); // Close the edit form
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/courses/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const startEditing = (course) => {
    setEditingId(course.id);
    setEditTitle(course.title);
    setEditDescription(course.description);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Micro-LMS Dashboard</h1>

      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Create New Course</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            rows="3"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 self-start"
          >
            Add Course
          </button>
        </div>
      </form>

      {/* Course List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md flex flex-col justify-between">
            {editingId === course.id ? (
              /* --- EDIT MODE UI --- */
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-gray-700 border border-gray-500 rounded p-1 text-white focus:outline-none focus:border-blue-400 text-lg font-bold"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-gray-700 border border-gray-500 rounded p-1 text-white focus:outline-none focus:border-blue-400 text-sm"
                  rows="3"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={() => handleUpdateCourse(course.id)} className="text-green-400 hover:text-green-300 text-sm font-bold">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300 text-sm font-bold">Cancel</button>
                </div>
              </div>
            ) : (
              /* --- NORMAL DISPLAY UI --- */
              <>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => startEditing(course)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition duration-200">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCourse(course.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold transition duration-200">
                    Delete
                  </button>
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