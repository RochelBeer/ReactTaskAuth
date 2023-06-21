
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text.Json.Serialization;

namespace ReactRealTimeTasks67.Web
{
    public class Program
    {
        private static string CookieScheme = "ReactAuthDemo";
        public static void Main(string[] args)
        {
          
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddAuthentication(CookieScheme)
          .AddCookie(CookieScheme, options =>
          {
              options.Events = new CookieAuthenticationEvents
              {
                  OnRedirectToLogin = context =>
                  {
                      context.Response.StatusCode = 403;
                      context.Response.ContentType = "application/json";
                      var result = System.Text.Json.JsonSerializer.Serialize(new { error = "You are not authenticated" });
                      return context.Response.WriteAsync(result);
                  }
              };
          });

            builder.Services.AddSession();
            // Add services to the container.

            builder.Services.AddControllersWithViews();
            builder.Services.AddSignalR();
            builder.Services.AddControllersWithViews()
               .AddJsonOptions(opts =>
               {
                   var enumConverter = new JsonStringEnumConverter();
                   opts.JsonSerializerOptions.Converters.Add(enumConverter);
               });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.MapHub<TaskHub>("/api/task");

            app.UseSession();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}