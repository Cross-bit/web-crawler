//
// Created by kriz on 31.07.2022.
//

#include "Crawler.h"
#include <memory>
#include <thread>
#include <algorithm>
#include <chrono>
#include <regex>
#include <exception>
#include <string>
#include <stdio.h>
#include "../LinkSearch/LinksFinder.h"
#include "../LinkSearch/algorithms/SimpleSearchAlgorithm.h"
#include "../LinkSearch/algorithms/SimpleHrefSearchAlgorithm.h"
#include "../LinkSearch/algorithms/TinyXMLParserAlgorithm.h"
#include "../../External/includes/nlohmann/json.hpp"
#include "../../External/includes/Poco/URI.h"

using json = nlohmann::json;

void to_json(json& j, const UrlValidationResults&  t)
{
    j = json{ {"url", t.URI.toString()}, {"Errors", t.Errors} };
}

using namespace std;
using namespace std::chrono;


Crawler::Crawler(std::ostream& outputStream, string baseURL, const std::string& urlRegexFilter) :
_currentRootURL(baseURL), _outputStream(outputStream), _urlRegexFilter(urlRegexFilter),
_urlsProcessed(std::make_unique<URLsProcessed>()) { }

bool Crawler::UpdateLoop() {

    std::string line;
    while (std::getline(std::cin, line)) {
        std::stringstream ss(line);
        ss >> _currentRootURL >> _urlRegexFilter;
        if (_currentRootURL != "") {
            
            _outputStream.flush();
            _outputStream << "<<<T_START>>>";
            _outputStream.flush();
            Crawl();
            _outputStream.flush();
            fflush(stdout);
            _outputStream << "<<<T_END>>>";
            _outputStream.flush();
            fflush(stdout);

        }
    }
    
    return true;
}

void Crawler::SetUrlVisited(const Poco::URI urlToStore) const {
    if (_urlsProcessed->find(urlToStore.getHost()) == _urlsProcessed->end()) {
        auto urlPaths = make_unique<unordered_set<string>>();
        urlPaths->insert(urlToStore.getPathEtc()); // we use copy so the poco object stays intact... 
        _urlsProcessed->insert({ urlToStore.getHost(), std::move(urlPaths) });
    }
    else
        _urlsProcessed->at(urlToStore.getHost())->insert(urlToStore.getPathEtc());
}

bool Crawler::CheckIfUrlIsNew(const UrlValidationResults& urlData, bool& hostNotExist) const {
    return ((hostNotExist = (_urlsProcessed->find(urlData.URI.getHost()) == _urlsProcessed->end())) ||
            _urlsProcessed->at(urlData.URI.getHost())->find(urlData.URI.getPathEtc()) == _urlsProcessed->at(urlData.URI.getHost())->end());
}

bool Crawler::CheckIfUrlIsCrawable(const UrlValidationResults& urlData) const {
    return (urlData.Errors.size() == 1 && urlData.Errors[0] == ValidationCodes::OK);
}

void Crawler::Crawl() {
    if (_currentRootURL == "")
        return; 

    Poco::URI rootUrl;

    try {
        rootUrl = Poco::URI(_currentRootURL);
    }
    catch (exception& e) {
        std::cerr << "Invalid root url!" << std::endl;
        return;
    }

    UrlValidationResults rootUrlRecord;
    rootUrlRecord.URI = rootUrl;
    rootUrlRecord.Errors.push_back(ValidationCodes::OK);
    SetUrlVisited(rootUrl); // we don't want to crawl root ever again!

    _urlsToProcess.emplace(rootUrlRecord);

    while (!_urlsToProcess.empty()) {

        if (CheckCommandStdInput() == "HALT"){
            std::cout << "we halted!!!" << endl;
            break;
        }

        #pragma omp parallel for default(none)
        for (int i = 0; i < _urlsToProcess.size() /*std::min( (unsigned int)_urlsToProcess.size(), thread::hardware_concurrency() * 3)*/; i++) {
            UrlValidationResults currentURL;

            #pragma omp critical
            {
                currentURL = _urlsToProcess.front();
                _urlsToProcess.pop();
            };

            // download page data
            // todo: move to separate method
            if (CheckIfUrlIsCrawable(currentURL)) {
                auto data = this->DownloadPageData(currentURL.URI);
                size_t duration = 0;

                std::string pageTitle = this->FindPageTitle(*data, duration);

                vector<string> discoveredURLs = FindLinks(currentURL.URI, *data, duration);

                vector<UrlValidationResults> filterResult = FilterBannedUrls(discoveredURLs);

                #pragma omp critical
                {
                    _outputStream << "<<<C_START>>>";
                    _outputStream.flush();
                    PrintDataToOutput(currentURL, pageTitle, filterResult, duration);
                    _outputStream << "<<<C_END>>>";
                    _outputStream.flush();
                };

                #pragma omp critical
                for (auto& urlData: filterResult) {
                    bool hostExists = true;
                    
                    if (CheckIfUrlIsNew(urlData, hostExists)) {
                        SetUrlVisited(urlData.URI);
                        _urlsToProcess.push(urlData);
                    }
                }
            }
            else
            {
                #pragma omp critical
                {
                    _outputStream << "<<<C_START>>>";
                    _outputStream.flush();
                    vector<UrlValidationResults> emptyOutgoingLinks;
                    PrintDataToOutput(currentURL, "", std::move(emptyOutgoingLinks), 0); // we make up empty data...
                    _outputStream << "<<<C_END>>>";
                    _outputStream.flush();
                };
            }

        }
    }
    _currentRootURL = "";
    FlushCrawledData();
}

