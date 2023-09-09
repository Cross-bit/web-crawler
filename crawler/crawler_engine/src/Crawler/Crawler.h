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
#include "DataValidation/CrawlerValidator.h"

class Crawler {
public:
    bool UpdateLoop();

    Crawler(std::ostream& outputStream,
            std::string initURL,
            const std::string& urlRegexFilter);

    /**
     * @brief Sets file extentions that can not occure at the end of URL to be crawled.
     * 
     * @param extensions 
     */
    void SetIgnorFileExtensions(std::unordered_set<std::string>& extensions);

    /**
     * @brief Sets allowed file extentions that can occure at the end of URL to be crawled.
     * 
     * @param bannedExtensions 
     */
    void SetValidExtensions(const std::unordered_set<std::string>& bannedExtensions);

protected:
    void virtual Crawl();

    /**
     * @brief Find page title in downloaded page data.
     * 
     * @param data Page data to crawl.
     * @param computationTime Time it took to find the title, time is added to the previous value.
     * @return string Page title or empty string
     */
    std::string FindPageTitle(DataContext& data,
                        size_t& computationTime) const;

    /**
     * @brief Searches for links in downloaded page data.
     * 
     * @param baseURL Url of the page data. 
     * @param data Downloaded page data
     * @param computationTime Time it took to find the links, time is added to the previous value.
     * @return std::vector<std::string> Vector of URL links.
     */
    std::vector<std::string> FindLinks(Poco::URI& baseURL, 
                                       DataContext& data,
                                       size_t& computationTime);
    /**
     * @brief Marks URL as visited.
     * 
     * @param urlToStore 
     */
    void SetUrlVisited(const Poco::URI urlToStore) const;
 // todo: to private?
    
    /**
     * @brief Checks wheter URL was already visited.
     * 
     * @param urlData 
     * @param hostExists 
     * @return true 
     * @return false 
     */
    bool CheckIfUrlIsNew(const UrlValidationResults& urlData,
                         bool& hostExists) const;
    /**
     *  Checks if url value is crawable, meaning there are now errors(other that OK).
     * @param urlData
     * @param hostNotExist
     * @return
     */
    bool CheckIfUrlIsCrawable(const UrlValidationResults& urlData) const;

    /**
     * @brief Downloads page data from URL provided.
     *
     * @param urlToPage URL to dowhload page from.
     * @return std::unique_ptr<DataContext> Returns downloaded data context.
     */
    std::unique_ptr<DataContext> DownloadPageData(Poco::URI& urlToPage);

    /**
     * @brief Filters given vector of urls based on certain conditions.
     *
     * @param urlsToFilter Vector of URLs to filter
     * @return std::vector<UrlValidationResults> Vector of objects containing information about validation errors.
     */
    std::vector<UrlValidationResults> FilterBannedUrls(std::vector<std::string>& urlsToFilter) const;

    /**
     * @brief Prints crawled links to predefined stream.
     *
     * @param baseUrlData URL of the page that was tried to crawl.
     * @param pageTitle Title of the page.
     * @param outgoingLinks Vector of filtered results.
     * @param computationTime Time it took to crawl data.
     */
    void PrintDataToOutput(const UrlValidationResults& baseUrlData,
                           const std::string& pageTitle,
                           const std::vector<UrlValidationResults>& outgoingLinks,
                           const size_t computationTime) const;

    /**
     * @brief Tries to read last std input command.
     *
     * @return std::string If there is no std:in returns empty string, command otherwise.
     */
    std::string CheckCommandStdInput();

    /**
     * @brief Resets whole Crawler to its initial state (cleans queues, sets appropriate flags etc....).
     */
    void FlushCrawledData();
    typedef std::unordered_map<std::string,
        std::unique_ptr<std::unordered_set<std::string>>> URLsProcessed;

    DataDownloader _downloader;
    bool _isCrawling = true;
    bool _isRunning = true;
    std::string _currentRootURL = "";
    std::unique_ptr<URLsProcessed> _urlsProcessed; // host url to specification
    std::unordered_set<std::string> _allowedExtentions;
    std::queue<UrlValidationResults> _urlsToProcess;
    std::ostream& _outputStream;
    std::string _urlRegexFilter;

};


#endif //CRAWLER_CRAWLER_H
