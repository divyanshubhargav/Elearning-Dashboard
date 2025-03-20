using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Quiz")]
        public int QuizId { get; set; }

        [Required]
        public string QuestionText { get; set; } = null!;

        [Required]
        public required string OptionA { get; set; }

        [Required]
        public required string OptionB { get; set; }

        [Required]
        public required string CorrectAnswer { get; set; }
    }
}