string Crawler::CheckCommandStdInput()
{
    if (std::cin.rdbuf()->in_avail() > 0) {

        string input;
        std::getline(std::cin, input);
        return input;
    }

    return "";
}

void Crawler::FlushCrawledData()
{
    // ale yet unprocessed urls
    std::queue<UrlValidationResults> emptyUrlsQueue;
    _urlsToProcess.swap(emptyUrlsQueue);

    // all processed urls
    _urlsProcessed->clear();
}

void Crawler::SetValidExtensions(const std::unordered_set<std::string>& bannedExtensions) {
    _allowedExtentions = bannedExtensions;
}

vector<UrlValidationResults> Crawler::FilterBannedUrls(std::vector<std::string>& urlsToFilter) const {
    CrawlerValidator linksFilter(urlsToFilter, _allowedExtentions, _urlRegexFilter);
    return std::move(linksFilter.FilterLinks());
}

std::unique_ptr<DataContext> Crawler::DownloadPageData(Poco::URI& urlToPage) { // todo: add const??
    std::string toCrawlURL = urlToPage.toString();
    return std::move(_downloader.DownloadPageData(toCrawlURL));

}

std::string Crawler::FindPageTitle(DataContext& data, size_t& computationTime) const {

    if (data.Data == nullptr)
        return "";

    auto start = high_resolution_clock::now();

    regex title_regex("<title>[^<]*</title>");

    smatch match;
    if (regex_search(*(data.Data), match, title_regex)) {
        string titleRaw = match.str();

        auto stop = high_resolution_clock::now();

        auto duration = duration_cast<microseconds>(stop - start);
        computationTime += duration.count();

        return std::move(regex_replace(titleRaw, std::regex("<title>|</title>"), ""));
    }

    return "";
}

vector<string> Crawler::FindLinks(Poco::URI& baseURL, DataContext& data, size_t& computationTime) {
    
    if(data.Data == nullptr)
        return vector<string>(0);

    if(*(data.Data) == "")
        return vector<string>(0);

    string hostUrl = baseURL.getScheme() + "://" + baseURL.getHost();
    LinksFinder finder(*(data.Data), std::make_unique<SimpleHrefSearchAlgorithm>(hostUrl));
    auto start = high_resolution_clock::now();

    auto searchRes = std::move(finder.Search());

    auto stop = high_resolution_clock::now();

    auto duration = duration_cast<microseconds>(stop - start);
    computationTime += duration.count();

    return searchRes;
}


void Crawler::PrintDataToOutput(const UrlValidationResults& baseUrl, const string& title, const vector<UrlValidationResults>& outgoingLinks, const size_t computationTime) const {

    json outputData;
    outputData["baseUrl"] = baseUrl.URI.toString();
    outputData["title"] = title;
    outputData["crawlTime"] = computationTime;
    outputData["links"] = outgoingLinks;
    outputData["errors"] = baseUrl.Errors;

    string outputStr = to_string(outputData);

    _outputStream.write(outputStr.c_str(), outputStr.length());

    _outputStream.flush();
}