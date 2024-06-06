import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import AuthService from "./services/auth.service";
import CourseComponent from "./components/course-component";
import PostCourseComponent from "./components/postCourse-component";
import GoogleRedirectHandler from "./components/GoogleRedirectHandler";
import SearchsComponent from "./components/searchs-component";
import FronComponent from "./components/fron-component";
import EditCourseComponent from "./components/handleEdit-component";
import "./styles/app.css";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route
            index
            element={
              <FronComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="auth/google/callback"
            element={
              <GoogleRedirectHandler
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route path="register" element={<HomeComponent />} />
          <Route
            path="login/student"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                role="學生"
                enrole="student"
                roleUrl="/student"
              />
            }
          />
          <Route
            path="login/instructor"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                role="講師"
                enrole="instructor"
                roleUrl="/instructor"
              />
            }
          />
          <Route
            path="register/student"
            element={
              <RegisterComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                role="學生"
                roleUrl="/student"
              />
            }
          />
          <Route
            path="register/instructor"
            element={
              <RegisterComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                role="講師"
                roleUrl="/instructor"
              />
            }
          />
          <Route
            path="profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="search"
            element={
              <SearchsComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="postCourse"
            element={
              <PostCourseComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="editCourse/:courseId"
            element={
              <EditCourseComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
