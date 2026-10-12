const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['Client', 'Freelancer', 'Admin'],
      default: 'Client'
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role
  };
};

module.exports = mongoose.model('User', userSchema);
