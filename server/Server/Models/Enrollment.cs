using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Enrollment
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Course")]
        public int CourseId { get; set; }

        public double Progress { get; set; }

        //public User? User { get; set; }
        //public Course? Course { get; set; }
    }
}
