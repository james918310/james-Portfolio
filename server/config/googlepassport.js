const passport = require("passport");
const GooglesStratage = require("passport-google-oauth20");
const User = require("../models").user;

passport.use(
  new GooglesStratage(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/user/auth/google/callback",
      passReqToCallback: true, // 将请求对象传递给回调函数
    },
    async (req, token, tokenSecret, profile, done) => {
      try {
        const state = JSON.parse(req.query.state);
        const role = state.role; // 获取传递过来的角色信息
        let user = await User.findOne({ googleId: profile.id, role: role });
        console.log(user);
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            role: role, // 将角色信息存储到数据库
            googleId: profile.id,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        console.log("除存有錯誤");
        console.log(err);
        return done(err, false);
      }
    }
  )
);
