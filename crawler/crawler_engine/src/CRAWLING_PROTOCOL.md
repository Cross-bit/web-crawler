# Crawling protocol v1

This document specifies communication protocol of the crawler.
The protocol is text based, encoded in utf-8.

<!--Each data chunk(the command or data itself) is send on separate line.-->

# Communication start/end command
The start of crawling is denoted by token: `<<<T_START>>>`
The end of crawling is denoted by token: `<<<T_END>>>`


# Chunk data
Chunk data transfer can be initiated iff the the communication command was recived.

Each start of chunk data transmission is denoted by token: `<<<C_START>>>`
Each succesfull chunk data transmission is acnowledged by token: `<<<C_END>>>`

Chunk data are in a form of JSON object.

TODO: fill in details + json object










