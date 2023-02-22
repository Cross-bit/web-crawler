#!/bin/bash

HASURA_TRACKING_SETTINGS="hasuraTrackingSettings.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

for settings in $(jq -r ".[] | tostring" $HASURA_TRACKING_SETTINGS); do

echo "ADDING $settings"

result=$(curl -X POST \
-s \
-H "Content-Type: application/json" \
-H "X-Hasura-Role: admin" \
-d  "$settings" \
http://localhost:8080/v1/metadata)



error=$(echo "$result" | jq -r ".error")

if [ "$error" != "null" ]; then
    error_code=$(echo "$result" | jq -r ".code")
    if [ "$error_code" == "already-tracked" ]; then
        echo -e "${GREEN}ALREADY TRACKED!... OK${NC}"
    else
        echo -e "${RED}ERROR OCCURED!... NOK${NC}"
        echo "$result"
    fi
else
    echo -e "${GREEN}OK${NC}"

fi

done


# todo: complete
#jq -r ".[] | tostring" "$HASURA_TRACKING_SETTINGS" | xargs -P 4 -I{} sh -c '
#  # Pass the object string to curl command
#  curl -X POST \
#  -H "Content-Type: application/json" \
#  -H "X-Hasura-Role: admin" \
#  -d "$1" \
#  http://localhost:8080/v1/metadata
#' sh {}