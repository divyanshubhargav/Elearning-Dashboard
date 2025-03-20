using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CourseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get All Courses
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCourses(int userId)
        {
            try
            {
                var courses = await _context.Courses
                 .Select(course => new
                 {
                     course.Id,
                     course.Title,
                     course.Description,
                     course.CreatedAt,
                     Enrolled = _context.Enrollments.Any(e => e.UserId == userId && e.CourseId == course.Id)
                 })
                 .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch courses", error = ex.Message });
            }
        }

        // Get Course Details by ID
        [HttpGet("{courseId}/details/{userId}")]
        public async Task<IActionResult> GetCourseDetails(int courseId, int userId)
        {
            try
            {
                var course = await _context.Courses
                    .Select(c => new
                    {
                        c.Id,
                        c.Title,
                        c.Description,
                        c.CreatedAt,
                        Enrolled = _context.Enrollments.Any(e => e.UserId == userId && e.CourseId == c.Id)
                    })
                    .FirstOrDefaultAsync(c => c.Id == courseId);

                if (course == null)
                    return NotFound(new { message = "Course not found" });

                return Ok(course);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch course details", error = ex.Message });
            }
        }

        // Enroll in Course
        [HttpPost("{courseId}/enroll/{userId}")]
        public async Task<IActionResult> Enroll(int courseId, int userId)
        {
            try
            {
                if (userId <= 0)
                    return Unauthorized(new { message = "Invalid user ID" });

                var existingCourse = await _context.Courses.FindAsync(courseId);
                if (existingCourse == null)
                    return NotFound(new { message = "Course not found" });

                // Check if user is already enrolled
                var existingEnrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

                if (existingEnrollment != null)
                    return Conflict(new { message = "User already enrolled in this course" });

                var enrollment = new Enrollment
                {
                    UserId = userId,
                    CourseId = courseId,
                    Progress = 0
                };

                _context.Enrollments.Add(enrollment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Enrollment successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to enroll in course", error = ex.Message });
            }
        }

        // Get All Questions for a Course along with Quiz Title
        [HttpGet("{courseId}/questions")]
        public async Task<IActionResult> GetQuestionsByCourse(int courseId)
        {
            try
            {
                var quiz = await _context.Quizzes
                    .Where(q => q.CourseId == courseId)
                    .Select(q => new
                    {
                        q.Id,
                        QuizTitle = q.Title,
                        Questions = _context.Questions
                            .Where(qst => qst.QuizId == q.Id)
                            .Select(qst => new
                            {
                                qst.Id,
                                qst.QuestionText,
                                qst.OptionA,
                                qst.OptionB,
                                qst.CorrectAnswer
                            }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (quiz == null)
                    return NotFound(new { message = "No quiz found for this course" });

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch questions", error = ex.Message });
            }
        }

    }
}
