# Sources:
# - https://github.com/gafiatulin/alpine-sbt/blob/master/Dockerfile (install sbt)
# - https://github.com/Docker-Hub-frolvlad/docker-alpine-scala/blob/master/Dockerfile (install Scala)

ARG sbt_version=1.4.7
ARG sbt_home=/usr/local/sbt
ARG SCALA_VERSION=2.13.4
ARG SCALA_HOME=/usr/share/scala

FROM openjdk:jre-alpine as sbt
ARG sbt_version
ARG sbt_home

RUN apk add --no-cache --update bash

# Download and extract from archive
RUN apk add --no-cache --update wget
RUN mkdir -pv "$sbt_home"
RUN wget -qO - "https://github.com/sbt/sbt/releases/download/v$sbt_version/sbt-$sbt_version.tgz" >/tmp/sbt.tgz
RUN tar xzf /tmp/sbt.tgz -C "$sbt_home" --strip-components=1

FROM openjdk:jre-alpine as release
ARG sbt_home
ARG SCALA_VERSION
ARG SCALA_HOME

# sbt requires bash at run-time.
RUN apk add --no-cache --update bash  

COPY --from=sbt $sbt_home $sbt_home
RUN ln -sv "$sbt_home"/bin/sbt /usr/bin/

RUN sbt -Dsbt.rootdir=true sbtVersion

# install scala
RUN apk add --no-cache --virtual=.build-dependencies wget ca-certificates && \
    apk add --no-cache bash && \
    cd "/tmp" && \
    wget "https://downloads.typesafe.com/scala/${SCALA_VERSION}/scala-${SCALA_VERSION}.tgz" && \
    tar xzf "scala-${SCALA_VERSION}.tgz" && \
    mkdir "${SCALA_HOME}" && \
    rm "/tmp/scala-${SCALA_VERSION}/bin/"*.bat && \
    mv "/tmp/scala-${SCALA_VERSION}/bin" "/tmp/scala-${SCALA_VERSION}/lib" "${SCALA_HOME}" && \
    ln -s "${SCALA_HOME}/bin/"* "/usr/bin/" && \
    apk del .build-dependencies && \
    rm -rf "/tmp/"*

WORKDIR /app

COPY . .

RUN sbt compile clean assembly

RUN cp target/scala-2.13/*.jar /app/provider.jar

EXPOSE 8080

CMD ["scala", "provider.jar"]