using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ReactRealTimeTasks67.Data;
using ReactRealTimeTasks67.Web.Models;
using System.Threading.Tasks;

namespace ReactRealTimeTasks67.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly string _connectionString;
        private IHubContext<TaskHub> _hub;
        public TaskController(IConfiguration configuration, IHubContext<TaskHub> hub)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
            _hub = hub;
        }
        [HttpGet]
        [Route("gettasks")]
        public List<TaskItem> GetTasks()
        {
            TaskRepository repo = new(_connectionString);
            return repo.GetTasks();
        }
        [HttpPost]
        [Route("addtask")]
        public void AddTask(TaskItem task)
        {
            TaskRepository repo = new(_connectionString);
            repo.AddTask(task);
            _hub.Clients.All.SendAsync("newTask", task);
        }     
        [HttpPost]
        [Route("updatetask")]
        public void UpdateTask(UpdateViewModel taskId)
        {
            TaskRepository taskRepo = new(_connectionString);
            Repository repo = new(_connectionString);
            var user = repo.GetUserByEmail(User.Identity.Name);
            taskRepo.UpdateTask(taskId.TaskId, user.Id);            
            _hub.Clients.All.SendAsync("updateTaskForAll", taskRepo.GetTasks());
        }
        [HttpPost]
        [Route("deletetask")]
        public void DeleteTask(UpdateViewModel taskId)
        {
            TaskRepository taskRepo = new(_connectionString);
            Repository repo = new(_connectionString);
            var user = repo.GetUserByEmail(User.Identity.Name);
            taskRepo.DeleteTask(taskId.TaskId, user.Id);
            _hub.Clients.All.SendAsync("deleteTaskFromAll", taskId.TaskId);
        }
    }
}
