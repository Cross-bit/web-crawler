#!/bin/bash

# Sometimes hasura loads faster than postgres and crashes because it can't connect to it
./wait-for-it.sh -h postgres -p 5432 -t 60

graphql-engine serve & \

while ! curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/v1/graphql; do
  echo "Waiting for Hasura to get ready..."
  sleep 1
done

sleep 1

curl 'http://localhost:8080/v1/metadata' \
  -H 'Connection: keep-alive' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"' \
  -H 'DNT: 1' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'content-type: application/json' \
  -H 'Accept: */*' \
  -H 'Origin: http://localhost:8080' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Accept-Language: en' \
  -H 'Cookie: _xsrf=2|a6d1131f|2cdf65cabccabd2110fe2bd7a0dced84|1646956053' \
  --data-raw '{"type":"bulk","source":"default","resource_version":1,"args":[{"type":"pg_track_table","args":{"table":{"name":"record","schema":"public"},"source":"default"}}]}' \
  --compressed

curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":2,"args":[{"type":"pg_track_table","args":{"table":{"name":"tags","schema":"public"},"source":"default"}}]}' \
  --compressed

curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":3,"args":[{"type":"pg_track_table","args":{"table":{"name":"tags_records_relations","schema":"public"},"source":"default"}}]}' \
  --compressed


# add all foreign keys and relations
curl 'http://localhost:8080/v1/metadata' \
  -H 'Accept: */*' \
  -H 'Accept-Language: cs,en;q=0.9,cs-CZ;q=0.8,sk;q=0.7,en-AU;q=0.6,en-ZA;q=0.5,en-CA;q=0.4,en-NZ;q=0.3,en-GB-oxendict;q=0.2,en-GB;q=0.1,en-US;q=0.1,de;q=0.1' \
  -H 'Connection: keep-alive' \
  -H 'Origin: http://localhost:8080' \
  -H 'Referer: http://localhost:8080/console/data/default/schema/public' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"type":"bulk","source":"default","resource_version":4,"args":[{"type":"pg_create_array_relationship","args":{"name":"tags_records_relations","table":{"name":"record","schema":"public"},"using":{"foreign_key_constraint_on":{"table":{"name":"tags_records_relations","schema":"public"},"column":"record_id"}},"source":"default"}},{"type":"pg_create_array_relationship","args":{"name":"tags_records_relations","table":{"name":"tags","schema":"public"},"using":{"foreign_key_constraint_on":{"table":{"name":"tags_records_relations","schema":"public"},"column":"tag_id"}},"source":"default"}},{"type":"pg_create_object_relationship","args":{"name":"record","table":{"name":"tags_records_relations","schema":"public"},"using":{"foreign_key_constraint_on":"record_id"},"source":"default"}},{"type":"pg_create_object_relationship","args":{"name":"tag","table":{"name":"tags_records_relations","schema":"public"},"using":{"foreign_key_constraint_on":"tag_id"},"source":"default"}}]}' \
  --compressed

tail -F /dev/null