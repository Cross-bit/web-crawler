//
// Created by kriz on 10.08.2022.
//

#include "CrawlerFilter.h"
#include <regex>
using namespace std;

CrawlerFilter::CrawlerFilter(std::vector<std::string> linksToFilter,
                             const std::unordered_set<std::string>& allowedExtensions,
                             const std::string& regexBoundary
                             ) :
_regexBoundary(regexBoundary),
_allowedExtensions(allowedExtensions),
_linksToFilter(linksToFilter) { };

bool CrawlerFilter::CheckRegexBoundary(const std::string& url) const
{
    regex str_expr (_regexBoundary);


    return _regexBoundary == "" || (regex_match (url,str_expr));
}

bool CrawlerFilter::CheckExtension(const Poco::URI& url) const
{
    auto serverPath = url.getPath();
    size_t extPos = 0;

    if ((extPos = serverPath.find_last_of(".")) == string::npos) {
        return true; // nothing to check here => ok
    }

    string fExtensions = serverPath.substr(extPos + 1);

    return (fExtensions != "" && // no extension => ok
        _allowedExtensions.find(fExtensions) == _allowedExtensions.end()); // not in allowed => nok
}

std::vector<UrlFilterResults>& CrawlerFilter::FilterLinks() {

    auto it = _linksToFilter.begin();
    while (it != _linksToFilter.end()) {


        UrlFilterResults currentRes;

        try {
            Poco::URI parsedUri(*it);

            if(!CheckExtension(parsedUri))
                currentRes.Errors.push_back(FilterErrors::EXTENSION);

            if(!CheckRegexBoundary(parsedUri.toString()))
                currentRes.Errors.push_back(FilterErrors::REGEX);

            currentRes.URI = std::move(parsedUri);

            if (currentRes.Errors.empty()){
                currentRes.Errors.push_back(FilterErrors::OK);
                ++it;
            }
            else
                it = _linksToFilter.erase(it);


            _filterResult.emplace_back(currentRes);

        }
        catch (std::exception& e) { // do not suppose this will occure often
            currentRes.Errors.push_back(FilterErrors::INVALID_URI);
            it = _linksToFilter.erase(it);
            _filterResult.emplace_back(currentRes);
            continue;
        }
    }

    return _filterResult;
}