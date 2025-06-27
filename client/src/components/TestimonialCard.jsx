// client/src/components/TestimonialCard.jsx
import React from 'react';
import './TestimonialCard.css'; 

function TestimonialCard({ testimonial }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="star filled">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star">&#9734;</span>); 
      }
    }
    return <div className="testimonial-rating">{stars}</div>;
  };

  return (
    <div className="testimonial-card">
      <p className="testimonial-message">"{testimonial.message}"</p>
      {renderStars(testimonial.rating)}
      <p className="testimonial-author">- {testimonial.customerName}</p>
    </div>
  );
}

export default TestimonialCard;