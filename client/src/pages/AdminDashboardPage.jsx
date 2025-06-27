// client/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboardPage.css'; // Akan kita buat file CSS-nya nanti

function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Set default dates to cover a reasonable period, e.g., last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
        fetchAdminMetrics();
    }
  }, [startDate, endDate]); 

  const fetchAdminMetrics = async () => {
    setLoading(true);
    setError('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
      setError('Akses ditolak. Anda bukan admin.');
      setLoading(false);
      navigate('/login'); 
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/metrics?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setMetrics(data);
      } else {
        setError(data.message || 'Gagal memuat metrik admin.');
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('userInfo');
            navigate('/login'); 
        }
      }
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) return <div className="page-container">Memuat metrik admin...</div>;
  if (error) return <div className="page-container error-message">{error}</div>;

  return (
    <div className="page-container admin-dashboard">
      <h1 className="page-title">Dashboard Admin</h1>
      <p>Insight bisnis untuk SEA Catering.</p>

      <div className="date-range-selector">
        <label htmlFor="startDate">Mulai Tanggal:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">Sampai Tanggal:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {metrics && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Langganan Baru</h3>
            <p className="metric-value">{metrics.newSubscriptions}</p>
          </div>
          <div className="metric-card">
            <h3>Monthly Recurring Revenue (MRR)</h3>
            <p className="metric-value">Rp{metrics.mrr.toLocaleString('id-ID')}</p>
          </div>
          <div className="metric-card">
            <h3>Reaktivasi</h3>
            <p className="metric-value">{metrics.reactivations}</p>
          </div>
          <div className="metric-card">
            <h3>Total Langganan Aktif</h3>
            <p className="metric-value">{metrics.totalActiveSubscriptions}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;