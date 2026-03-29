# Stage 1: Build using Maven
FROM maven:3.8.5-openjdk-17-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and download dependencies (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight Runtime
FROM eclipse-temurin:17-jdk-jammy
# Set working directory
WORKDIR /app

# Copy the built artifact from the build stage
# Note: Filename matches <artifactId>-<version>.jar from pom.xml
COPY --from=build /app/target/delivery-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the backend port (defaulting to 8081 as per project context)
EXPOSE 8081

# Optimize JVM settings for container environment
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]