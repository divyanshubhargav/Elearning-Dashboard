//* Packages Imports */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

//* Components Imports */
import Header from "./../components/Header";

//* Utils Imports */
import { getQuizSummary } from "../store/quizSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizSummary, isLoading, isError, message } = useSelector(
    (state) => state.quiz
  );

  useEffect(() => {
    dispatch(getQuizSummary());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container maxWidth={false} sx={{ padding: "0 !important" }}>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth={false} sx={{ padding: "0 !important" }}>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          {message === "User has not participated in any quizzes." ? (
            <Typography variant="h6">User has not enrolled in any course</Typography>
          ) : (
            <Typography variant="h6">Error: {message}</Typography>
          )}
        
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ padding: "0 !important" }}>
      <Header />
      <Box p={{ xs: 2, lg: 4 }}>
        <Typography variant="h4" gutterBottom>
          Active Courses
        </Typography>
        {quizSummary.length === 0 ? (
          <Typography variant="body1">No quizzes attempted yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {quizSummary.map((quiz, index) => {
              const progress =
                (quiz.correctAnswers / quiz.totalQuestions) * 100;

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, p: 1 }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom={2}
                      >
                        <Typography variant="h6" color="primary">
                          {quiz.courseName}
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => navigate(`/courses/${quiz.courseId}`)}
                        >
                          Resume
                        </Button>
                      </Box>

                      <Typography variant="subtitle2" color="textSecondary">
                        Quiz - {quiz.quizTitle}
                      </Typography>

                      <Box display="flex" alignItems="center" mt={2}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            flex: 1,
                            height: 8,
                            maxWidth: "100px",
                            borderRadius: 4,
                            backgroundColor: "#E0E0E0",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#424242",
                            },
                          }}
                        />
                        <Typography variant="body2">{`${Math.round(
                          progress
                        )}%`}</Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          • Marks: {quiz.correctAnswers}/{quiz.totalQuestions}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
