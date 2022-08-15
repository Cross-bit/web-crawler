//
// Created by kriz on 31.07.2022.
//

#ifndef CRAWLER_DATADOWNLOADER_H
#define CRAWLER_DATADOWNLOADER_H

#include <iostream>
#include <string>
#include <memory>

struct DataContext {
    std::unique_ptr<std::string> Data;
    std::string pageUrl;
    std::string Status;
};

class DataDownloader {
public:
    std::unique_ptr<DataContext> DownloadPageData(const std::string& pageUrl);

private:
    std::string pageContent;
};


#endif //CRAWLER_DATADOWNLOADER_H

