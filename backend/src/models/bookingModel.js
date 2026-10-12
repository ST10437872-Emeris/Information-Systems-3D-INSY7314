const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        'Confirmed',
        'Completed',
        'Cancelled'
      ],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model('Booking', bookingSchema);
