# AWS Instance State Scheduler (**ISS**)
This is a small app that will allow you to configure schedules according to which
your [AWS EC2](https://aws.amazon.com/ec2/) and [AWS RDS](https://aws.amazon.com/rds/) 
instances will be started and stopped. For instance if you have **testing** and/or 
**staging** servers, you can stop them over the weekend when nobody is using them.

It also provides a simple dashboard from where you can start or stop your instances
in case you need that.

### Available tags
 - ```1.0.0```, ```latest```

## How to use this image
You can start this image using your CLI or by using a [docker-compose.yml](docker-compose.yml)
file similar with the one bellow:
```yml
version: '3'
services:
  aws-iss:
    image: "bogdanmic/aws-iss:latest"
    container_name: aws-iss
    expose: 
      - 3000
    ports:
      - "3000:3000"
    environment:
      AWS_ACCESS_KEY_ID: "YOUR_AWS_ACCESS_KEY_ID"
      AWS_SECRET_ACCESS_KEY: "YOUR_AWS_SECRET_ACCESS_KEY"
    volumes:
      - /PATH/TO/YOUR-CONFIG.yml:/app/config/production.yml
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
```
Don't forget to adjust the **environment variables** and the **configuration file** 
according to your setup.

### Environment variables
Because this image uses the [aws-sdk](https://www.npmjs.com/package/aws-sdk) we 
need to configure the credentials for it accoording with the [official documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html):
 - ```AWS_ACCESS_KEY_ID``` - Your AWS access key id.
 - ```AWS_SECRET_ACCESS_KEY``` - Your AWS secret access key.

### Configuration file
For configuring the image we use a simple **yml** file.
In that file we can configure the following:
 - ```aws.region``` - The aws region for which we want to manage the instances 
 state. e.g.```eu-west-1```
 - ```aws.interactiveInstances.ec2``` - The aws ec2 instance id list that can 
 be managed. e.g. ```["i-1a23b45xyz678cd91","x-1a23b45xyz678cd92"]```
 - ```aws.interactiveInstances.rds``` - The aws rds instance id list that can 
 be managed. e.g. ```["db-1"]```
 - ```schedulers.ec2Schedulers.enabled``` - Enable/Disable the schedulers that 
 will start/stop the ```aws.interactiveInstances.ec2``` instances, ```false``` 
 by default.
 - ```schedulers.ec2Schedulers.startCron``` - The cron expression that decides 
 when to start the ```aws.interactiveInstances.ec2``` instances. By default 
 every week day at 7 am: ```0 0 7 * * 1-5```.
 - ```schedulers.ec2Schedulers.stopCron``` - The cron expression that decides 
 when to stop the ```aws.interactiveInstances.ec2``` instances. By default 
 every week day at 8 pm: ```0 0 20 * * 1-5```.
 - ```schedulers.rdsSchedulers.enabled``` - Enable/Disable the schedulers that 
 will start/stop the ```aws.interactiveInstances.rds``` instances, ```false``` 
 by default.
 - ```schedulers.rdsSchedulers.startCron``` - The cron expression that decides 
 when to start the ```aws.interactiveInstances.rds``` instances. By default 
 every week day at 8 pm: ```0 0 7 * * 1-5```.
 - ```schedulers.rdsSchedulers.stopCron``` - The cron expression that decides 
 when to stop the ```aws.interactiveInstances.rds``` instances. By default 
 every week day at 8 pm: ```0 0 20 * * 1-5```.

Here is the default configuration file to help you write your own:
```yml
schedulers:
  ec2Schedulers:
    enabled: false
    startCron: "0 0 7 * * 1-5"
    stopCron: "0 0 20 * * 1-5"
  rdsSchedulers:
    enabled: false
    startCron: "0 0 7 * * 1-5"
    stopCron: "0 0 20 * * 1-5"

aws:
  region: "eu-west-1"
  interactiveInstances:
    ec2: []
    rds:  []
```
Because we use [node-schedule](https://www.npmjs.com/package/node-schedule) you can
check their documentation on the cron format used but here is a small peek take
from [their README](https://github.com/node-schedule/node-schedule/blob/master/README.md)
file:
> The cron format consists of:
> ```
> *    *    *    *    *    *
> ┬    ┬    ┬    ┬    ┬    ┬
> │    │    │    │    │    │
> │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
> │    │    │    │    └───── month (1 - 12)
> │    │    │    └────────── day of month (1 - 31)
> │    │    └─────────────── hour (0 - 23)
> │    └──────────────────── minute (0 - 59)
> └───────────────────────── second (0 - 59, OPTIONAL)
> ```

You can also access the [Dashboard](http://localhost:3000/#) on http://localhost:3000/#
if you started the container locally.

The **Dashboard** provides an overview of your AWS EC2 and RDS instances and
based on your configuration of ```aws.interactiveInstances.ec2``` and ```aws.interactiveInstances.rds```
you will be able to Start/Stop those instances using the dashboard.

### Resources for future work/fixes
 - [Node-Config and Configuration Files](https://github.com/lorenwest/node-config/wiki/Configuration-Files)
 - [The Node Schedule package](https://www.npmjs.com/package/node-schedule)
 - [The Fastify framework](https://www.fastify.io/docs/latest/)
 - [Online Crontab Generator](https://crontab-generator.org/)
 - [AWS SDK js examples](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascript/example_code/ec2)
 - [AWS SDK docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html)
 - [AWS SDK Javascript developer guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/using-promises.html)
