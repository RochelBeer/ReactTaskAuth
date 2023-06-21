using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactRealTimeTasks67.Data
{
    public class TaskRepository
    {
        private readonly string _connectionString;
        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public List<TaskItem> GetTasks()
        {
            using var context = new DataContext(_connectionString);
            return context.TaskItems.Include(t=> t.User).ToList();
        }
        public void AddTask(TaskItem task)
        {
            using var context = new DataContext(_connectionString);
            context.TaskItems.Add(task);
            context.SaveChanges();
        }
        public void UpdateTask(int taskId, int userId)
        {
            using var context = new DataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"Update TaskItems Set UserId = {userId} Where id = {taskId}");
        }
        public void DeleteTask(int taskId, int userId)
        {
            using var context = new DataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"Delete from TaskItems Where id = {taskId} And UserId = {userId}");
        }
    }
}
