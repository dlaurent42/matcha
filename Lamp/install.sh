#!/bin/bash
MACHINE=$(docker-machine ls -q)
echo $MACHINE
if [ $MACHINE = ""]; then
  docker-machine create
  $MACHINE="default"
fi
docker-machine start ${MACHINE}
eval $(docker-machine env ${MACHINE})
docker-compose up