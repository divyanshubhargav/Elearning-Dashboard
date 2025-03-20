//* Packages Imports */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* Utils Imports */
import {
  enrollUserCourse,
  fetchAllCourses,
  fetchSingleCourseDetail,
  fetchQuizQuestionsByCourse,
} from "../services/courseService";

const initialState = {
  courses: [],
  courseDetails: null,
  quiz: null,
  isLoading: false,
  isError: false,
  message: "",
};

//* Fetch Courses
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllCourses();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//* Fetch Course Details
export const fetchCourseDetails = createAsyncThunk(
  "course/fetchCourseDetails",
  async (courseId, thunkAPI) => {
    try {
      const response = await fetchSingleCourseDetail(courseId);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//* Enroll in Course
export const enrollCourse = createAsyncThunk(
  "course/enrollCourse",
  async (courseId, thunkAPI) => {
    try {
      const response = await enrollUserCourse(courseId);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//* Fetch Quiz Questions
export const fetchQuiz = createAsyncThunk(
  "course/fetchQuiz",
  async (courseId, thunkAPI) => {
    try {
      const response = await fetchQuizQuestionsByCourse(courseId);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      //* Fetch Courses Handling
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //* Fetch Course Details Handling
      .addCase(fetchCourseDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseDetails = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //* Enroll Course Handling
      .addCase(enrollCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Enrolled successfully!";

        if (state.courseDetails && state.courseDetails.id === action.payload.courseId) {
          state.courseDetails.enrolled = true;
        }

        state.courses = state.courses.map((course) =>
          course.id === action.payload.courseId
            ? { ...course, enrolled: true }
            : course
        );
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //* Fetch Quiz Handling
      .addCase(fetchQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;
