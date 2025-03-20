using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Check if user already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (existingUser != null)
                    return Conflict(new { message = "Email is already registered" });

                var newUser = new User
                {
                    Name = model.Name,
                    Email = model.Email,
                    PasswordHash = model.Password
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully!" });
            }
            catch (Exception ex)
            {
                // Handle unexpected server errors
                return StatusCode(500, new { message = "An error occurred while processing the request", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser == null)
                return Unauthorized(new { message = "User not found" });

            // Check if password matches
            if (model.Password != existingUser.PasswordHash)
                return Unauthorized(new { message = "Invalid password" });

            // Generate JWT token
            var token = GenerateJwtToken(existingUser);

            return Ok(new { message = "Login successful",  token, userId = existingUser.Id });
        }

        [HttpPost("responses/{userId}")]
        public async Task<IActionResult> SubmitResponses(int userId, [FromBody] List<ResponseModel> responses)
        {
            if (responses == null || responses.Count == 0)
            {
                return BadRequest(new { message = "No responses provided." });
            }

            try
            {
                foreach (var response in responses)
                {
                    var existingResponse = await _context.Responses
                        .FirstOrDefaultAsync(r => r.UserId == userId && r.QuestionId == response.QuestionId);

                    if (existingResponse != null)
                    {
                        // Update existing response
                        existingResponse.SelectedAnswer = response.SelectedAnswer;
                        _context.Responses.Update(existingResponse);
                    }
                    else
                    {
                        // Create new response
                        var newResponse = new Response
                        {
                            UserId = userId,
                            QuestionId = response.QuestionId,
                            SelectedAnswer = response.SelectedAnswer
                        };
                        _context.Responses.Add(newResponse);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Responses saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request", error = ex.Message });
            }
        }

        [HttpGet("{userId}/quiz-summary")]
        public async Task<IActionResult> GetUserQuizSummary(int userId)
        {
            // Get distinct quiz IDs where the user has submitted responses
            var userQuizIds = await _context.Responses
                .Where(r => r.UserId == userId)
                .Join(
                    _context.Questions,
                    response => response.QuestionId,
                    question => question.Id,
                    (response, question) => question.QuizId
                )
                .Distinct()
                .ToListAsync();

            if (userQuizIds.Count == 0)
            {
                return NotFound(new { message = "User has not participated in any quizzes." });
            }

            var result = new List<object>();

            foreach (var quizId in userQuizIds)
            {
                var quiz = await _context.Quizzes.FindAsync(quizId);
                if (quiz == null) continue;

                var course = await _context.Courses.FindAsync(quiz.CourseId);
                if (course == null) continue;

                // Get total number of questions in this quiz
                var totalQuestions = await _context.Questions
                    .CountAsync(q => q.QuizId == quiz.Id);

                // Get total correct answers by the user in this quiz
                var correctAnswers = await _context.Responses
                    .Where(r => r.UserId == userId)
                    .Join(
                        _context.Questions,
                        response => response.QuestionId,
                        question => question.Id,
                        (response, question) => new { response, question }
                    )
                    .Where(joined => joined.response.SelectedAnswer == joined.question.CorrectAnswer && joined.question.QuizId == quiz.Id)
                    .CountAsync();

                result.Add(new
                {
                    CourseId = course.Id,
                    CourseName = course.Title,
                    QuizTitle = quiz.Title,
                    TotalQuestions = totalQuestions,
                    CorrectAnswers = correctAnswers
                });
            }

            return Ok(result);
        }

        public class ResponseModel
        {
            public int QuestionId { get; set; }
            public string SelectedAnswer { get; set; } = null!;
        }

        private static string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes("YOUR_SECRET_KEY_SHOULD_BE_AT_LEAST_32_CHARACTERS_LONG");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.Id.ToString()),
                new Claim("name", user.Name)
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "http://localhost:7133",
                audience: "http://localhost:7133",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60), // 1-hour expiry
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
