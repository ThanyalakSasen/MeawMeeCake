const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
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
  profileCompleted: {
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
  resetPasswordToken: {
    type: String,
    default: null
  },
  
  resetPasswordTokenExpiry: {
    type: Date,
    default: null
  },

 
  
  verificationTokenExpiry: {
    type: Date,
    default: null},

  deletedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true })


userSchema.pre("save", async function () {
  // ถ้าไม่ได้มีการเปลี่ยนรหัสผ่าน ให้หยุดการทำงาน (Return) ทันที
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // ไม่ต้องเรียก next() เพราะเป็น async function
  } catch (err) {
    throw new Error(err); // โยน Error เพื่อให้ Mongoose จัดการ
  }
});

// 2. ส่วนเปรียบเทียบรหัสผ่าน
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3. ส่วนสร้าง Verification Token (สำหรับการยืนยันอีเมล)
userSchema.methods.createVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  // *** สำคัญ: ต้องเป็น emailVerifyToken ให้ตรงกับ Schema และ Controller ***
  this.emailVerifyToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; 
  
  return token;
};

// 4. ส่วนสร้าง Reset Password Token (สำหรับการลืมรหัสผ่าน)
userSchema.methods.createResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetPasswordTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 ชม.

  return token;
};


module.exports = mongoose.model('User', userSchema)

