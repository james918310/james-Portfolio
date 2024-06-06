const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { user } = require("../models");

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});

//學生註冊
router.post("/register/student", async (req, res) => {
  console.log("有收到請求");
  //確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({
    email: req.body.email,
    role: "student",
  });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了。。。");

  // 製作新用戶
  let { email, username, password } = req.body;
  let newUser = new User({ email, username, password, role: "student" });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存。",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

//老師註冊
router.post("/register/instructor", async (req, res) => {
  console.log("有收到請求");
  //確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({
    email: req.body.email,
    role: "instructor",
  });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了。。。");

  // 製作新用戶
  let { email, username, password } = req.body;
  let newUser = new User({ email, username, password, role: "instructor" });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存。",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

//學生登入系統
router.post("/login/student", async (req, res) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const foundUser = await User.findOne({
    email: req.body.email,
    role: "student",
  });
  if (!foundUser) {
    return res.status(401).send("無法找到使用者。請確認信箱是否正確。");
  }
  // comparePassword 在user models的一個funtion用來判段使用者輸入的密碼是否正確
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

//講師登入系統
router.post("/login/instructor", async (req, res) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const foundUser = await User.findOne({
    email: req.body.email,
    role: "instructor",
  });
  if (!foundUser) {
    return res.status(401).send("無法找到使用者。請確認信箱與身分是否正確。");
  }

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

//google登入
router.get("/auth/google", (req, res, next) => {
  console.log("收到google請求");
  const role = req.query.role;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", //讓使用者每次都可以選擇想要的google登入
    state: JSON.stringify({ role: role }),
  })(req, res, next);
});

//google導回的頁面
router.get("/auth/google/callback", (req, res, next) => {
  if (req.query.error) {
    // 如果用户取消了操作，则重定向到前端
    return res.redirect("http://localhost:3000/");
  }

  passport.authenticate(
    "google",
    { failureRedirect: "/" },
    async (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/");
      // Generate a JWT for the authenticated user
      const tokenObject = { _id: user._id, email: user.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      const foundUser = await User.findOne({
        email: user.email,
        role: user.role,
      });
      // const userObj = {
      //   _id: user._id,
      //   username: user.username,
      //   email: user.email,
      //   role: user.role,
      //   googleId: user.googleId,
      //   date: user.date,
      // };

      const responseObj = {
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      };
      // 将对象转换为JSON字符串并进行URI编码
      const responseStr = encodeURIComponent(JSON.stringify(responseObj));

      // Redirect to the frontend with the token and user data
      res.redirect(
        `http://localhost:3000/auth/google/callback?data=${responseStr}`
      );
    }
  )(req, res, next);
});
module.exports = router;
