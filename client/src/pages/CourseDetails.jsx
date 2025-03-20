//* Packages Imports */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

//* Components Imports */
import Header from "./../components/Header";
import QuizDetails from "./../components/QuizDetails";

//* Utils Imports */
import { fetchCourseDetails, enrollCourse } from "../store/courseSlice";

const CourseDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courseDetails } = useSelector((state) => state.course);

  //* Handle enrollment
  const handleEnroll = () => {
    dispatch(enrollCourse(courseId));
  };

  //* Fetch course details
  useEffect(() => {
    dispatch(fetchCourseDetails(courseId));
  }, [dispatch, courseId]);

  if (!courseDetails) {
    return (
      <Container maxWidth={false} sx={{ padding: "0 !important" }}>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ padding: "0 !important" }}>
      <Header />
      <Box p={{ xs: 2, lg: 4 }}>
        <Card style={{ minHeight: "200px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {courseDetails.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {courseDetails.description}
            </Typography>
            {courseDetails.enrolled ? (
              <Button variant="contained" color="success" disabled>
                Already Enrolled
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnroll}
              >
                Enroll
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Show Quiz if User is Enrolled */}
        {courseDetails.enrolled && <QuizDetails />}
      </Box>
    </Container>
  );
};

export default CourseDetails;
