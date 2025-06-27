// server/models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  selectedPlan: {
    name: { type: String, required: true },
    pricePerMeal: { type: Number, required: true }
  },
  selectedMealTypes: {
    type: [String], 
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one meal type must be selected!'
    }
  },
  selectedDeliveryDays: {
    type: [String], 
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one delivery day must be selected!'
    }
  },
  allergies: {
    type: String,
    default: '',
    trim: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  pauseStartDate: {
    type: Date,
    default: null
  },
  pauseEndDate: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);