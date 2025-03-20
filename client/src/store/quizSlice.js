//* Packages Imports */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

//* Utils Imports */
import { submitResponses, fetchQuizSummary } from "../services/quizService";

//* Get userId from Cookies
const userId = Cookies.get("userId");

const initialState = {
  responses: [],
  quizSummary: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

//* Submit Responses
export const submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async (responses, thunkAPI) => {
    try {
      return await submitResponses(userId, responses);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//* Fetch Quiz Summary
export const getQuizSummary = createAsyncThunk(
  "quiz/getQuizSummary",
  async (_, thunkAPI) => {
    try {
      return await fetchQuizSummary(userId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    resetQuiz: (state) => {
      state.responses = [];
      state.quizSummary = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitQuiz.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getQuizSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuizSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.quizSummary = action.payload;
      })
      .addCase(getQuizSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
