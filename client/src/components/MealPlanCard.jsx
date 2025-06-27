
import React, { useState } from 'react';
import Modal from './Modal'; 
import './MealPlanCard.css'; 

function MealPlanCard({ plan }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="meal-plan-card">
      {plan.image && <img src={plan.image} alt={plan.name} className="plan-image" />}
      <h3>{plan.name}</h3>
      <p className="plan-price">{plan.price}</p>
      <p className="plan-description">{plan.description}</p>
      <button className="details-button" onClick={() => setShowModal(true)}>
        See More Details
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>{plan.name} Details</h2>
          <p>{plan.longDescription}</p>
          {}
          {plan.benefits && ( 
            <div>
              <h4>Benefits:</h4>
              <ul>
                {plan.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          {plan.exampleMeals && (
            <div>
              <h4>Example Meals:</h4>
              <ul>
                {plan.exampleMeals.map((meal, index) => (
                  <li key={index}>{meal}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default MealPlanCard;