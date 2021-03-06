const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var validateEmail = (email) => {
  return (/\S+@\S+\.\S+/).test(email);
};

var validateScreenName = (screenName) => {
  return (/^[a-zA-Z][0-9a-zA-Z]+$/).test(screenName);
};

var userSchema = new Schema({
  //Email has to be dropped at some point. WE DON'T WANT THEIR EMAILS
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please enter a valid email']
  },
  password: {
    type: String
  },
  screenName: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Screen name is required',
    validate: [validateScreenName, 'Please enter a valid screen name (no symbols)']
  },
  balance: {
    type: Number,
    default: 0,
  },
  wallets: [],
  lastTransactionId: {
    type: String,
    default: ''
  },
  cashRegister: {
    type: String,
    default: ''
  },
  personalAddress: {
    type: String
  }
});

userSchema.pre('save', function(next) {
  var user = this;
  if (user.isNew || user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) { return next(err); }
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('user', userSchema);
