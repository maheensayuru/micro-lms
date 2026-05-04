import { useState, useEffect } from 'react';

export default function CourseDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch courses from Spring Boot on component load
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
        fetchCourses(); // Refresh the list
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Failed to add course:', error);
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

  return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Micro-LMS Dashboard</h1>

        {/* Add Course Form */}
        <form onSubmit={handleAddCourse} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
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
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{course.description}</p>
              </div>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="text-red-400 hover:text-red-300 self-end text-sm font-semibold transition duration-200"
              >
                Delete Course
              </button>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-8">No courses available. Create one above!</p>
          )}
        </div>
      </div>
  );
}