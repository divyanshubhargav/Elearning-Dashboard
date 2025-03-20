//* Packages Imports */
import { configureStore } from "@reduxjs/toolkit";

//* Utils Imports */
import authReducer from "./authSlice";
import courseReducer from "./courseSlice";
import quizReducer from "./quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    quiz: quizReducer,
  },
});
