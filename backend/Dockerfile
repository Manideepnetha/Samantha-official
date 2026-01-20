# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["Samantha.API/Samantha.API.csproj", "Samantha.API/"]
RUN dotnet restore "Samantha.API/Samantha.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/Samantha.API"
RUN dotnet publish "Samantha.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Samantha.API.dll"]
