// client/src/components/SubscriptionForm.jsx
import React, { useState, useEffect } from 'react';
import './SubscriptionForm.css'; 
import Modal from './Modal';

function SubscriptionForm() {

  const planOptions = [
    { name: 'Diet Plan', pricePerMeal: 30000 },
    { name: 'Protein Plan', pricePerMeal: 40000 },
    { name: 'Royal Plan', pricePerMeal: 60000 },
  ];

  const mealTypeOptions = [
    { name: 'Breakfast', value: 'breakfast' },
    { name: 'Lunch', value: 'lunch' },
    { name: 'Dinner', value: 'dinner' },
  ];

  const dayOptions = [
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday', value: 'thursday' },
    { name: 'Friday', value: 'friday' },
    { name: 'Saturday', value: 'saturday' },
    { name: 'Sunday', value: 'sunday' },
  ];

  // State untuk menyimpan data formulir
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    selectedPlan: null, 
    selectedMealTypes: [], 
    selectedDeliveryDays: [], 
    allergies: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');


  const API_URL = 'http://localhost:5000/api/subscribe'; 

 
  useEffect(() => {
    const calculatePrice = () => {
      const plan = formData.selectedPlan;
      const numMealTypes = formData.selectedMealTypes.length;
      const numDeliveryDays = formData.selectedDeliveryDays.length;

      if (plan && numMealTypes > 0 && numDeliveryDays > 0) {
        const price = plan.pricePerMeal * numMealTypes * numDeliveryDays * 4.3;
        setTotalPrice(price);
      } else {
        setTotalPrice(0);
      }
    };

    calculatePrice();
  }, [formData]);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handlePlanChange = (plan) => {
    setFormData({ ...formData, selectedPlan: plan });
    setFormErrors(prevErrors => ({ ...prevErrors, selectedPlan: '' }));
  };

  const handleMealTypeChange = (value) => {
    const updatedMealTypes = formData.selectedMealTypes.includes(value)
      ? formData.selectedMealTypes.filter((type) => type !== value)
      : [...formData.selectedMealTypes, value];
    setFormData({ ...formData, selectedMealTypes: updatedMealTypes });
    setFormErrors(prevErrors => ({ ...prevErrors, selectedMealTypes: '' }));
  };

  const handleDeliveryDayChange = (value) => {
    const updatedDeliveryDays = formData.selectedDeliveryDays.includes(value)
      ? formData.selectedDeliveryDays.filter((day) => day !== value)
      : [...formData.selectedDeliveryDays, value];
    setFormData({ ...formData, selectedDeliveryDays: updatedDeliveryDays });
    setFormErrors(prevErrors => ({ ...prevErrors, selectedDeliveryDays: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nama lengkap wajib diisi.';
    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Nomor telepon wajib diisi.';
    } else if (!/^\d+$/.test(formData.phoneNumber.trim())) {
        errors.phoneNumber = 'Nomor telepon harus berupa angka.';
    }
    if (!formData.selectedPlan) errors.selectedPlan = 'Pilih salah satu paket.';
    if (formData.selectedMealTypes.length === 0) errors.selectedMealTypes = 'Pilih setidaknya satu jenis makanan.';
    if (formData.selectedDeliveryDays.length === 0) errors.selectedDeliveryDays = 'Pilih setidaknya satu hari pengiriman.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const dataToSend = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          selectedPlan: formData.selectedPlan,
          selectedMealTypes: formData.selectedMealTypes,
          selectedDeliveryDays: formData.selectedDeliveryDays,
          allergies: formData.allergies,
          totalPrice: totalPrice,
        };

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify(dataToSend),
        });

        const result = await response.json();

        if (response.ok) {
          setModalType('success');
          setModalMessage(`Berhasil berlangganan!\nTotal Harga: Rp${totalPrice.toLocaleString('id-ID')}\n${result.message}`);
          setShowModal(true);
          setFormData({
            name: '',
            phoneNumber: '',
            selectedPlan: null,
            selectedMealTypes: [],
            selectedDeliveryDays: [],
            allergies: '',
          });
          setTotalPrice(0);
          setTimeout(() => setShowModal(false), 2000);
        } else {
          setModalType('error');
          setModalMessage(`Gagal berlangganan: ${result.message || 'Terjadi kesalahan.'}`);
          setShowModal(true);
          console.error('Server error:', result);
        }
      } catch (error) {
        console.error('Error submitting subscription:', error);
        setModalType('error');
        setModalMessage('Terjadi kesalahan saat mengirim formulir. Coba lagi nanti.');
        setShowModal(true);
      }
    } else {
      setModalType('error');
      setModalMessage('Mohon lengkapi semua kolom wajib dan perbaiki error.');
      setShowModal(true);
    }
  };

  return (
    <div className="subscription-form-container">
      <h2>Pesan Paket Makanan Anda</h2>
      <form onSubmit={handleSubmit} className="subscription-form">
        <div className="form-group">
          <label htmlFor="name">*Nama Lengkap:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={formErrors.name ? 'input-error' : ''}
          />
          {formErrors.name && <p className="error-message">{formErrors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">*Nomor Telepon Aktif:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={formErrors.phoneNumber ? 'input-error' : ''}
          />
          {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}
        </div>

        <div className="form-group">
          <label>*Pilih Paket:</label>
          {planOptions.map((plan) => (
            <div key={plan.name} className="radio-option">
              <input
                type="radio"
                id={plan.name}
                name="planSelection"
                checked={formData.selectedPlan?.name === plan.name}
                onChange={() => handlePlanChange(plan)}
              />
              <label htmlFor={plan.name}>
                {plan.name} – Rp{plan.pricePerMeal.toLocaleString('id-ID')} per meal
              </label>
            </div>
          ))}
          {formErrors.selectedPlan && <p className="error-message">{formErrors.selectedPlan}</p>}
        </div>

        <div className="form-group">
          <label>*Jenis Makanan:</label>
          {mealTypeOptions.map((mealType) => (
            <div key={mealType.value} className="checkbox-option">
              <input
                type="checkbox"
                id={mealType.value}
                name="mealType"
                value={mealType.value}
                checked={formData.selectedMealTypes.includes(mealType.value)}
                onChange={() => handleMealTypeChange(mealType.value)}
              />
              <label htmlFor={mealType.value}>{mealType.name}</label>
            </div>
          ))}
          {formErrors.selectedMealTypes && <p className="error-message">{formErrors.selectedMealTypes}</p>}
        </div>

        <div className="form-group">
          <label>*Hari Pengiriman:</label>
          {dayOptions.map((day) => (
            <div key={day.value} className="checkbox-option">
              <input
                type="checkbox"
                id={day.value}
                name="deliveryDays"
                value={day.value}
                checked={formData.selectedDeliveryDays.includes(day.value)}
                onChange={() => handleDeliveryDayChange(day.value)}
              />
              <label htmlFor={day.value}>{day.name}</label>
            </div>
          ))}
          {formErrors.selectedDeliveryDays && <p className="error-message">{formErrors.selectedDeliveryDays}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="allergies">Alergi atau Pembatasan Diet:</label>
          <textarea
            id="allergies"
            name="allergies"
            rows="3"
            value={formData.allergies}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="total-price-display">
          <h3>Total Harga: Rp{totalPrice.toLocaleString('id-ID')}</h3>
        </div>

        <button type="submit" className="btn-primary">
          Berlangganan Sekarang
        </button>
      </form>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className={`modal-${modalType}`}>{modalMessage.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}</div>
        </Modal>
      )}
    </div>
  );
}

export default SubscriptionForm;