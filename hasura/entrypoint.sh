#!/bin/bash

# Sometimes hasura loads faster than postgres and crashes because it can't connect to it
./wait-for-it.sh -h postgres -p 5432 -t 60

graphql-engine serve & \

while ! curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/v1/graphql; do
  echo "Waiting for Hasura to get ready..."
  sleep 1
done

sleep 1

# records table

curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: pma_lang=cs' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":1,"args":[{"type":"pg_track_table","args":{"table":{"name":"records","schema":"public"},"source":"default"}}]}' \
  --compressed

# tags table

curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: pma_lang=cs' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":2,"args":[{"type":"pg_track_table","args":{"table":{"name":"tags","schema":"public"},"source":"default"}}]}' \
  --compressed

# tags records relations
curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: pma_lang=cs' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":3,"args":[{"type":"pg_track_table","args":{"table":{"name":"tags_records_relations","schema":"public"},"source":"default"}}]}' \
  --compressed

curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: pma_lang=cs' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":4,"args":[{"type":"pg_create_array_relationship","args":{"name":"tags_records_relations","table":{"name":"records","schema":"public"},"using":{"foreign_key_constraint_on":{"table":{"name":"tags_records_relations","schema":"public"},"column":"record_id"}},"source":"default"}},{"type":"pg_create_array_relationship","args":{"name":"tags_records_relations","table":{"name":"tags","schema":"public"},"using":{"foreign_key_constraint_on":{"table":{"name":"tags_records_relations","schema":"public"},"column":"tag_id"}},"source":"default"}},{"type":"pg_create_object_relationship","args":{"name":"record","table":{"name":"tags_records_relations","schema":"public"},"using":{"foreign_key_constraint_on":"record_id"},"source":"default"}},{"type":"pg_create_object_relationship","args":{"name":"tag","table":{"name":"tags_records_relations","schema":"public"},"using":{"foreign_key_constraint_on":"tag_id"},"source":"default"}}]}' \
  --compressed

tail -F /dev/null