#/bin/bash

start=$SECONDS
while true;
do
	duration=$(( SECONDS - start ))
    echo $duration
    # if ! (($duration % 25 == 0)); then
    #     curl http://localhost:3000/all/ff00000000ff/1
    # else
    #     curl http://localhost:3000/all/0000000000ff/1
    # fi
done