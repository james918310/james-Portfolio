const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});

// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(5000).send(e);
  }
});

// 用講師id來尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 用學生id來尋找註冊過的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發佈新課程。若你已經是講師，請透過講師帳號登入。");
  }

  let { title, description, price } = req.body;
  try {
    //判斷同一個老師是否存有相同標題的課程
    let existingCourse = await Course.findOne({
      title,
      instructor: req.user._id,
    });

    if (existingCourse) {
      return res.status(400).send("你已创建相同的课程，请重新命名。");
    }
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send("新課程已經保存");
  } catch (e) {
    return res.status(500).send("無法創建課程。。。");
  }
});

// 讓學生透過搜尋 來註冊新課程
router.get("/enroll/:_id", async (req, res) => {
  if (req.user.isIsntructor()) {
    return res
      .status(400)
      .send("只有學生才能註冊課程。若你已經是學生，請透過學生帳號登入。");
  }
  console.log("有進到學生註冊頁面");
  let { _id } = req.params;
  let course = await Course.findOne({ _id }).exec();
  console.log(course);
  try {
    // 检查学生是否已注册该课程
    console.log("req.user._id裡的" + req.user._id);
    console.log(course.students);
    if (course.students.includes(req.user._id)) {
      return res.status(404).send("你已註冊過了");
    } else {
      course.students.push(req.user._id);
      await course.save();
      return res.send("註冊完成");
    }
  } catch (e) {
    return res.send(e);
  }
});

// 更改課程
router.patch("/editCourse/:coursesid", async (req, res) => {
  console.log("有傳到後端修改事服器");
  // 驗證數據符合規範
  console.log(req.body);
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { coursesid } = req.params;
  console.log(coursesid);
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id: coursesid });
    console.log("找到課程的資訊" + courseFound);
    console.log("老師的id為" + req.user._id);
    if (!courseFound) {
      return res.status(400).send("找不到課程。無法更新課程內容。");
    }
    // 使用者必須是此課程講師，才能編輯課程
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate(
        { _id: coursesid },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.send({
        message: "課程已經被更新成功",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程。");
    }
  } catch (e) {
    return res.status(501).send(e);
  }
});

// 講師刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程。無法刪除課程。");
    }

    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除。");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

//學生取消註冊
router.delete("/cancel-enroll/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const course = await Course.findById(_id);
    if (!course) {
      return res.status(404).send("未找到課程");
    }

    // 检查学生是否已注册该课程
    const studentIndex = course.students.indexOf(req.user._id.toString());
    if (studentIndex === -1) {
      return res.status(400).send("您未注册该课程");
    }
    // indexof會對資料庫裡的array作對比，如果没有找到匹配的元素，indexOf 会返回 -1。

    // 从 students 数组中移除学生 ID
    console.log("studentIndex:" + studentIndex);
    course.students.splice(studentIndex, 1);
    await course.save();

    return res.send("取消注册成功");
  } catch (error) {
    return res.status(500).send("服务器错误");
  }
});

module.exports = router;
