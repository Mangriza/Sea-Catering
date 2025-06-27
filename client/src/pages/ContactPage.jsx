// client/src/pages/ContactPage.jsx
import React from 'react';

function ContactPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
      <p>Feel free to reach out to us!</p>
      <div style={{ padding: '20px' }}>
        <p><strong>Manager:</strong> Brian</p>
        <p><strong>Phone Number:</strong> 08123456789</p>
        <p>
          Kami siap membantu Anda dengan pertanyaan apa pun tentang layanan SEA Catering.
          Jangan ragu untuk menghubungi kami melalui telepon atau email.
        </p>
        {}
      </div>
    </div>
  );
}

export default ContactPage;