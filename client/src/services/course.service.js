import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";
const API_URL_NOTJWT = "http://localhost:8080/api/search";

class CourseService {
  // 創建新課程
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 使用學生id，找到學生註冊的課程
  getEnrolledCourses(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 使用instructor id，來找到講師擁有的課程
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 註冊課程
  enroll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/enroll/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
  // 老師刪除課程(課程id)
  deleCourse(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.delete(API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
  // 學生取消註冊
  Unregister(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.delete(API_URL + "/cancel-enroll/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  //收尋課程(做為修改課程用)
  getCourseById(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  //修改課程
  updateCourse(coursesid, title, description, price) {
    console.log("有傳到修改事服器");
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/editCourse/" + coursesid,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // 以下走http://localhost:8080/api/search
  // 透過搜尋尋找課程
  getCourseByName(name) {
    return axios.get(API_URL_NOTJWT + "/go/" + name, {
      // headers: {
      //   Authorization: token,
      // },
    });
  }

  // 熱門課程
  PopularCourses() {
    // console.log("有進入");
    return axios.get(API_URL_NOTJWT + "/top-courses", {});
  }
}

export default new CourseService();
