import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = ({
  currentUser,
  setCurrentUser,
  role,
  roleUrl,
  enrole,
}) => {
  const nagivate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // 按下登入頁面
  const handleLogin = async () => {
    try {
      let response = await AuthService.login(email, password, roleUrl);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功。您現在將被重新導向到個人資料頁面。");
      setCurrentUser(AuthService.getCurrentUser());
      nagivate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  // 按下google登入
  const handleClick = () => {
    console.log("Google Button Clicked");
    // 重定向到 Google 登录 URL，并传递角色信息
    window.location.href = `http://localhost:8080/api/user/auth/google?role=${enrole}`;
  };

  //當google身分認證後調回來的值
  // useEffect(() => {}, [setCurrentUser]);

  return (
    <div style={{ padding: "2rem" }} className="col-md-12">
      <h2>{role}登入系統</h2>
      <br />
      <div>
        {/* google登入按鈕 */}
        <div ass="col-md-12">
          <button
            className="btn btn-lg btn-google"
            style={{
              padding: "0.2rem 0.5rem",
              backgroundColor: "rgb(7, 7, 7)",
              color: "rgb(255, 255, 255)",
            }}
            onClick={handleClick}
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
            />
            google登入
          </button>
        </div>
      </div>
      <br />
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>{role}登入</span>
          </button>
        </div>
        <br />
        <div>
          <Link to={`/register${roleUrl}`}>註冊會員</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
