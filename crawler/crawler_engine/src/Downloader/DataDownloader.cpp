//
// Created by kriz on 31.07.2022.
//

#include "DataDownloader.h"
#include <curl/curl.h>
#include <cstring>
#include <memory>

#include <stdio.h>
#include <stdlib.h>
#include <vector>
using namespace std;


struct MemoryStruct {
    char *memory;
    size_t size;
};

static size_t
WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp)
{
    size_t realsize = size * nmemb;
    struct MemoryStruct *mem = (struct MemoryStruct *)userp;

    char *ptr = (char*)realloc(mem->memory, mem->size + realsize + 1);
    if(!ptr) {
        /* out of memory! */
        printf("not enough memory (realloc returned NULL)\n");
        return 0;
    }

    mem->memory = ptr;
    memcpy(&(mem->memory[mem->size]), contents, realsize);
    mem->size += realsize;
    mem->memory[mem->size] = 0;

    return realsize;
}


std::unique_ptr<DataContext> DataDownloader::DownloadPageData(const std::string &pageUrl) {

    std::unique_ptr<DataContext> result = std::make_unique<DataContext>();
    result->Data = nullptr;
    result->pageUrl = pageUrl;

    CURL *curl;
    CURLcode res;
    struct MemoryStruct chunk;

    chunk.memory = (char*)malloc(1);  /* will be grown as needed by realloc above */
    chunk.size = 0;    /* no data at this point */

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();
    
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, pageUrl.c_str());

        /* send all data to this function  */
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);

        /* we pass our 'chunk' struct to the callback function */
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

        /* some servers do not like requests that are made without a user-agent
           field, so we provide one */
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "libcurl-agent/1.0");

        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);

        /* Perform the request, res will get the return code */
        res = curl_easy_perform(curl);
        /* Check for errors */
        if(res != CURLE_OK) {
            /*fprintf(stderr, "curl_easy_perform() failed: %s, url: %s\n",
                    curl_easy_strerror(res), pageUrl.c_str());*/
            result->Status = res;
            result->Data = nullptr;
        }
        else {
            result->Data = make_unique<string>(chunk.memory);
        }

        /* always cleanup */
        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();

    return std::move(result);
}

// from https://curl.se/libcurl/c/postinmemory.html
