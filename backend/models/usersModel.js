const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema

const userSchema = new Schema({
  user_fullname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    sparse: true
  },

  password: {
    type: String,
    default: null
  },

  googleId: {
    type: String,
    default: null
  },

  authProvider: {
    type: String,
    enum: ['local', 'google'],
    required: true
  },

  role: {
    type: String,
    enum: ['Owner', 'Customer', 'Employee'],
    required: true
  },

  user_birthdate: Date,

  user_phone: {
  type: String,
  required: false // เปลี่ยนเป็น false เพื่อรองรับ Google Login
},

  user_img: {
    type: String,
    default: null
  },

  user_allergies: {
    type: [String],
    default: []
  },
  emailVerifyToken: {
    type: String,
    default: null
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // ===== Employee only =====
  emp_position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: function () {
      return this.role === 'Employee'
    }
  },

  start_working_date: {
    type: Date,
    required: function () {
      return this.role === 'Employee'
    }
  },

  last_working_date: {
    type: Date,
    default: null
  },

  employment_type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: function () {
      return this.role === 'Employee'
    }
  },

  employee_salary: {
    type: Number,
    required: function () {
      return this.role === 'Employee'
    }
  },

  employee_status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },

  isActive: {
    type: Boolean,
    default: true
  },

  deletedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true })


userSchema.pre('save', async function () {
  if (!this.password) return;

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});


userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}


module.exports = mongoose.model('User', userSchema)

