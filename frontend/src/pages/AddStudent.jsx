import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, User, Award, Hash, ArrowLeft } from 'lucide-react';
import studentService from '../services/studentService';

const AddStudent = ({ showToast }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    rollno: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch/Department is required';
    }

    // Roll number validation
    if (!formData.rollno.toString().trim()) {
      newErrors.rollno = 'Roll number is required';
    } else {
      const parsedRoll = parseFloat(formData.rollno);
      if (isNaN(parsedRoll)) {
        newErrors.rollno = 'Roll number must be a valid number';
      } else if (parsedRoll <= 0) {
        newErrors.rollno = 'Roll number must be greater than zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const studentPayload = {
        name: formData.name.trim(),
        branch: formData.branch.trim().toUpperCase(),
        rollno: parseFloat(formData.rollno),
      };

      await studentService.createStudent(studentPayload);
      showToast(`Student "${studentPayload.name}" added successfully!`, 'success');
      navigate('/');
    } catch (error) {
      console.error('Error creating student:', error);
      showToast(error.message || 'Failed to add student. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-student-page">
      <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="form-card glass-panel">
        <div className="form-header">
          <h2 className="form-title">Add New Student</h2>
          <p className="form-description">Register a new student profile in the database.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter student name (e.g., Varun)"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {errors.name && (
              <span className="invalid-feedback">
                <AlertCircle size={14} />
                {errors.name}
              </span>
            )}
          </div>

          {/* Branch Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="branch">
              Branch / Department
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="branch"
                name="branch"
                className={`form-control ${errors.branch ? 'is-invalid' : ''}`}
                placeholder="Enter branch (e.g., CSE, ECE, ME)"
                value={formData.branch}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Award size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {errors.branch && (
              <span className="invalid-feedback">
                <AlertCircle size={14} />
                {errors.branch}
              </span>
            )}
          </div>

          {/* Roll Number Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="rollno">
              Roll Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="any"
                id="rollno"
                name="rollno"
                className={`form-control ${errors.rollno ? 'is-invalid' : ''}`}
                placeholder="Enter roll number (e.g., 101.0)"
                value={formData.rollno}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Hash size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            {errors.rollno && (
              <span className="invalid-feedback">
                <AlertCircle size={14} />
                {errors.rollno}
              </span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/" className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
