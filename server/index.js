// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const Subscription = require('./models/Subscription'); 
const Testimonial = require('./models/Testimonial');
const User = require('./models/User'); 
const jwt = require('jsonwebtoken'); 

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; 


// Middleware
app.use(cors()); 
app.use(express.json());

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1h' }); 
};

// Koneksi ke MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Rute API
// 1. Root API Endpoint
app.get('/', (req, res) => {
  res.send('SEA Catering Backend API is running!');
});

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validasi input awal (akan diperkuat di Level 4, Bagian 2)
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Mohon lengkapi semua kolom wajib.' });
    }
    // Validasi kekuatan password di backend (contoh sederhana, bisa lebih kompleks)
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      return res.status(400).json({ message: 'Password minimal 8 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial.' });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const user = await User.create({
      fullName,
      email,
      password, // Password akan di-hash oleh pre-save hook di model
    });

    // Hasilkan token setelah registrasi sukses
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Registrasi berhasil!',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 6. Login Pengguna (POST /api/login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah user ada
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // Bandingkan password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // Hasilkan token setelah login sukses
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login berhasil!',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; 
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next(); 
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Tidak terotorisasi, token gagal.' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token.' });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak, hanya admin yang diizinkan.' });
  }
};

app.get('/api/protected', protect, (req, res) => {
  res.json({ message: `Halo, ${req.user.role} ${req.user.id}! Anda memiliki akses.` });
});

app.get('/api/admin-only', protect, admin, (req, res) => {
    res.json({ message: `Selamat datang, Admin ${req.user.id}! Ini adalah data rahasia.` });
});

app.post('/api/subscribe', protect, async (req, res) => {
  try {
    const { name, phoneNumber, selectedPlan, selectedMealTypes, selectedDeliveryDays, allergies, totalPrice } = req.body;
    const userId = req.user.id; 

    if (!name || !phoneNumber || !selectedPlan || !selectedMealTypes || selectedMealTypes.length === 0 || !selectedDeliveryDays || selectedDeliveryDays.length === 0 || !totalPrice) {
      return res.status(400).json({ message: 'Missing required fields or invalid data.' });
    }

    const newSubscription = new Subscription({
      name,
      phoneNumber,
      selectedPlan,
      selectedMealTypes,
      selectedDeliveryDays,
      allergies,
      totalPrice,
      userId 
    });

    await newSubscription.save();
    res.status(201).json({ message: 'Subscription created successfully!', subscription: newSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/user/subscriptions', protect, async (req, res) => {
  try {
    const userId = req.user.id; // ID pengguna dari token
    const subscriptions = await Subscription.find({ userId }).sort({ subscriptionDate: -1 });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/user/subscriptions/:id/pause', protect, async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id; 
    const { startDate, endDate } = req.body; 

    const subscription = await Subscription.findOne({ _id: id, userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Langganan tidak ditemukan atau Anda tidak memiliki akses.' });
    }


    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: 'Tanggal jeda tidak valid.' });
    }

    subscription.status = 'paused';
    subscription.pauseStartDate = new Date(startDate);
    subscription.pauseEndDate = new Date(endDate);
    await subscription.save();

    res.status(200).json({ message: 'Langganan berhasil dijeda.', subscription });
  } catch (error) {
    console.error('Error pausing subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/user/subscriptions/:id/cancel', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; 

    const subscription = await Subscription.findOne({ _id: id, userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Langganan tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    subscription.status = 'cancelled';
    subscription.pauseStartDate = null; 
    subscription.pauseEndDate = null;
    await subscription.save();

    res.status(200).json({ message: 'Langganan berhasil dibatalkan.', subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { customerName, message, rating } = req.body;

    if (!customerName || !message || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Missing required fields or invalid rating.' });
    }

    const newTestimonial = new Testimonial({
      customerName,
      message,
      rating
    });

    await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial submitted successfully!', testimonial: newTestimonial });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }); 
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/metrics', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query; 

    let query = {};
    if (startDate && endDate) {
      query.subscriptionDate = {
        $gte: new Date(startDate), 
        $lte: new Date(endDate)
      };
    }

 
    const newSubscriptions = await Subscription.countDocuments(query);
    const activeSubscriptionsQuery = { ...query, status: 'active' };
    const activeSubscriptions = await Subscription.find(activeSubscriptionsQuery);
    const mrr = activeSubscriptions.reduce((sum, sub) => sum + sub.totalPrice, 0);
    const reactivations = await Subscription.countDocuments({
        ...query,
        status: 'active',
        pauseStartDate: { $ne: null } 
    });

    const totalActiveSubscriptions = await Subscription.countDocuments({ status: 'active' });

    res.status(200).json({
      newSubscriptions,
      mrr,
      reactivations,
      totalActiveSubscriptions,
    });

  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access backend at http://localhost:${PORT}`);
});