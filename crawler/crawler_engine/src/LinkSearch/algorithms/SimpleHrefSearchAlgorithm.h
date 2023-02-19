//
// Created by kriz on 14.08.2022.
//

#ifndef CRAWLER_SIMPLEHREFSEARCHALGORITHM_H
#define CRAWLER_SIMPLEHREFSEARCHALGORITHM_H

#include "./SearchAlgorithm.h"

class SimpleHrefSearchAlgorithm : public SearchAlgorithm
{
    public:
        SimpleHrefSearchAlgorithm(const std::string& hostDomain);
        std::vector<std::string> SearchForLinks(const std::string& haystack) override;

    private:
        const std::string& _hostDomain;

        const std::string _regexHrefPattern = R"(<a[^>]*href=["']([^"']*)["'])";

        std::string ProcessExtractedHref(std::string extracted);

        bool TryAddUrlToResult(std::vector<std::string>& result, std::string& urlToAdd) const;

        bool ValidateUrl(const std::string& urlToCheck) const;

        bool TryAutocompleteUrl(std::string& urlToComplete) const;
};


#endif //CRAWLER_SIMPLEHREFSEARCHALGORITHM_H