import { useState, useEffect } from 'react';

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
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
      }
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/students/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-green-400">Student Roster</h1>

      {/* Add Student Form */}
      <form onSubmit={handleAddStudent} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Enroll New Student</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Student Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-green-500"
            required
          />
          <input
            type="email"
            placeholder="Student Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-green-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 self-start"
          >
            Enroll Student
          </button>
        </div>
      </form>

      {/* Student List */}
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-400">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-4 font-medium text-white">{student.name}</td>
                <td className="p-4">{student.email}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold transition duration-200"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">No students enrolled yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}