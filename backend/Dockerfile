# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and restore dependencies
COPY ["Samantha.Backend.sln", "./"]
COPY ["Samantha.API/Samantha.API.csproj", "Samantha.API/"]
RUN dotnet restore "Samantha.Backend.sln"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/Samantha.API"
RUN dotnet publish "Samantha.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 8080 (standard for Render)
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Samantha.API.dll"]
