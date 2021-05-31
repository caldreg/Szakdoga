FROM node:10

RUN apt-get update
RUN apt-get install -y vim

WORKDIR /opt

COPY bootstrap.sh /opt/
RUN chmod -x /opt/bootstrap.sh

CMD /bin/bash /opt/bootstrap.sh