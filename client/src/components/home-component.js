import React from "react";
import { Link } from "react-router-dom";

const HomeComponent = () => {
  return (
    <main style={{ padding: "4rem 0" }}>
      <div className="container py-4">
        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>作為一個學生</h2>
              <p>
                學生可以註冊他們喜歡的課程。本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <Link className="btn btn-outline-light" to="/login/student">
                登錄會員、或者註冊一個帳號
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>作為一個導師</h2>
              <p>
                您可以通過註冊成為一名講師，並開始製作在線課程。本網站僅供練習之用，請勿提供任何個人資料，例如信用卡號碼。
              </p>
              <Link
                className="btn btn-outline-secondary"
                to="/login/instructor"
              >
                今天開始開設課程
              </Link>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2024 jaeme Wu
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
