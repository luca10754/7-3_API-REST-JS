FROM openjdk:24-ea
LABEL authors="almafuerte"
ADD target/students-api-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
