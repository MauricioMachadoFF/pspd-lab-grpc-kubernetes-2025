using MicroserviceA_LinkShortener.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy for frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
    });
});

builder.Services.AddGrpc().AddJsonTranscoding();

builder.Services.AddGrpcSwagger();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Microservice A - Link Shortener gRPC API",
        Version = "v1",
        Description = "gRPC service for URL shortening with JSON transcoding support. " +
                      "This service uses Protocol Buffers (Protobuf) for efficient communication and supports both gRPC and HTTP/REST calls.",
        Contact = new OpenApiContact
        {
            Name = "PSPD Lab - gRPC vs REST Comparison",
            Url = new Uri("https://github.com/pspd-lab")
        }
    });
});

var app = builder.Build();

// Enable routing FIRST
app.UseRouting();

// Enable CORS AFTER routing
app.UseCors("AllowFrontend");

// Enable Swagger for all environments (including Docker/Production)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Link Shortener gRPC API v1");
    c.RoutePrefix = "swagger"; // Access at /swagger
    c.DocumentTitle = "Microservice A - Link Shortener gRPC API";
});

// Map gRPC service with CORS enabled
app.MapGrpcService<LinkSService>().RequireCors("AllowFrontend");

// Root endpoint with useful information
app.MapGet("/", () => Results.Json(new
{
    service = "Microservice A - Link Shortener",
    protocol = "gRPC with JSON Transcoding",
    version = "v1",
    swagger = "/swagger",
    endpoints = new
    {
        createLink = "POST /v1/links",
        getUrl = "GET /{shortUrl}"
    },
    documentation = "https://go.microsoft.com/fwlink/?linkid=2086909"
}));

// Health check endpoint
app.MapGet("/health", () => Results.Json(new
{
    status = "healthy",
    service = "link-shortener-grpc",
    timestamp = DateTime.UtcNow
}));

app.Run();
