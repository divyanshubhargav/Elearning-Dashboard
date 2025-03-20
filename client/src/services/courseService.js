//* Packages Imports */
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://localhost:7133/api/courses";

//* Fetch all courses
export const fetchAllCourses = async () => {
  const userId =  Cookies.get("userId");
  try {
    const response = await axios.get(`${API_URL}/${userId}`,  {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

//* Fetch course details
export const fetchSingleCourseDetail = async (courseId) => {
  const userId = Cookies.get("userId");
  try {
    const response = await axios.get(`${API_URL}/${courseId}/details/${userId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching course details for ID ${courseId}:`, error);
    throw error;
  }
};


//* Enroll in a course
export const enrollUserCourse = async (courseId) => {
  try {
    const userId =  Cookies.get("userId");
    const response = await axios.post(`${API_URL}/${courseId}/enroll/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error enrolling in course ID ${courseId}: ${error}`
    );
    throw error;
  }
};

//* Fetch Quiz Questions for a Course
export const fetchQuizQuestionsByCourse = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/${courseId}/questions`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching quiz questions for course ID ${courseId}:`, error);
    throw error;
  }
};

