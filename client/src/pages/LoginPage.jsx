// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Akan kita buat file CSS-nya nanti
import Modal from '../components/Modal';

function LoginPage({ setUserInfo }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/login', { // Endpoint login backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setModalType('success');
        setModalMessage(data.message);
        setShowModal(true);
        localStorage.setItem('userInfo', JSON.stringify(data));
        console.log('Login response data:', data);
        if (data && data.token) {
          if (setUserInfo) {
            setUserInfo(data);
            console.log('setUserInfo called with:', data);
          }
        } else {
          setModalType('error');
          setModalMessage('Login gagal: Data user tidak valid.');
          setShowModal(true);
          return;
        }
        setTimeout(() => {
          setShowModal(false);
          navigate('/');
        }, 1200);
      } else {
        setModalType('error');
        setModalMessage(data.message || 'Terjadi kesalahan saat login.');
        setShowModal(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan jaringan atau server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login ke Akun Anda</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Masuk...' : 'Login'}
        </button>
        <p className="auth-switch">
          Belum punya akun? <span onClick={() => navigate('/register')}>Daftar sekarang</span>
        </p>
      </form>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className={`modal-${modalType}`}>{modalMessage}</div>
        </Modal>
      )}
    </div>
  );
}

export default LoginPage;