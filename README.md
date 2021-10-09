![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)


# Reviews

Team Beedle was tasked with building services to replace the backend of an existing ecommerce website. The goal was to minimize the impact to the frontend and design an API that is scalable, efficient and delivers significantly fast response times. 
- The Reviews service uses Nginx to cache and load balance requests across several service instances. 
- It also takes advantage of proper indexing. The result is a service that peaks at 5000 requests per second, or 300,000 a minute, with ~12ms response times.

![loader1](https://github.com/team-beedle/reviews/blob/main/images/loader1.png?raw=true)

## Optimizations

The Reviews service uses a distributed structure of 2 identical Node/Express instances to manage HTTP requests, and 1 Postgres instance with access to millions of records. Load is balanced through an Nginx server, which performs general cacheing and keepalive connections to manage largely uninterrupted traffic.

![lucid](https://github.com/team-beedle/reviews/blob/main/images/lucid.png)

Requests are divided on a least connections basis between the two Express servers. During a period of testing, I used a backup Express server configured in the same machine as the Postgres database, in order to handle overflow. There is a slight positive performance difference when this server is switched on, but I quickly ran out of connection resources. In the last part of the project, I focused on managing these resources through Nginx configurations.

In the end I managed to have a stable load of 1000 requests per second at ~14ms response times.

I also indexed columns that I used for queries with B-Trees for faster lookups.
