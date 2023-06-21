using ReactRealTimeTasks67.Data;

namespace ReactRealTimeTasks67.Web.Models
{
    public class SignupViewModel:User
    {
        public User User { get; set; }
        public string Password { get; set; }
    }
}
