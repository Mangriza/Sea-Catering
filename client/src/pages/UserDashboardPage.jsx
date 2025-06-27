// client/src/pages/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboardPage.css'; // Akan kita buat file CSS-nya nanti

function UserDashboardPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [pauseDates, setPauseDates] = useState({ startDate: '', endDate: '' });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetchUserSubscriptions();
    const checkDark = () => setIsDark(document.body.classList.contains('dark-mode'));
    checkDark();
    window.addEventListener('storage', checkDark);
    return () => window.removeEventListener('storage', checkDark);
  }, []);

  const fetchUserSubscriptions = async () => {
    setLoading(true);
    setError('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      setError('Anda perlu login untuk melihat dashboard.');
      setLoading(false);
      navigate('/login'); // Redirect jika tidak login
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/subscriptions', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setSubscriptions(data);
      } else {
        setError(data.message || 'Gagal memuat langganan.');
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('userInfo');
            navigate('/login'); // Redirect jika token tidak valid/expired
        }
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseClick = (subscriptionId) => {
    setSelectedSubscriptionId(subscriptionId);
    setShowPauseModal(true);
  };

  const handlePauseSubmit = async () => {
    if (!pauseDates.startDate || !pauseDates.endDate) {
      alert('Mohon pilih tanggal mulai dan selesai jeda.');
      return;
    }
    if (new Date(pauseDates.startDate) > new Date(pauseDates.endDate)) {
        alert('Tanggal mulai tidak boleh lebih dari tanggal selesai.');
        return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const response = await fetch(`http://localhost:5000/api/user/subscriptions/${selectedSubscriptionId}/pause`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(pauseDates),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setShowPauseModal(false);
        setPauseDates({ startDate: '', endDate: '' }); // Reset dates
        fetchUserSubscriptions(); // Refresh data
      } else {
        alert(data.message || 'Gagal menjeda langganan.');
      }
    } catch (err) {
      console.error('Error pausing subscription:', err);
      alert('Terjadi kesalahan saat menjeda langganan.');
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan langganan ini?')) {
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const response = await fetch(`http://localhost:5000/api/user/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchUserSubscriptions(); // Refresh data
      } else {
        alert(data.message || 'Gagal membatalkan langganan.');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      alert('Terjadi kesalahan saat membatalkan langganan.');
    }
  };

  if (loading) return <div className="page-container">Memuat langganan...</div>;
  if (error) return <div className="page-container error-message">{error}</div>;

  return (
    <div className="page-container user-dashboard">
      <h1 className="page-title">Dashboard Pengguna</h1>
      <p>Kelola langganan makanan sehat Anda.</p>

      {subscriptions.length === 0 ? (
        <div style={{marginTop: 32}}>
          <p style={{fontSize: '1.1em', color: 'var(--text-soft)', marginBottom: 24}}>Anda belum memiliki langganan aktif.</p>
          <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28}}>
            <a href="/menu" className="btn-primary" style={{minWidth: 150, textAlign: 'center'}}>Lihat Menu</a>
            <a href="/subscription" className="btn-primary" style={{minWidth: 150, textAlign: 'center', background: 'var(--primary-dark)'}}>Berlangganan Sekarang</a>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center'}}>
            {/* Benefit SEA Catering */}
            <div style={{background: 'var(--card-bg)', borderRadius: 14, boxShadow: 'var(--shadow)', border: '1.5px solid #eee', padding: '1.2em 1.2em 1em', minWidth: 220, maxWidth: 300, flex: 1}}>
              <div style={{fontWeight: 700, color: 'var(--primary)', marginBottom: 8, fontSize: 17}}><i className="fa-solid fa-leaf" style={{marginRight: 8}}></i>100% Fresh & Organik</div>
              <div style={{fontWeight: 700, color: 'var(--primary)', marginBottom: 8, fontSize: 17}}><i className="fa-solid fa-utensils" style={{marginRight: 8}}></i>Bisa Custom Menu</div>
              <div style={{fontWeight: 700, color: 'var(--primary)', marginBottom: 8, fontSize: 17}}><i className="fa-solid fa-truck-fast" style={{marginRight: 8}}></i>Pengiriman Cepat</div>
            </div>
            {/* Testimoni random */}
            <div style={{background: 'var(--card-bg)', borderRadius: 14, boxShadow: 'var(--shadow)', border: '1.5px solid #eee', padding: '1.2em 1.2em 1em', minWidth: 220, maxWidth: 300, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{color: '#FFD700', fontSize: 22, marginBottom: 6}}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <div style={{fontStyle: 'italic', color: 'var(--text-soft)', marginBottom: 8}}>
                "Makanannya enak, sehat, dan pengiriman selalu tepat waktu!"
              </div>
              <div style={{fontWeight: 700, color: 'var(--primary)', fontSize: 15}}>- Budi Santoso</div>
            </div>
            {/* Promo/FAQ singkat */}
            <div style={{background: 'var(--card-bg)', borderRadius: 14, boxShadow: 'var(--shadow)', border: '1.5px solid #eee', padding: '1.2em 1.2em 1em', minWidth: 220, maxWidth: 300, flex: 1}}>
              <div style={{fontWeight: 700, color: 'var(--primary)', marginBottom: 8, fontSize: 17}}><i className="fa-solid fa-bolt" style={{marginRight: 8}}></i>Promo Spesial!</div>
              <div style={{color: 'var(--text-soft)', fontSize: 15, marginBottom: 8}}>Dapatkan diskon 10% untuk langganan pertama Anda. Masukkan kode <b>SEHAT10</b> saat checkout.</div>
              <div style={{fontWeight: 600, color: 'var(--primary)', fontSize: 14, marginTop: 10}}>FAQ:</div>
              <ul style={{color: 'var(--text-soft)', fontSize: 14, margin: 0, paddingLeft: 18}}>
                <li>Bagaimana cara berlangganan? Klik menu Subscription.</li>
                <li>Apakah bisa custom menu? Ya, bisa di menu Meal Plans.</li>
                <li>Pengiriman ke mana saja? Seluruh Jabodetabek.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="subscriptions-list">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="subscription-card">
              <h3 style={{ color: isDark ? '#FFF' : 'var(--primary)' }}>{sub.selectedPlan.name}</h3>
              <p><strong>Status:</strong> <span className={`status-${sub.status}`}>{sub.status.toUpperCase()}</span></p>
              <p><strong>Harga Per Meal:</strong> Rp{sub.selectedPlan.pricePerMeal.toLocaleString('id-ID')}</p>
              <p><strong>Jenis Makanan:</strong> {sub.selectedMealTypes.join(', ')}</p>
              <p><strong>Hari Pengiriman:</strong> {sub.selectedDeliveryDays.join(', ')}</p>
              <p><strong>Total Harga:</strong> Rp{sub.totalPrice.toLocaleString('id-ID')}</p>
              <p><strong>Tanggal Langganan:</strong> {new Date(sub.subscriptionDate).toLocaleDateString()}</p>
              {sub.status === 'paused' && sub.pauseStartDate && sub.pauseEndDate && (
                <p><strong>Dijeda Sampai:</strong> {new Date(sub.pauseStartDate).toLocaleDateString()} - {new Date(sub.pauseEndDate).toLocaleDateString()}</p>
              )}

              <div className="subscription-actions">
                {sub.status === 'active' && (
                  <button className="pause-btn" onClick={() => handlePauseClick(sub._id)}>Jeda Langganan</button>
                )}
                {(sub.status === 'active' || sub.status === 'paused') && (
                  <button className="cancel-btn" onClick={() => handleCancelSubscription(sub._id)}>Batalkan Langganan</button>
                )}
                {/* Di sini juga bisa ditambahkan tombol "Resume" jika statusnya "paused" */}
                {/* Untuk saat ini, resume sama dengan cancel pause */}
                {sub.status === 'paused' && (
                  <button className="resume-btn" onClick={() => handleCancelSubscription(sub._id)}>Lanjutkan Langganan</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPauseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Jeda Langganan</h2>
            <div className="form-group">
              <label htmlFor="pauseStartDate">Mulai Jeda:</label>
              <input
                type="date"
                id="pauseStartDate"
                value={pauseDates.startDate}
                onChange={(e) => setPauseDates({ ...pauseDates, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pauseEndDate">Akhir Jeda:</label>
              <input
                type="date"
                id="pauseEndDate"
                value={pauseDates.endDate}
                onChange={(e) => setPauseDates({ ...pauseDates, endDate: e.target.value })}
              />
            </div>
            <button className="submit-btn" onClick={handlePauseSubmit}>Konfirmasi Jeda</button>
            <button className="cancel-btn" onClick={() => setShowPauseModal(false)}>Batal</button>
          </div>
        </div>
      )}
      <footer style={{ background: isDark ? 'var(--navy)' : 'var(--card-bg)', color: isDark ? '#FFF' : 'var(--primary)', textAlign: 'center', padding: '2em 0 1em', marginTop: '2em', borderRadius: '32px 32px 0 0', border: isDark ? 'none' : '1.5px solid #eee', fontWeight: 700, fontSize: '1.1em', transition: 'background 0.2s, color 0.2s' }}>
        <div style={{ marginBottom: 8 }}>SEA Catering &copy; {new Date().getFullYear()} &middot; <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Hubungi Kami</a></div>
      </footer>
    </div>
  );
}

export default UserDashboardPage;