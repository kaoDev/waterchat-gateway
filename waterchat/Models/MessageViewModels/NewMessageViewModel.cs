using System.ComponentModel.DataAnnotations;

namespace waterchat.Models
{
    public class NewMessageViewModel
    {
        [Required]
        public string Content { get; set; }
    }
}
