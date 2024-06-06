//

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import AuthService from "../services/auth.service";

const GoogleRedirectHandler = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 解析查詢參數中的用戶數據
    const queryParams = queryString.parse(location.search);
    const { data: dataStr } = queryParams;
    // console.log("queryParas資料" + message + token);
    if (dataStr) {
      try {
        const responseObj = JSON.parse(decodeURIComponent(dataStr));
        localStorage.setItem("user", JSON.stringify(responseObj));
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/profile");
        // window.alert("登入成功。您現在將被重新導向到個人資料頁面。");
      } catch (e) {
        console.log(e.response.data);
        setMessage(e.response.data);
      }
    }
  }, [location.search]);

  return <div>处理登录...</div>;
};

export default GoogleRedirectHandler;
