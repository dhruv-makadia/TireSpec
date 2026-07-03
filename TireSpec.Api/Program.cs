using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TireSpec.Api.Hubs;
using TireSpec.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddSingleton<IUserSessionValidator, UserSessionValidator>();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("TireSpecClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173", "http://192.168.3.118:5173", "https://192.168.3.118:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSecret = builder.Configuration["Session:JwtSecret"] ?? string.Empty;

        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                IUserSessionValidator userSessionValidator = context.HttpContext.RequestServices.GetRequiredService<IUserSessionValidator>();
                string? userSessionIdClaim = context.Principal?.FindFirst("UserSessionID")?.Value;

                if (!Guid.TryParse(userSessionIdClaim, out var userSessionId)
                    || !await userSessionValidator.UserSessionExistsAsync(userSessionId, context.HttpContext.RequestAborted))
                {
                    context.Fail("Invalid or expired session.");
                }
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("TireSpecClient");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<CaptureHub>("/hubs/capture");
await app.RunAsync();