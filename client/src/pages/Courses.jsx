//* Packages Imports */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

//* Components Imports */
import Header from "./../components/Header";

//* Utils Imports */
import { fetchCourses, enrollCourse } from "../store/courseSlice";

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.course
  );

  const handleEnroll = async (courseId) => {
    await dispatch(enrollCourse(courseId)).unwrap();
    dispatch(fetchCourses());
  };

  useEffect(() => {
    dispatch(fetchCourses());
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
          <Typography variant="h6">Error: {message}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ padding: "0 !important" }}>
      <Header />
      <Box p={{ xs: 2, lg: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Courses
        </Typography>
        <Grid container spacing={2}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minHeight: 165,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Link
                    to={`/courses/${course.id}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                  </Link>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {`${course.description.slice(0, 100)}...`}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginTop: "10px" }}
                    disabled={course.enrolled}
                    onClick={() => handleEnroll(course.id)}
                  >
                    {course.enrolled ? "Enrolled" : "Enroll"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Courses;
