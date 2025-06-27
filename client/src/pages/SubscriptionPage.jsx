// client/src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import SubscriptionForm from '../components/SubscriptionForm'; // Import komponen form

function SubscriptionPage() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => setIsDark(document.body.classList.contains('dark-mode'));
    checkDark();
    window.addEventListener('storage', checkDark);
    return () => window.removeEventListener('storage', checkDark);
  }, []);
  return (
    <div className="page-container" style={{
      background: 'var(--card-bg)',
      borderRadius: '16px',
      boxShadow: 'var(--shadow)',
      border: '1.5px solid #eee',
      padding: '40px 24px',
      maxWidth: 800,
      margin: '40px auto',
      transition: 'background 0.2s, color 0.2s',
    }}>
      <h1 className="page-title" style={{ color: 'var(--primary)', textAlign: 'center', fontWeight: 800, fontSize: '2em', marginBottom: 8 }}>Subscribe to a Plan</h1>
      <p style={{ color: 'var(--text-soft)', textAlign: 'center', marginBottom: 32 }}>Choose your preferred meal plan and customize your subscription.</p>
      <SubscriptionForm /> {/* Tampilkan komponen formulir di sini */}
      <footer style={{ background: isDark ? 'var(--navy)' : 'var(--card-bg)', color: isDark ? '#FFF' : 'var(--primary)', textAlign: 'center', padding: '2em 0 1em', marginTop: '2em', borderRadius: '32px 32px 0 0', border: isDark ? 'none' : '1.5px solid #eee', fontWeight: 700, fontSize: '1.1em', transition: 'background 0.2s, color 0.2s' }}>
        <div style={{ marginBottom: 8 }}>SEA Catering &copy; {new Date().getFullYear()} &middot; <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Hubungi Kami</a></div>
      </footer>
    </div>
  );
}

export default SubscriptionPage;