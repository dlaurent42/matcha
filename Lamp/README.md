# LAMP stack built with Docker Compose

![Landing Page](https://preview.ibb.co/gOTa0y/LAMP_STACK.png)

This is a basic LAMP stack environment built using Docker Compose. It consists following:

* PHP
* Apache
* MySQL
* phpMyAdmin

As of now, we have 3 different branches for different PHP versions. Use appropriate branch as per your php version need:
* [5.6.x](https://github.com/sprintcube/docker-compose-lamp/tree/5.6.x)
* [7.1.x](https://github.com/sprintcube/docker-compose-lamp/tree/7.1.x)
* [7.2.x](https://github.com/sprintcube/docker-compose-lamp/tree/7.2.x)

## Installation

Clone this repository on your local computer and checkout the appropriate branch e.g. 7.1.x. Run the `docker-compose up -d`.

```shell
git clone https://github.com/sprintcube/docker-compose-lamp.git
cd docker-compose-lamp/
git fetch --all
git checkout 7.1.x
docker-compose up -d
```

Your LAMP stack is now ready!! You can access it via `http://localhost`.

## Configuration and Usage

Please read from appropriate version branch.
