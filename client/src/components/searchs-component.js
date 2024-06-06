import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseService from "../services/course.service";

const SearchsComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState(""); //儲存收尋欄
  let [suggestions, setSuggestions] = useState([]); //儲存收尋欄模糊收尋到的結果
  let [searchResult, setSearchResult] = useState(null);
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  //收尋欄下拉選單
  const handleChangeInput = async (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 1) {
      try {
        CourseService.getCourseByName(searchInput).then((data) => {
          console.log(data.data);
          setSuggestions(data.data);
        });
      } catch (error) {
        console.error("Error fetching course suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 設定點擊下拉選單
  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion.title);
    setSearchResult([suggestion]);
    setSuggestions([]);
  };

  //收尋欄送出
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data.data);
        setSearchResult(data.data);
        setSuggestions([]); // 清空建议列表
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {/* 搜尋課程 */}
      <div className="search input-group mb-3">
        <input
          type="text"
          className="form-control"
          onKeyDown={handleKeyDown}
          onChange={handleChangeInput}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          搜尋課程
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="list-group">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion._id}
              className="list-group-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}

      {searchResult && searchResult.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* <p>這是我們從API返回的數據:</p> */}
          {searchResult.map((course) => {
            return (
              <div
                key={course._id}
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

                  {currentUser && currentUser.user.role == "student" && (
                    <button
                      id={course._id}
                      className="card-text btn btn-primary"
                      onClick={handleEnroll}
                    >
                      註冊課程
                    </button>
                  )}
                  {(!currentUser || currentUser.user.role === "instructor") && (
                    <p style={{ color: "red" }}>需以學生身分登入才能註冊課程</p>
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

export default SearchsComponent;
