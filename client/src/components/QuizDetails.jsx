//* Packages Imports */
import Cookies from "js-cookie";
import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

//* Utils Imports */
import { fetchQuiz } from "../store/courseSlice";
import { submitQuiz, resetQuiz } from "../store/quizSlice";

const QuizDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { quiz } = useSelector((state) => state.course);

  const {
    isLoading: isSubmitting,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.quiz);

  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const userId = Cookies.get("userId");

  //* Handle option selection
  const handleSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  //* Submit quiz
  const handleSubmit = () => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const newFeedback = {};
    quiz.questions.forEach((q) => {
      newFeedback[q.id] =
        answers[q.id] === q.correctAnswer ? "correct" : "incorrect";
    });
    setFeedback(newFeedback);

    const responses = Object.keys(answers).map((questionId) => ({
      questionId: parseInt(questionId),
      selectedAnswer: answers[questionId],
    }));

    dispatch(submitQuiz(responses));
    setQuizSubmitted(true);
  };

  //* Retry quiz
  const handleRetry = () => {
    setAnswers({});
    setFeedback({});
    setQuizSubmitted(false);
    dispatch(resetQuiz());
  };

  //* Fetch quiz if enrolled
  useEffect(() => {
    dispatch(fetchQuiz(courseId));
  }, [dispatch, courseId]);

  return (
    <>
      {quiz?.questions && (
        <Card style={{ marginTop: "20px", minHeight: "200px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quiz: {quiz.quizTitle}
            </Typography>
            <Divider />
            <List>
              {quiz.questions.map((q, index) => (
                <Fragment key={index}>
                  <FormControl
                    component="fieldset"
                    key={q.id}
                    style={{ marginBottom: "20px", width: "100%" }}
                  >
                    <Typography variant="p">
                      {index + 1}. {q.questionText}
                    </Typography>

                    <RadioGroup
                      value={answers[q.id] || ""}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                    >
                      <FormControlLabel
                        value={q.optionA}
                        control={<Radio />}
                        label={q.optionA}
                      />
                      <FormControlLabel
                        value={q.optionB}
                        control={<Radio />}
                        label={q.optionB}
                      />
                    </RadioGroup>

                    {/* Display Feedback */}
                    {feedback[q.id] && (
                      <Typography
                        variant="body1"
                        style={{
                          color: feedback[q.id] === "correct" ? "green" : "red",
                          marginTop: "5px",
                        }}
                      >
                        {feedback[q.id] === "correct"
                          ? "✔ Correct Answer!"
                          : "✖ Incorrect Answer!"}
                      </Typography>
                    )}
                  </FormControl>
                </Fragment>
              ))}
            </List>

            {/* Submission & Retry Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || quizSubmitted}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>

              {quizSubmitted && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleRetry}
                >
                  Retry Quiz
                </Button>
              )}
            </Box>

            {/* Display Success/Error Message */}
            {isSuccess && quizSubmitted && (
              <Typography variant="body1" style={{ color: "green", marginTop: "20px" }}>
                🎉 Quiz Submitted Successfully!
              </Typography>
            )}
            {isError && (
              <Typography variant="body1" style={{ color: "red", marginTop: "20px" }}>
                ❌ Error: {message}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default QuizDetails;
