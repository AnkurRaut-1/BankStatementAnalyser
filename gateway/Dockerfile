FROM openjdk:11
WORKDIR usr/src
ADD ./target/gateway.jar /usr/src/gateway.jar
ENTRYPOINT ["java","-jar","gateway.jar"]
