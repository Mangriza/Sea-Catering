// client/src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import MealPlanCard from '../components/MealPlanCard';
import '../App.css'; // Untuk styling page-container dan page-title

// Data dummy untuk paket makanan
const mealPlans = [
  {
    id: 1,
    name: 'Diet Plan',
    price: 'Rp30.000 / meal',
    description: 'Paket makanan rendah kalori dan bergizi seimbang untuk membantu mencapai tujuan diet Anda.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    longDescription: 'Diet Plan kami dirancang oleh ahli gizi untuk memastikan Anda mendapatkan nutrisi optimal sambil tetap mengontrol asupan kalori. Ideal untuk penurunan berat badan atau menjaga berat badan ideal.',
    benefits: ['Penurunan berat badan', 'Keseimbangan nutrisi', 'Energi stabil'],
    exampleMeals: ['Salad Ayam Panggang dengan Vinaigrette Lemon', 'Sup Brokoli Krim Rendah Lemak', 'Ikan Kukus dengan Sayuran Kukus'],
  },
  {
    id: 2,
    name: 'Protein Plan',
    price: 'Rp40.000 / meal',
    description: 'Tinggi protein untuk mendukung pertumbuhan otot dan pemulihan, cocok untuk gaya hidup aktif.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    longDescription: 'Protein Plan kami difokuskan pada sumber protein berkualitas tinggi untuk mendukung pemulihan otot, pertumbuhan, dan mempertahankan massa otot. Cocok untuk atlet dan individu aktif.',
    benefits: ['Peningkatan massa otot', 'Pemulihan cepat', 'Kenyang lebih lama'],
    exampleMeals: ['Dada Ayam Bakar dengan Quinoa dan Asparagus', 'Steak Sapi tanpa Lemak dengan Ubi Jalar', 'Smoothie Protein Berry'],
  },
  {
    id: 3,
    name: 'Royal Plan',
    price: 'Rp60.000 / meal',
    description: 'Pilihan premium dengan bahan-bahan organik dan *gourmet* untuk pengalaman makan mewah.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    longDescription: 'Royal Plan menawarkan pengalaman bersantap mewah dengan bahan-bahan organik pilihan, hidangan *gourmet*, dan variasi menu eksklusif. Nikmati hidangan kelas atas yang menyehatkan setiap hari.',
    benefits: ['Bahan organik premium', 'Menu eksklusif & gourmet', 'Nutrisi lengkap dengan cita rasa istimewa'],
    exampleMeals: ['Salmon Panggang Saus Dill dengan Nasi Merah', 'Fillet Mignon dengan Saus Jamur Truffle', 'Salad Quinoa Mediterania dengan Udang Panggang'],
  },
];

function MenuPage() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => setIsDark(document.body.classList.contains('dark-mode'));
    checkDark();
    window.addEventListener('storage', checkDark);
    return () => window.removeEventListener('storage', checkDark);
  }, []);
  return (
    <div className="page-container" style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2.5em 0' }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1em' }}>
        <h1 className="page-title" style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '2.3em', marginBottom: '0.2em', fontWeight: 800, letterSpacing: 1 }}>Our Meal Plans</h1>
        <div style={{ width: 60, height: 4, background: 'var(--primary)', borderRadius: 2, margin: '0 auto 1.2em' }}></div>
        <p style={{ textAlign: 'center', color: 'var(--text-soft)', fontSize: '1.13em', marginBottom: '2.5em', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>Explore our healthy and customizable meal plans.</p>
        <div className="meal-plans-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5em',
          maxWidth: 1100,
          margin: '0 auto',
          justifyItems: 'center',
        }}>
          {mealPlans.map((plan, idx) => (
            <div style={{ animation: 'fadeInUp 0.7s', animationDelay: `${0.1 + idx * 0.08}s`, animationFillMode: 'both', width: '100%' }} key={plan.id}>
              <MealPlanCard plan={plan} />
            </div>
          ))}
        </div>
      </section>
      <footer style={{ background: isDark ? 'var(--navy)' : 'var(--card-bg)', color: isDark ? '#FFF' : 'var(--primary)', textAlign: 'center', padding: '2em 0 1em', marginTop: '2em', borderRadius: '32px 32px 0 0', border: isDark ? 'none' : '1.5px solid #eee', fontWeight: 700, fontSize: '1.1em', transition: 'background 0.2s, color 0.2s' }}>
        <div style={{ marginBottom: 8 }}>SEA Catering &copy; {new Date().getFullYear()} &middot; <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Hubungi Kami</a></div>
      </footer>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        @media (max-width: 900px) {
          .meal-plans-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default MenuPage;