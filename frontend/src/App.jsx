import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import './App.css';

function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard showToast={showToast} />} />
            <Route path="/add" element={<AddStudent showToast={showToast} />} />
            <Route path="/edit/:id" element={<EditStudent showToast={showToast} />} />
          </Routes>
        </main>

        {/* Global Floating Toast Notifications Container */}
        <div className="notifications-container">
          {toasts.map((toast) => (
            <div 
              key={toast.id} 
              className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={18} style={{ flexShrink: 0 }} />
              ) : (
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              )}
              <span>{toast.message}</span>
              <button 
                className="toast-close" 
                onClick={() => removeToast(toast.id)}
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
