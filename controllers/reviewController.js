const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

// Create a review
exports.createReview = asyncHandler(async (req, res) => {
  const { supplier, order, rating, comment } = req.body;

  // Check if order belongs to this user
  const existingOrder = await Order.findOne({
    _id: order,
    buyerId: req.user._id,
    supplierId: supplier
  });

  if (!existingOrder) {
    return res.status(403).json({ message: 'You cannot review this order.' });
  }

  // Check if review already exists
  const alreadyReviewed = await Review.findOne({
    reviewer: req.user._id,
    supplier,
    order
  });

  if (alreadyReviewed) {
    return res.status(400).json({ message: 'You have already reviewed this order.' });
  }

  const review = await Review.create({
    reviewer: req.user._id,
    supplier,
    order,
    rating,
    comment
  });

  // Update supplier’s average rating
  const reviews = await Review.find({ supplier });
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await User.findByIdAndUpdate(supplier, {
    'ratings.stars': avgRating,
    'ratings.reviewCount': reviews.length
  });

  res.status(201).json({ message: 'Review submitted', review });
});

// Get reviews of a supplier
exports.getSupplierReviews = asyncHandler(async (req, res) => {
  const supplierId = req.params.supplierId;

  const reviews = await Review.find({ supplier: supplierId })
    .populate('reviewer', 'name')
    .populate('order', '_id createdAt');

  res.json(reviews);
});
