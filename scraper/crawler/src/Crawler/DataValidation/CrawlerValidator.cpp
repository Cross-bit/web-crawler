//
// Created by kriz on 10.08.2022.
//

#include "CrawlerValidator.h"
#include <regex>
using namespace std;

CrawlerValidator::CrawlerValidator(std::vector<std::string> linksToFilter,
                                   const std::unordered_set<std::string>& allowedExtensions,
                                   const std::string& regexBoundary
                             ) :
_regexBoundary(regexBoundary),
_allowedExtensions(allowedExtensions),
_linksToFilter(linksToFilter) { };

bool CrawlerValidator::CheckRegexBoundary(const std::string& url) const
{
    regex str_expr (_regexBoundary);

    return _regexBoundary == "" || (regex_match (url,str_expr));
}

bool CrawlerValidator::CheckExtension(const Poco::URI& url) const
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

bool CrawlerValidator::IsURLWellFormed(const std::string &url) const {
    std::regex urlRegex("^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$");

    return std::regex_match(url, urlRegex);
}


std::vector<UrlValidationResults>& CrawlerValidator::FilterLinks() {
    auto it = _linksToFilter.begin();
    while (it != _linksToFilter.end()) {

        UrlValidationResults currentRes;

        if (!IsURLWellFormed(*it)) {
            currentRes.Errors.push_back(ValidationCodes::INVALID_URI);
            it = _linksToFilter.erase(it);
            _filterResult.emplace_back(currentRes);
            continue;
        }

        try {

            Poco::URI parsedUri(*it);

            if (!CheckExtension(parsedUri))
                currentRes.Errors.push_back(ValidationCodes::EXTENSION);

            if (!CheckRegexBoundary(parsedUri.toString()))
                currentRes.Errors.push_back(ValidationCodes::REGEX);

            currentRes.URI = std::move(parsedUri);

            if (currentRes.Errors.empty()) {
                currentRes.Errors.push_back(ValidationCodes::OK);
                ++it;
            }
            else
                it = _linksToFilter.erase(it);


            _filterResult.emplace_back(currentRes);

        }
        catch (std::exception& e) { // for extraordinary case, where IsURLWellFormed fails
            currentRes.Errors.push_back(ValidationCodes::INVALID_URI);
            it = _linksToFilter.erase(it);
            _filterResult.emplace_back(currentRes);
        }
    }

    return _filterResult;
}