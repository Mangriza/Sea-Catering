const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI).then(async () => {
  try {
    await mongoose.connection.db.collection('users').dropIndex('username_1');
    console.log('Index username_1 berhasil dihapus!');
  } catch (err) {
    console.error('Gagal menghapus index:', err.message);
  } finally {
    mongoose.disconnect();
  }
}); 