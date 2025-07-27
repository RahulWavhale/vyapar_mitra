const express = require('express');
const app = express();
const router = express.Router();

const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db').default;

connectDB();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000', // ⛔ Do NOT use '*'
  credentials: true,               // ✅ Allow cookies/headers
}));
app.use(express.json());

console.log(process.env.JWT_SECRET);
// ROUTES
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/supplier', require('./routes/supplierRoutes'));
app.use('/api/buyer', require('./routes/buyerRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send('Welcome to the root!')
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});
