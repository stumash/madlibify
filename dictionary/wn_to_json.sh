#!/usr/bin/env bash

if [ -z "${1}" ]
then
    echo "need one argument, filename to output json to"
    exit 1
fi
filename="${1}"

dictfiles=$(ls -l dictfiles | grep "." | awk '{print $9}') 
for file in $dictfiles
do
    cat dictfiles/$file | cut -d " " -f 1-2
done > intermediate_file_1

echo "{" > "${filename}"
while read line
do
    if [ -z "$line" ]
    then
        continue
    fi

    arr=(${line})
    key="${arr[0]}"
    value="${arr[1]}"

    echo "    \"$key\": \"$value\","
done >> "${filename}" < intermediate_file_1
echo "}" >> "${filename}"

rm intermediate_file_1
