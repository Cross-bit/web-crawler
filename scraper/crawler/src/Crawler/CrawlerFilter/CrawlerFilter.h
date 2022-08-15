//
// Created by kriz on 10.08.2022.
//

#ifndef CRAWLER_CRAWLERFILTER_H
#define CRAWLER_CRAWLERFILTER_H

#include <iostream>
#include <string>
#include <vector>
#include <vector>
#include <unordered_set>
#include "../../../External/includes/Poco/URI.h"

enum FilterErrors { OK, REGEX, EXTENSION, INVALID_URI };

struct  UrlFilterResults {
    Poco::URI URI;
    std::vector<FilterErrors> Errors;
};

class CrawlerFilter {
public:
    CrawlerFilter(std::vector<std::string> linksToFilter,
                  const std::unordered_set<std::string>& allowedExtensions,
                  const std::string& regexBoundary);
    std::vector<UrlFilterResults>& FilterLinks();

private:
    std::vector<std::string> _linksToFilter;
    std::vector<UrlFilterResults> _filterResult;
    const std::unordered_set<std::string>& _allowedExtensions;
    const std::string& _regexBoundary;

    bool CheckRegexBoundary(const std::string& url) const;

    bool CheckExtension(const Poco::URI& url) const;
};


#endif //CRAWLER_CRAWLERFILTER_H
