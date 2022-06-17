// https://formidable.com/open-source/urql/docs/basics/core/#subscribing-to-results

import { createClient } from "@urql/core";
import {
  AllRecordsDocument,
  useAllRecordsQuery,
  Record,
} from "./graphql/_generated";
import fetch from "cross-fetch"; // https://github.com/FormidableLabs/urql/issues/1700

const client = createClient({
  fetch: fetch,
  url: "http://hasura:8080/v1/graphql",
  maskTypename: true,
});


while (true) {
  // sleep for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = await client.query(AllRecordsDocument).toPromise()
  console.log(result.data)
}
