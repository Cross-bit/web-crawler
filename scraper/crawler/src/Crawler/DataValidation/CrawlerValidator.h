//
// Created by kriz on 10.08.2022.
//

#ifndef CRAWLER_CRAWLERVALIDATOR_H
#define CRAWLER_CRAWLERVALIDATOR_H

#include <iostream>
#include <string>
#include <vector>
#include <vector>
#include <unordered_set>
#include "../../../External/includes/Poco/URI.h"


/**
 *
 */
enum ValidationCodes { OK, REGEX, EXTENSION, INVALID_URI };

/**
 * Encapsulates crawled URL and validation status codes.
 */
struct UrlValidationResults {
    Poco::URI URI;
    std::vector<ValidationCodes> Errors;
};

/**
 *
 * Validates crawled URLs based on given criteria. Generates vector of validation results
 *
 */
class CrawlerValidator {
public:
    CrawlerValidator(std::vector<std::string> linksToFilter,
                     const std::unordered_set<std::string>& allowedExtensions,
                     const std::string& regexBoundary);

    std::vector<UrlValidationResults>& FilterLinks();

private:
    std::vector<std::string> _linksToFilter;
    std::vector<UrlValidationResults> _filterResult;
    const std::unordered_set<std::string>& _allowedExtensions;
    const std::string& _regexBoundary;

    /**
     * Checks whether url meets custom regex criteria
     * @param url Url to check
     * @return True if is valid
     */
    bool CheckRegexBoundary(const std::string& url) const;

    /**
     * Checks whether the file extension located by url is valid
     * @param url Url to check
     * @return True if is valid
     */
    bool CheckExtension(const Poco::URI& url) const;

    /**
     * Checks whether parsed url is valid in the first place
     * @param url Url to check
     * @return True if is valid
     */
    bool IsURLWellFormed(const std::string& url) const;

};


#endif //CRAWLER_CRAWLERVALIDATOR_H
