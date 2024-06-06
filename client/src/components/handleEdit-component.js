import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseService from "../services/course.service";

const EditCourseComponent = ({ currentUser }) => {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [coursesid, setcoursesid] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 获取课程详情
    console.log(courseId);
    CourseService.getCourseById(courseId)
      .then((response) => {
        const course = response.data;
        console.log(course);
        setTitle(course.title);
        setDescription(course.description);
        setPrice(course.price);
        setcoursesid(course._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [courseId]);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  //更新課程
  const handleUpdateCourse = () => {
    CourseService.updateCourse(courseId, title, description, price)
      .then(() => {
        window.alert("課程已更新成功");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>在更新課程之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/login")}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <p>只有講師可以更新課程。</p>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div className="form-group">
          <label htmlFor="exampleforTitle">課程標題：</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            value={title}
            onChange={handleChangeTitle}
          />
          <br />
          <label htmlFor="exampleforContent">內容：</label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="content"
            value={description}
            onChange={handleChangeDesciption}
          />
          <br />
          <label htmlFor="exampleforPrice">價格：</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            value={price}
            onChange={handleChangePrice}
          />
          <br />
          <button className="btn btn-primary" onClick={handleUpdateCourse}>
            更新課程
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditCourseComponent;
