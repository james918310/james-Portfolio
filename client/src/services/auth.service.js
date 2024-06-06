import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/user/";

class AuthService {
  //學生與講師登入
  login(email, password, roleUrl) {
    console.log(API_URL + roleUrl);
    return axios.post(API_URL + "login" + roleUrl, { email, password });
  }

  //登出;
  logout() {
    localStorage.removeItem("user");
  }

  //學生註冊
  register(username, email, password) {
    return axios.post(API_URL + "/register/student", {
      username,
      email,
      password,
    });
  }

  //老師註冊
  register(username, email, password) {
    return axios.post(API_URL + "/register/instructor", {
      username,
      email,
      password,
    });
  }

  //確認有無登入
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  // google講師或學生登入系統
  // googleLogin(role) {
  //   return axios.post(`${API_URL}auth/google?role=${role}`);
  // }
}

export default new AuthService();
