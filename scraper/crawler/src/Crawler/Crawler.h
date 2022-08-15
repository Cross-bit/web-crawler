//
// Created by kriz on 31.07.2022.
//

#ifndef CRAWLER_CRAWLER_H
#define CRAWLER_CRAWLER_H

#include <iostream>
#include <string>
#include <unordered_set>
#include <unordered_map>
#include <queue>
#include "../Downloader/DataDownloader.h"
#include "./CrawlerFilter/CrawlerFilter.h"

class Crawler {
public:
    bool UpdateLoop();

    Crawler(std::ostream& outputStream, std::string initURL, const std::string& urlRegexFilter);

    void SetIgnorFileExtensions(std::unordered_set<std::string>& extensions);


    void SetValidExtensions(const std::unordered_set<std::string>& bannedExtensions);

protected:
    void virtual Crawl();

    std::vector<std::string> FindLinks(Poco::URI& baseURL, size_t& computationTime);

    DataDownloader _downloader;

    void SetUrlVisited(const Poco::URI& urlToStore) const;

    bool CheckIfUrlIsNew(const UrlFilterResults& urlData, bool& hostExists) const;

    std::vector<UrlFilterResults> FilterBannedUrls(std::vector<std::string>& urlsToFilter) const;

    void PrintDataToOutput(const std::string& baseUrl,
                           const std::vector<UrlFilterResults>& outgoingLinks,
                           const size_t computationTime) const;

    typedef std::unordered_map<std::string, std::unique_ptr<std::unordered_set<std::string>>> URLsProcessed;

    bool _isCrawling = true;
    bool _isRunning = true;
    std::string _currentRootURL = "";
    std::unique_ptr<URLsProcessed> _urlsProcessed; // host url to specification
    std::unordered_set<std::string> _allowedExtentions;
    std::queue<Poco::URI> _urlsToProcess;
    std::ostream& _outputStream;
    const std::string& _urlRegexFilter;



};



#endif //CRAWLER_CRAWLER_H
