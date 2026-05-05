import { useState, useEffect } from 'react';

export default function StudentDashboard({ showToast }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // --- SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState('');

  const [enrollingStudentId, setEnrollingStudentId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) { console.error('Failed to fetch students:', error); }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) { console.error('Failed to fetch courses:', error); }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (response.ok) {
        fetchStudents();
        setName('');
        setEmail('');
        showToast('Student enrolled successfully!');
      }
    } catch (error) { console.error('Failed to add student:', error); }
  };

  const handleUpdateStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (response.ok) { fetchStudents(); setEditingStudentId(null); }
    } catch (error) { console.error('Failed to update student:', error); }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/students/${id}`, { method: 'DELETE' });
      if (response.ok) fetchStudents();
    } catch (error) { console.error('Failed to delete student:', error); }
  };

  const handleEnroll = async (studentId) => {
    if (!selectedCourseId) return;
    try {
      const response = await fetch(`http://localhost:8081/api/students/${studentId}/courses/${selectedCourseId}`, { method: 'POST' });
      if (response.ok) {
        fetchStudents();
        setEnrollingStudentId(null);
        setSelectedCourseId('');
      }
    } catch (error) { console.error('Failed to enroll student:', error); }
  };

  const startEditing = (student) => {
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditEmail(student.email);
    setEnrollingStudentId(null);
  };

  const startEnrolling = (studentId) => {
    setEnrollingStudentId(studentId);
    setEditingStudentId(null);
  };

  // --- FILTER LOGIC ---
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-green-400">Student Roster</h1>

      <form onSubmit={handleAddStudent} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Enroll New Student</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Student Full Name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-green-500" required />
          <input type="email" placeholder="Student Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-green-500" required />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-200 whitespace-nowrap">Add Student</button>
        </div>
      </form>

      {/* --- NEW SEARCH BAR --- */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors duration-200"
        />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 overflow-x-auto">
        <table className="w-full text-left text-gray-300 min-w-max">
          <thead className="bg-gray-700 text-gray-400">
            <tr>
              <th className="p-4 font-semibold w-1/4">Name</th>
              <th className="p-4 font-semibold w-1/4">Email</th>
              <th className="p-4 font-semibold w-1/3">Enrolled Courses</th>
              <th className="p-4 font-semibold text-right w-auto">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-750">
                {editingStudentId === student.id ? (
                  <>
                    <td className="p-4"><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-gray-700 border border-gray-500 rounded p-1.5 text-white focus:outline-none focus:border-green-500 w-full" /></td>
                    <td className="p-4"><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-gray-700 border border-gray-500 rounded p-1.5 text-white focus:outline-none focus:border-green-500 w-full" /></td>
                    <td className="p-4 opacity-50 pointer-events-none">
                      {student.courses && student.courses.length > 0 ? (
                        <div className="flex flex-wrap gap-2">{student.courses.map(course => <span key={course.id} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700/50 shadow-sm">{course.title}</span>)}</div>
                      ) : <span className="text-gray-500 italic text-sm">Not enrolled</span>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleUpdateStudent(student.id)} className="text-green-400 hover:text-green-300 text-sm font-bold">Save</button>
                        <button onClick={() => setEditingStudentId(null)} className="text-gray-400 hover:text-gray-300 text-sm font-bold">Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-white">{student.name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">
                      {student.courses && student.courses.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {student.courses.map(course => <span key={course.id} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700/50 shadow-sm">{course.title}</span>)}
                        </div>
                      ) : <span className="text-gray-500 italic text-sm">Not enrolled in any courses</span>}
                    </td>
                    <td className="p-4 text-right">
                      {enrollingStudentId === student.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <select className="bg-gray-700 text-white text-sm rounded p-1.5 border border-gray-500 focus:outline-none focus:border-green-500" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                            <option value="">Select a course...</option>
                            {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
                          </select>
                          <button onClick={() => handleEnroll(student.id)} className="text-green-400 hover:text-green-300 text-sm font-semibold ml-1">Save</button>
                          <button onClick={() => setEnrollingStudentId(null)} className="text-gray-400 hover:text-gray-300 text-sm ml-2">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button onClick={() => startEnrolling(student.id)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition duration-200">Enroll</button>
                          <button onClick={() => startEditing(student)} className="text-gray-400 hover:text-white text-sm font-semibold transition duration-200">Edit</button>
                          <button onClick={() => handleDeleteStudent(student.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold transition duration-200">Delete</button>
                        </div>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filteredStudents.length === 0 && students.length > 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No students match your search.</td></tr>
            )}
            {students.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No students enrolled yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}