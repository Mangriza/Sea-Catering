// client/src/components/TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import './TestimonialSection.css';

const initialTestimonials = [
  {
    id: 1,
    customerName: 'Budi Santoso',
    message: 'Makanan SEA Catering benar-benar mengubah gaya hidup saya! Enak dan sehat, pengiriman selalu tepat waktu.',
    rating: 5,
  },
  {
    id: 2,
    customerName: 'Siti Aminah',
    message: 'Saya suka pilihan kustomisasi yang ditawarkan. Sangat membantu saya menjaga pola makan sehat di tengah kesibukan.',
    rating: 4,
  },
  {
    id: 3,
    customerName: 'Joko Prabowo',
    message: 'Porsi pas, rasa lezat, dan informasi nutrisi yang jelas. Rekomendasi banget!',
    rating: 5,
  },
  {
    id: 4,
    customerName: 'Maria Chandra',
    message: 'Sejak langganan, saya merasa lebih berenergi dan sehat. Tim supportnya juga responsif.',
    rating: 5,
  },
];

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]); 
  const [newTestimonial, setNewTestimonial] = useState({
    customerName: '',
    message: '',
    rating: 0,
  });
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const API_URL_TESTIMONIALS = 'http://localhost:5000/api/testimonials'; 

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(API_URL_TESTIMONIALS);
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        } else {
          console.error('Failed to fetch testimonials:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial({ ...newTestimonial, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setNewTestimonial({ ...newTestimonial, rating });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (newTestimonial.customerName && newTestimonial.message && newTestimonial.rating > 0) {
      try {
        const response = await fetch(API_URL_TESTIMONIALS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTestimonial),
        });

        const result = await response.json();

        if (response.ok) {
          alert(`Terima kasih atas testimonial Anda: ${result.message}`);
          setTestimonials((prevTestimonials) => [result.testimonial, ...prevTestimonials]); 
          setNewTestimonial({ customerName: '', message: '', rating: 0 }); 
          setCurrentTestimonialIndex(0); 
        } else {
          alert(`Gagal mengirim testimoni: ${result.message || 'Terjadi kesalahan.'}`);
          console.error('Server error:', result);
        }
      } catch (error) {
        console.error('Error submitting testimonial:', error);
        alert('Terjadi kesalahan saat mengirim testimoni. Coba lagi nanti.');
      }
    } else {
      alert('Mohon lengkapi semua kolom testimonial (Nama, Pesan, dan Rating).');
    }
  };

  // Fungsi untuk slider/carousel
  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      (prevIndex + 1) % testimonials.length
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const listRef = React.useRef(null);
  const autoScrollRef = React.useRef();
  const userScrollingRef = React.useRef(false);
  const pauseTimeoutRef = React.useRef();

  // Dummy jika kosong
  const displayTestimonials = testimonials.length > 0 ? testimonials : initialTestimonials;

  // Auto-scroll effect
  useEffect(() => {
    if (!listRef.current) return;
    function scrollStep() {
      if (!userScrollingRef.current && listRef.current) {
        listRef.current.scrollLeft += 1.1;
        if (
          listRef.current.scrollLeft + listRef.current.offsetWidth >=
          listRef.current.scrollWidth - 2
        ) {
          listRef.current.scrollLeft = 0; 
        }
      }
    }
    autoScrollRef.current && clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(scrollStep, 18);
    return () => clearInterval(autoScrollRef.current);
  }, [displayTestimonials.length]);

  function handleUserScrollStart() {
    userScrollingRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }
  function handleUserScroll() {
    userScrollingRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      userScrollingRef.current = false;
    }, 3000);
  }

  return (
    <section className="testimonials-section">
      <h2>Apa Kata Pelanggan Kami?</h2>

      {/* Daftar Komentar/Testimoni - Auto Scrollable */}
      <div
        className="testimonial-list-scroll"
        ref={listRef}
        onMouseDown={handleUserScrollStart}
        onTouchStart={handleUserScrollStart}
        onScroll={handleUserScroll}
        style={{ marginTop: 24, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 8 }}
      >
        {displayTestimonials.length > 0 ? displayTestimonials.map((t, idx) => (
          <div key={t._id || t.id || idx} className="testimonial-list-card" style={idx === displayTestimonials.length - 1 ? {marginRight: 32} : {}}>
            <div className="testimonial-list-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < t.rating ? 'star filled' : 'star'}>&#9733;</span>
              ))}
            </div>
            <div className="testimonial-list-message">"{t.message}"</div>
            <div className="testimonial-list-name">- {t.customerName}</div>
          </div>
        )) : <div style={{color: 'var(--text-soft)', fontStyle: 'italic'}}>Belum ada testimoni.</div>}
      </div>

      {/* Testimonial Submission Form */}
      <h3 style={{ color: document.body.classList.contains('dark-mode') ? '#FFF' : 'var(--primary)', marginTop: 36, marginBottom: 12 }}>{'Bagikan Pengalaman Anda!'}</h3>
      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-group">
          <label htmlFor="customerName" style={{ color: 'var(--text)', fontWeight: 600 }}>Nama Anda:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={newTestimonial.customerName}
            onChange={handleInputChange}
            required
            style={{ color: 'var(--text)', background: 'var(--input-bg, var(--card-bg))', border: '1.5px solid var(--primary)', borderRadius: 8, padding: '8px 12px', fontSize: 15 }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message" style={{ color: 'var(--text)', fontWeight: 600 }}>Pesan Anda:</label>
          <textarea
            id="message"
            name="message"
            value={newTestimonial.message}
            onChange={handleInputChange}
            required
            style={{ color: 'var(--text)', background: 'var(--input-bg, var(--card-bg))', border: '1.5px solid var(--primary)', borderRadius: 8, padding: '8px 12px', fontSize: 15 }}
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star-input ${star <= newTestimonial.rating ? 'selected' : ''}`}
                onClick={() => handleRatingChange(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-testimonial-btn">Kirim Testimoni</button>
      </form>
    </section>
  );
}

export default TestimonialsSection;