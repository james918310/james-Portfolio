import { useState, useEffect } from "react";
import AuthServer from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/register");
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

  //修改課程
  const handleEditCourse = (courseId) => {
    // console.log(courseId);
    navigate(`/editCourse/${courseId}`);
  };

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
      {!currentUser && <div>在獲取您的個人資料之前，您必須先登錄。</div>}
      {currentUser && (
        <div>
          <h2>以下是您的個人檔案：</h2>

          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>姓名：{currentUser.user.username}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您的用戶ID: {currentUser.user._id}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您註冊的電子信箱: {currentUser.user.email}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>身份: {currentUser.user.role}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* 目前課程的資料 */}
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
            <h1>{currentUser.user.username}講師目前上傳的課程。</h1>
          </div>
        )}
        {currentUser &&
          currentUser.user.role === "instructor" &&
          courseData?.length === 0 && (
            <div>
              <p>{currentUser.user.username}講師馬開始上傳課程吧</p>
            </div>
          )}
        {currentUser && currentUser.user.role == "student" && (
          <div>
            <h1>{currentUser.user.username}同學目前註冊的課程。</h1>
          </div>
        )}
        {currentUser &&
          currentUser.user.role === "student" &&
          courseData?.length === 0 && (
            <div>
              <p>{currentUser.user.username}同學馬上開始註冊課程吧</p>
            </div>
          )}

        {currentUser && courseData && courseData.length != 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {courseData.map((course) => {
              return (
                <div
                  className="card"
                  style={{ width: "18rem", margin: "1rem" }}
                >
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
                    <p style={{ margin: "0.5rem 0rem" }}>
                      講師: {course.instructor.username}
                    </p>
                    {/* 判斷是老師多一個刪除課程 */}
                    {currentUser && currentUser.user.role == "instructor" && (
                      <div>
                        <button
                          id={course._id}
                          className="card-text btn btn-primary"
                          onClick={() => handleEditCourse(course._id)}
                        >
                          修改課程
                        </button>
                        <button
                          style={{ margin: "1rem 2rem" }}
                          id={course._id}
                          className="card-text btn btn-danger"
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
    </div>
  );
};

export default ProfileComponent;
