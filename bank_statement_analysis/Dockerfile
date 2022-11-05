FROM openjdk:11
WORKDIR usr/src

RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections
RUN sed -i'.bak' 's/$/ contrib/' /etc/apt/sources.list
RUN apt-get update; apt-get install -y ttf-mscorefonts-installer fontconfig

ADD ./target/BSAService.jar /usr/src/BSAService.jar
ENTRYPOINT ["java","-jar","BSAService.jar"]
