// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Akan kita buat file CSS-nya nanti
import Modal from '../components/Modal';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate(); // Untuk redirect setelah sukses

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Validasi frontend (sesuai kriteria password)
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/\d/.test(formData.password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(formData.password)) {
      setError('Password minimal 8 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/register', { // Endpoint registrasi backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalType('success');
        setModalMessage(data.message + '\nSilakan login.');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login');
        }, 1500);
      } else {
        setModalType('error');
        setModalMessage(data.message || 'Terjadi kesalahan saat registrasi.');
        setShowModal(true);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan jaringan atau server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Daftar Akun Baru</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="fullName">Nama Lengkap:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
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
          <p className="password-hint">Min. 8 karakter, harus mengandung huruf besar, kecil, angka, dan simbol.</p>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Konfirmasi Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
        <p className="auth-switch">
          Sudah punya akun? <span onClick={() => navigate('/login')}>Login di sini</span>
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

export default RegisterPage;