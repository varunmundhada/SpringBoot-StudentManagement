import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, Edit, Trash2, ShieldAlert, GraduationCap, RefreshCw } from 'lucide-react';
import studentService from '../services/studentService';

const Dashboard = ({ showToast }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents();
      // Ensure the returned data is an array
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      showToast(error.message || 'Failed to load students. Make sure the backend is running.', 'error');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setActionLoading(true);
    try {
      await studentService.deleteStudent(studentToDelete.id);
      showToast(`Student "${studentToDelete.name}" deleted successfully.`, 'success');
      setShowDeleteModal(false);
      setStudentToDelete(null);
      // Refresh list
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      showToast(error.message || 'Failed to delete student. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort students alphabetically by name
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
    if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Highlight helper for search
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Manage and track student profiles, branches, and academic indices.</p>
      </div>

      {/* Toolbar: Search, Sort and Refresh */}
      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search student by name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search size={18} className="search-icon" />
        </div>

        <div className="sort-box">
          <label className="sort-label">Sort by Name:</label>
          <select className="select-input" value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Alphabetical (A-Z)</option>
            <option value="desc">Alphabetical (Z-A)</option>
          </select>
          <button 
            onClick={fetchStudents} 
            className="btn btn-secondary" 
            title="Refresh database"
            style={{ padding: '0.75rem' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-container glass-panel">
          <div className="spinner"></div>
          <p>Connecting to backend server...</p>
        </div>
      ) : sortedStudents.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-icon">
            <GraduationCap size={48} />
          </div>
          <h3 className="empty-title">No Students Found</h3>
          <p className="empty-text">
            {searchTerm 
              ? `We couldn't find any student matching "${searchTerm}". Try checking your spelling.`
              : 'The student database is currently empty. Get started by adding a student!'}
          </p>
          {!searchTerm && (
            <Link to="/add" className="btn btn-primary">
              Add First Student
            </Link>
          )}
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Roll Number</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
                      #{student.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    {highlightText(student.name, searchTerm)}
                  </td>
                  <td>
                    <span className="badge badge-branch">{student.branch}</span>
                  </td>
                  <td>
                    <span className="badge badge-roll">
                      {student.rollno % 1 === 0 ? student.rollno.toFixed(0) : student.rollno}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link 
                        to={`/edit/${student.id}`} 
                        className="btn btn-sm btn-edit"
                        title="Edit details"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className="btn btn-sm btn-danger"
                        title="Delete profile"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <ShieldAlert size={24} />
              <h3 className="modal-title">Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              Are you sure you want to permanently delete student{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {studentToDelete?.name}
              </strong>{' '}
              (Roll No: {studentToDelete?.rollno})? This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button
                disabled={actionLoading}
                onClick={() => {
                  setShowDeleteModal(false);
                  setStudentToDelete(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                {actionLoading ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
