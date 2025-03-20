//* Packages Imports */
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://localhost:7133/api/auth";

//* Submit Quiz Responses
export const submitResponses = async (userId, responses) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.post(`${API_URL}/responses/${userId}`, responses, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting responses:", error);
    throw error;
  }
};

//* Fetch Quiz Summary
export const fetchQuizSummary = async (userId) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.get(`${API_URL}/${userId}/quiz-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching quiz summary:", error);
    throw error;
  }
};

