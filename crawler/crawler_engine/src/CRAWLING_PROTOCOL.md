# Crawling Protocol v1

This document outlines the communication protocol for the crawler. The protocol is text-based and encoded in UTF-8.

## Crawler States

- **Idle:** The crawler is passively waiting for the client to initiate communication.
- **Running:** The crawler is actively crawling based on the client's initial request. During this state, no client requests will be served except for the special command `HALT`.

## Communication Initialization

**Precondition:** The crawler is in the *idle* state.

Communication is initiated by the client. The client sends the following data to the crawler via stdin:

`{ Crawling base URL }` `{ Specific regex boundary }`

- `{ Crawling base URL }`: Must be a valid URL starting with HTTP/HTTPS.
- `{ Specific regex boundary }` (optional): If not specified, no regex boundary is applied. The crawler accepts all regular expressions valid for `std::regex` in C++ 17.

## Communication Start/End Commands

The start of crawling is indicated by the token: `<<<T_START>>>`.  
The end of crawling is indicated by the token: `<<<T_END>>>`.

Once the client receives `<<<T_START>>>`, data chunks will be sent to the client in a continuous stream. It is the client's responsibility to correctly extract the data from the stream. There will always be at least one data chunk before `<<<T_END>>>`.

## Chunk Data

Each data transmission starts with the token: `<<<C_START>>>`.  
A successful data transmission is acknowledged by the token: `<<<C_END>>>`.

A chunk data transmission is acknowledged as complete if a valid pairing of `<<<C_START>>>` and `<<<C_END>>>` is received.

In a successful transaction, for each crawled URL, exactly one data chunk will be sent to the client.

### Chunk Data Format

Each chunk of data is a JSON object with the following fields:

- `baseUrl`: URL corresponding to the crawled page.
- `title`: Title corresponding to the crawled page. Empty string if none found.
- `crawlTime`: Time the crawler spent crawling the page.
- `links`: Array of JSON objects representing links found on the page.
- `errors`: Array of numeric error codes.

Possible values for `errors`:
- `0`: OK – Link is valid, and the page was crawled successfully.
- `1`: REGEX – Provided regex not matched.
- `2`: EXTENSION – URL ended with a prohibited file extension. (Valid file extensions are .html, .php, or none)
- `3`: INVALID_URI – URL was wrongly selected and is not valid.
- `4`: DATA_DOWNLOAD – Page couldn't be downloaded and crawled.

Each `links` item has the following fields:
- `URI`: Links found on the page.
- `Errors`: List of errors associated with the given `URI`.

## Immediate Termination of Crawler

The client can send the command `HALT` to the crawler via stdin, which immediately stops all ongoing crawling activities. Upon receiving `HALT`, the crawler transitions to the *idle* state, and all processed and cached data are flushed.













