// client/src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import TestimonialsSection from '../components/TestimonialSection';
import '../App.css'; 

const heroImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', 
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', 
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80', 
];

const signatureDishes = [
  {
    name: 'Salmon Panggang',
    desc: 'Salmon segar dengan saus lemon dan sayuran organik.',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    promo: 'Best Seller',
  },
  {
    name: 'Protein Bowl',
    desc: 'Dada ayam bakar, quinoa, dan sayuran warna-warni.',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    promo: 'Promo Minggu Ini',
  },
  {
    name: 'Vegan Wrap',
    desc: 'Wrap isi sayuran segar, hummus, dan saus sehat.',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    promo: 'Favorit Vegan',
  },
];

function isOpenNow() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 10 && hour < 22;
}

function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [dishIndex, setDishIndex] = useState(0);
  const [open, setOpen] = useState(isOpenNow());
  const menuRef = useRef(null);
  const promoRef = useRef(null);
  const testiRef = useRef(null);
  const lokasiRef = useRef(null);
  const contactRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Signature dish slider auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setDishIndex((prev) => (prev + 1) % signatureDishes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Jam buka status real-time
  useEffect(() => {
    const timer = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Deteksi dark mode dari body
  useEffect(() => {
    const checkDark = () => setIsDark(document.body.classList.contains('dark-mode'));
    checkDark();
    window.addEventListener('storage', checkDark);
    return () => window.removeEventListener('storage', checkDark);
  }, []);

  // Smooth scroll handler
  const handleScrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (window.location.hash === '#contact' && contactRef.current) {
      setTimeout(() => {
        contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, []);

  return (
    <div className="homepage" style={{ background: 'var(--bg)' }}>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          minHeight: window.innerWidth <= 700 ? 220 : '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: window.innerWidth <= 700 ? '0 0 18px 18px' : '0 0 32px 32px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(26,35,126,0.10)',
        }}
      >
        {/* Background Image */}
        <img
          src={heroImages[heroIndex]}
          alt="Healthy Food Hero"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            transition: 'opacity 0.7s',
            borderRadius: window.innerWidth <= 700 ? '0 0 18px 18px' : '0 0 32px 32px',
            minHeight: window.innerWidth <= 700 ? 220 : undefined,
            maxHeight: window.innerWidth <= 700 ? 220 : undefined,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: window.innerWidth <= 700 ? '0 0 18px 18px' : '0 0 32px 32px',
            minHeight: window.innerWidth <= 700 ? 220 : undefined,
            maxHeight: window.innerWidth <= 700 ? 220 : undefined,
            background: isDark
              ? 'rgba(0,0,0,0.65)'
              : 'rgba(0,0,0,0.45)',
            zIndex: 2,
            transition: 'background 0.3s',
          }}
        ></div>
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '3em 1em',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2.8em', fontWeight: 700, margin: 0, color: '#FFF', textShadow: '0 2px 8px #1A237E33' }}>SEA Catering</h1>
          <p className="slogan" style={{ fontSize: '1.3em', margin: '1em 0 2em', color: '#FFF', fontWeight: 500 }}>
            "Healthy Meals, Anytime, Anywhere"
          </p>
          <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
            <a href="/menu" className="btn-primary" style={{ fontSize: '1.1em' }}>Lihat Menu</a>
            <a href="/register" className="btn-secondary" style={{ fontSize: '1.1em' }}>Daftar Sekarang</a>
          </div>
        </div>
      </section>

      {/* Signature Dish / Promo Section */}
      <section ref={promoRef} style={{ maxWidth: 1100, margin: '3em auto 2em', padding: '0 1em' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5em' }}>Signature Dish & Promo</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2em', flexWrap: 'wrap' }}>
          {signatureDishes.map((dish, idx) => (
            <div
              key={dish.name}
              className="card"
              style={{
                width: 300,
                padding: 0,
                overflow: 'hidden',
                boxShadow: dishIndex === idx ? '0 8px 32px #1A237E33' : 'var(--shadow)',
                border: dishIndex === idx ? '2px solid #FFD700' : 'none',
                transform: dishIndex === idx ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.4s',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={() => setDishIndex(idx)}
            >
              <img src={dish.img} alt={dish.name} style={{ width: '100%', height: 170, objectFit: 'cover' }} />
              <div style={{ padding: '1.2em' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--primary)', color: '#FFF', fontWeight: 700, borderRadius: 12, padding: '2px 14px', fontSize: 13 }}>{dish.promo}</div>
                <h3 style={{ color: isDark ? '#FFF' : 'var(--primary)', margin: '1.5em 0 0.5em', textShadow: isDark ? '0 2px 8px #0006' : 'none' }}>{dish.name}</h3>
                <p style={{ color: 'var(--text-soft)', fontSize: 15 }}>{dish.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5em', marginTop: '2em' }}>Kenapa Pilih SEA Catering?</h2>
      <section ref={menuRef} className="features-section" style={{ maxWidth: 1100, margin: '3em auto 2em', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2em' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-bowl-food" style={{ fontSize: '2.2em', color: 'var(--primary)', marginBottom: 12 }}></i>
          <h3>Kustomisasi Menu</h3>
          <p>Sesuaikan menu sesuai preferensi dan kebutuhan diet Anda, dari diet sehat hingga protein tinggi.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-truck-fast" style={{ fontSize: '2.2em', color: 'var(--primary)', marginBottom: 12 }}></i>
          <h3>Pengiriman Cepat</h3>
          <p>Pengiriman makanan sehat ke seluruh kota besar di Indonesia, selalu segar dan tepat waktu.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-seedling" style={{ fontSize: '2.2em', color: 'var(--primary)', marginBottom: 12 }}></i>
          <h3>Bahan Berkualitas</h3>
          <p>Menggunakan bahan organik dan segar, serta informasi nutrisi yang jelas di setiap hidangan.</p>
        </div>
      </section>


      {/* Product Gallery Section */}
      <section ref={lokasiRef} className="product-gallery" style={{ maxWidth: 1100, margin: '2em auto', padding: '0 1em' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5em' }}>Galeri Menu Favorit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5em' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" alt="Salad" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="Protein Bowl" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" alt="Healthy Wrap" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" alt="Fruit Bowl" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Testimonials Section - Panggil komponen ini di sini */}
      <section ref={testiRef}>
        <TestimonialsSection />
      </section>

      {/* Contact Us Section */}
      <section ref={contactRef} id="contact-section" ref-contact-section style={{ maxWidth: 900, margin: '3em auto 0', padding: '2em 1em', background: 'var(--card-bg)', borderRadius: 20, boxShadow: 'var(--shadow)', color: 'var(--text)', border: '1.5px solid #eee', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Kiri: Info Kontak */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: 18, textAlign: 'left' }}>Contact Us</h2>
          <div style={{ fontSize: 17, marginBottom: 16, textAlign: 'left', lineHeight: 1.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-building"></i> <b>SEA Catering</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-location-dot"></i> Jl. Sehat No. 123, Jakarta</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-envelope"></i> <a href="mailto:info@seacatering.com" style={{ color: 'var(--primary)' }}>info@seacatering.com</a></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-brands fa-whatsapp"></i> <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>+62 812-3456-789</a></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-clock"></i> <span>Jam Operasional: <b>10.00 – 22.00</b></span></div>
          </div>
          <div style={{ fontSize: 22, marginTop: 10, textAlign: 'left' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', margin: '0 10px 0 0' }}><i className="fa-brands fa-instagram"></i></a>
            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', margin: '0 10px' }}><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
        {/* Kanan: Google Maps + Benefit */}
        <div style={{ flex: 1, minWidth: 260, background: 'var(--bg)', borderRadius: 16, boxShadow: 'var(--shadow-soft)', padding: '1.5em 1em', border: '1.5px solid #eee', marginTop: 0 }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: 12, textAlign: 'left' }}>Lokasi & Keunggulan</h3>
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 8px rgba(24,28,42,0.10)' }}>
            <iframe
              title="Lokasi SEA Catering"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123456789!2d106.8166667!3d-6.2000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1c5e6b0b0b1%3A0x123456789abcdef!2sJl.%20Sehat%20No.%20123%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
              width="100%"
              height="160"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div style={{ textAlign: 'left', color: 'var(--text)', fontSize: 15 }}>
            <b>Kenapa Pilih SEA Catering?</b>
            <ul style={{ paddingLeft: 18, margin: '10px 0 0 0', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-leaf" style={{ color: 'var(--primary)' }}></i> 100% Fresh & Organik</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-utensils" style={{ color: 'var(--primary)' }}></i> Bisa Custom Menu</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-truck-fast" style={{ color: 'var(--primary)' }}></i> Pengiriman Cepat & Aman</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-star" style={{ color: 'var(--primary)' }}></i> Rating 4.9/5 dari Pelanggan</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><i className="fa-solid fa-headset" style={{ color: 'var(--primary)' }}></i> CS Responsif & Ramah</li>
            </ul>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { #contact-section[ref-contact-section] { flex-direction: column; gap: 0; } }`}</style>
      </section>

      {/* Footer */}
      <footer style={{ background: isDark ? 'var(--navy)' : 'var(--card-bg)', color: isDark ? '#FFF' : 'var(--primary)', textAlign: 'center', padding: '2em 0 1em', marginTop: '2em', borderRadius: '32px 32px 0 0', border: isDark ? 'none' : '1.5px solid #eee', fontWeight: 700, fontSize: '1.1em', transition: 'background 0.2s, color 0.2s' }}>
        <div style={{ marginBottom: 8 }}>SEA Catering &copy; {new Date().getFullYear()} &middot; <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Hubungi Kami</a></div>
      </footer>

      <style>{`
        @media (max-width: 700px) {
          .hero-section {
            min-height: 220px !important;
            border-radius: 0 0 18px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;