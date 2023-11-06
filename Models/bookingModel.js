const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  holi: {
    type: mongoose.Schema.ObjectId,
    ref: 'Holi',
    required: [true, 'Booking must belong to a Holi!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a Price.'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// Query Middleware
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'holi',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
