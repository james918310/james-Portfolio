const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    // enum: ["student", "instructor"],
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  googleId: {
    type: String,
  },
});

// 確認學生身分
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
//確認講師身分
userSchema.methods.isIsntructor = function () {
  return this.role == "instructor";
};

//判斷密碼是否正確
userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// pre專屬於mongoose裡的middlewares ，有點像是監聽器
userSchema.pre("save", async function (next) {
  // this 代表 mongoDB 內的 document
  //如果沒有googleid 就必須輸入password
  if (!this.googleId && !this.password) {
    return next(new Error("Password is required when googleId is not present"));
  } else if (this.password) {
    // mongoose middlewares
    // 若使用者為新用戶，或者是正在更改密碼，則將密碼進行雜湊處理

    if (this.isNew || this.isModified("password")) {
      const hashValue = await bcrypt.hash(this.password, 10);
      this.password = hashValue;
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
