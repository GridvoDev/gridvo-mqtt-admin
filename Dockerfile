FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/gridvo-mqtt-admin/
WORKDIR /home/gridvo-mqtt-admin
RUN ["npm","config","set","registry","http://registry.npm.taobao.org"]
RUN ["npm","install","--save","express@4.15.2"]
RUN ["npm","install","--save","underscore@1.8.3"]
RUN ["npm","install","--save","mongodb@2.2.25"]
RUN ["npm","install","--save","gridvo-common-js@0.0.23"]
COPY ./app.js app.js
COPY ./lib lib
VOLUME ["/home/gridvo-mqtt-admin"]
ENTRYPOINT ["node"]
CMD ["app.js"]