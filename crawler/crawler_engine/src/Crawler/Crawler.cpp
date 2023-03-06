//
// Created by kriz on 31.07.2022.
//

#include "Crawler.h"
#include <memory>
#include <thread>
#include <algorithm>
#include <chrono>
#include <exception>
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

    while (_isRunning) {
        if (_currentRootURL == "") { // read next from input
            cin >> _currentRootURL >> _urlRegexFilter;
        }
        else {
            _outputStream << "<<<T_START>>>";
            _outputStream.flush();
            Crawl();
            _outputStream << "<<<T_END>>>";
        }
    }
    return true;
}

void Crawler::SetUrlVisited(const Poco::URI& urlToStore) const {
    if (_urlsProcessed->find(urlToStore.getHost()) == _urlsProcessed->end()) {
        auto urlPaths = make_unique<unordered_set<string>>();
        urlPaths->emplace(urlToStore.getPathEtc());
        _urlsProcessed->insert({ urlToStore.getHost(), std::move(urlPaths) });
    }
    else
        _urlsProcessed->at(urlToStore.getHost())->insert(urlToStore.getPathEtc());
}

bool Crawler::CheckIfUrlIsNew(const UrlValidationResults& urlData, bool& hostExists) const {
    return (urlData.Errors.size() == 1 && urlData.Errors[0] == ValidationCodes::OK) &&
           ((hostExists = (_urlsProcessed->find(urlData.URI.getHost()) == _urlsProcessed->end())) ||
            _urlsProcessed->at(urlData.URI.getHost())->find(urlData.URI.getPathEtc()) == _urlsProcessed->at(urlData.URI.getHost())->end());

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

    _urlsToProcess.emplace(rootUrl);

    while (!_urlsToProcess.empty()) {

        #pragma omp parallel for default(none)
        for (int i = 0; i < _urlsToProcess.size() /*std::min( (unsigned int)_urlsToProcess.size(), thread::hardware_concurrency() * 3)*/; i++) {
            Poco::URI currentURL;

            #pragma omp critical
            {
                currentURL = _urlsToProcess.front();
                _urlsToProcess.pop();
            };

            size_t duration = 0;
            vector<string> discoveredURLs = FindLinks(currentURL, duration);

            vector<UrlValidationResults> filterResult = FilterBannedUrls(discoveredURLs);

            #pragma omp critical
            {
                _outputStream << "<<<C_START>>>";
                _outputStream.flush();
                PrintDataToOutput(currentURL.toString(), filterResult, duration);
                _outputStream << "<<<C_END>>>";
                _outputStream.flush();
            };


            #pragma omp critical
            for (auto& urlData: filterResult) {
                bool hostExists = true;
                if (CheckIfUrlIsNew(urlData, hostExists) ) {
                    SetUrlVisited(urlData.URI);
                    _urlsToProcess.push(urlData.URI);
                }
            }
        }
    }
    _currentRootURL = "";
}

void Crawler::SetValidExtensions(const std::unordered_set<std::string>& bannedExtensions) {
    _allowedExtentions = bannedExtensions;
}

vector<UrlValidationResults> Crawler::FilterBannedUrls(std::vector<std::string>& urlsToFilter) const {
    CrawlerValidator linksFilter(urlsToFilter, _allowedExtentions, _urlRegexFilter);
    return std::move(linksFilter.FilterLinks());
}

vector<string> Crawler::FindLinks(Poco::URI& baseURL, size_t& computationTime) {
    auto data = _downloader.DownloadPageData(baseURL.toString());
    if(data->Data == nullptr)
        return vector<string>(0);

    if(*(data->Data) == "")
        return vector<string>(0);

    string hostUrl = baseURL.getScheme() + "://" + baseURL.getHost();
    LinksFinder finder(*(data->Data), std::make_unique<SimpleHrefSearchAlgorithm>(hostUrl));
    auto start = high_resolution_clock::now();

    auto searchRes = std::move(finder.Search());

    auto stop = high_resolution_clock::now();

    auto duration = duration_cast<microseconds>(stop - start);
    computationTime = duration.count();

    return searchRes;
}

void Crawler::PrintDataToOutput(const string& baseUrl, const vector<UrlValidationResults>& outgoingLinks, const size_t computationTime) const {

    json outputData;
    outputData["baseUrl"] = baseUrl;
    outputData["crawlTime"] = computationTime;
    outputData["links"] = outgoingLinks;

    string outputStr = to_string(outputData);

    _outputStream.write(outputStr.c_str(), outputStr.length());

    _outputStream.flush();
}