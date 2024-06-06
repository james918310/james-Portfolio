import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const [courseData, setCourseData] = useState(null);
  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role == "student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            console.log(data.data);
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

  // 刪除課程
  const deleCourse = (e) => {
    if (!currentUser || currentUser.user.role == "student") {
      window.alert("請先以講師的身分登入");
      navigate("/login/instructor");
    } else {
      const userConfirmed = window.confirm("您确定要取消注册该课程吗？");
      if (!userConfirmed) {
        return; // 如果用户取消操作，直接返回
      }

      CourseService.deleCourse(e.target.id)
        .then(() => {
          window.alert("課程刪除成功!!");
          window.location.reload();
          // navigate("/course");
        })
        .catch((e) => {
          window.alert("發生錯誤");
          console.log(e);
        });
    }
  };

  // 學生取消註冊
  const Unregister = (e) => {
    if (!currentUser || currentUser.user.role == "instructor") {
      window.alert("請先以學生的身分登入");
      navigate("/login/student");
    } else {
      const userConfirmed = window.confirm("您確定要取消課程嗎？");
      if (!userConfirmed) {
        return; // 如果用户取消操作，直接返回
      }

      CourseService.Unregister(e.target.id)
        .then(() => {
          window.alert("課程取消成功");
          window.location.reload();
          // navigate("/course");
        })
        .catch((e) => {
          window.alert("發生錯誤");
          console.log(e);
        });
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面。</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面。</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格: {course.price}
                  </p>
                  {/* 判斷是老師多一個刪除課程 */}
                  {currentUser && currentUser.user.role == "instructor" && (
                    <div>
                      <button
                        id={course._id}
                        className="card-text btn btn-primary"
                        onClick={deleCourse}
                      >
                        刪除課程
                      </button>
                    </div>
                  )}
                  {/* 判斷是學生多一個刪除的課程 */}
                  {currentUser && currentUser.user.role == "student" && (
                    <div>
                      <button
                        id={course._id}
                        className="card-text btn btn-primary"
                        onClick={Unregister}
                      >
                        取消課程
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
