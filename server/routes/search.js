const router = require("express").Router();
const Course = require("../models").course;

router.use((req, res, next) => {
  console.log("search正在接受一個request...");
  next();
});
// 用課程名稱尋找課程
router.get("/go/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: new RegExp(name, "i") })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(5000).send(e);
  }
});

// 熱門課程搜尋
router.get("/top-courses", async (req, res) => {
  // console.log("熱門課程");
  try {
    let topCourses = await Course.find({})
      .sort({ students: -1 }) // 按照学生人数降序排序
      .limit(5) // 只获取前5个课程
      .populate("instructor", ["username", "email"]) // 关联 instructor 信息
      .exec();

    return res.send(topCourses);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
