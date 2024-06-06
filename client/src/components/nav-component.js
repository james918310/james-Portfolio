import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import icon1 from "../images/icon1.png";
import search from "../images/search.png";
import login from "../images/login.png";
import information from "../images/information.png";
import signout from "../images/SignOut.png";
import newcourses from "../images/newCourses.png";
import homes from "../images/home.png";
const NavComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/"); // 在这里替换为你的主页路径
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("確定要登出嗎");
    if (confirmLogout) {
      // 执行登出逻辑
      // 例如清除本地存储的用户信息、清除 session、跳转到登出页面等
      // 这里只是简单示例，你需要根据具体情况实现
      AuthService.logout();
      window.alert("登出成功!現在您會被導向到首頁。");
      setCurrentUser(null);
      handleLogoClick();
    }
  };

  return (
    <div className=" header-nav1">
      <header>
        <section class="logo" onClick={handleLogoClick}>
          <img src={icon1} alt="logo" className="logo" />
          <h1>線上學習網</h1>
        </section>

        <nav className="nav-fornt">
          <ul>
            <li className="anav-fornt">
              <Link className="lnav-fornt" to="/">
                <img src={homes} alt="login" className="icon-hender" /> 首頁
              </Link>
            </li>
            {!currentUser && (
              <li className="anav-fornt">
                <Link className="lnav-fornt" to="/register">
                  <img src={login} alt="login" className="icon-hender" />{" "}
                  登入會員
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="anav-fornt">
                <Link className="lnav-fornt" to="/profile">
                  <img
                    src={information}
                    alt="loinformationgin"
                    className="icon-hender"
                  />{" "}
                  個人頁面
                </Link>
              </li>
            )}

            <li className="anav-fornt">
              <Link className="lnav-fornt" to="/search">
                <img src={search} alt="search" className="icon-hender" />{" "}
                課程搜尋
              </Link>
            </li>

            {currentUser && currentUser.user.role == "instructor" && (
              <li className="anav-fornt">
                <Link className="lnav-fornt" to="/postCourse">
                  <img
                    src={newcourses}
                    alt="newcourses"
                    className="icon-hender"
                  />{" "}
                  新增課程
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="anav-fornt">
                <button className="lnav-fornt" onClick={handleLogout}>
                  <img src={signout} alt="signout" className="icon-hender" />{" "}
                  登出
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NavComponent;
