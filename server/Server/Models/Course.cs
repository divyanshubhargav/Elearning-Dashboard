using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
