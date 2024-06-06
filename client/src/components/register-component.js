import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const RegisterComponent = ({ role, roleUrl }) => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  // let [role, setRole] = useState("");
  let [message, setMessage] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  // const handleRole = (e) => {
  //   setRole(e.target.value);
  // };

  const handleRegister = () => {
    AuthService.register(username, email, password)
      .then(() => {
        window.alert("註冊成功。您現在將被導向到登入頁面");
        navigate(`/login${roleUrl}`);
      })
      .catch((e) => {
        setMessage(e.response.data);
        // 设置消息在5秒后消失
        // setTimeout(() => {
        //   setTimeout("");
        // }, 5000);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <h2>{role}註冊系統</h2>
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
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
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />

        <button onClick={handleRegister} className="btn btn-primary">
          <span>註冊{role}會員</span>
        </button>
      </div>
      <br />
      <div>
        <Link to={`/login${roleUrl}`} style={{ paddingTop: "2rem" }}>
          登入
        </Link>
      </div>
    </div>
  );
};

export default RegisterComponent;
