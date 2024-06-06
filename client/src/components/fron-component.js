import React, { useEffect, useState } from "react";
import CourseService from "../services/course.service";
import imge1 from "../images/主頁照片1.jpg"; // 导入图片
import imge2 from "../images/主頁照片2.jpg";
import imge3 from "../images/主頁照片3.jpg";
import imge4 from "../images/主頁照片4.jpg";
import imge5 from "../images/主頁照片5.jpg";
import { useNavigate } from "react-router-dom";

const FronComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  // 使用 useState 定义状态：backgrounds 是一个包含背景图片路径的数组，currentBackgroundIndex 是当前背景图片的索引
  const [backgrounds, setBackgrounds] = useState([
    imge1, // 使用导入的图片变量
    imge2, // 使用导入的图片变量
    imge3, // 使用导入的图片变量
    imge4, // 使用导入的图片变量
    imge5, // 使用导入的图片变量
  ]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const currentBackground = backgrounds[currentBackgroundIndex];

  // 熱門課程服務器調資料
  const [topCourses, setTopCourses] = useState([]);

  // 使用 useEffect 创建定时器，在组件挂载后每隔3秒更新当前背景图片的索引，并在组件卸载前清除定时器
  useEffect(() => {
    const backgroundSliderInterval = setInterval(() => {
      setCurrentBackgroundIndex(
        (prevIndex) => (prevIndex + 1) % backgrounds.length
      );
    }, 3000);

    return () => clearInterval(backgroundSliderInterval);
  }, [backgrounds]);

  // 获取当前背景图片路径

  // 註冊課程
  const handleEnroll = (e) => {
    if (!currentUser) {
      window.alert("請先以學生身分登入");
      navigate("/login/student");
    } else {
      CourseService.enroll(e.target.id)
        .then(() => {
          window.alert("課程註冊成功!!");
        })
        .catch((e) => {
          window.alert("你已註冊過");
          console.log(e);
        });
    }
  };

  useEffect(() => {
    CourseService.PopularCourses()
      .then((response) => {
        setTopCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top courses:", error);
      });
  }, []);

  // 返回一个带有背景图片的 section 元素
  return (
    <div>
      <section
        className="background-img"
        style={{ backgroundImage: `url(${currentBackground})` }}
      >
        {/* 在此添加背景滑块区域内的任何内容 */}
      </section>
      <h1 className="background-text1"> 現在就開始為自己增加競爭力吧</h1>
      <div className="top-courses-container">
        <h2>熱門課程</h2>
        <div className="top-courses">
          {topCourses.map((course) => (
            <div key={course._id} className="card">
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>學生人數: {course.students.length}</p>
                <p>課程價格: {course.price}</p>
                <p>講師: {course.instructor.username}</p>
                {currentUser && currentUser.user.role == "student" && (
                  <button
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FronComponent;
