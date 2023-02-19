//
// Created by kriz on 13.08.2022.
//

#ifndef CRAWLER_TINYXMLPARSERALGORITHM_H
#define CRAWLER_TINYXMLPARSERALGORITHM_H

#include <stack>
#include "./SearchAlgorithm.h"
#include "../../../External/includes/TinyXml/tinyxml2.h"

class TinyXMLParserAlgorithm : public SearchAlgorithm
{
public:
    TinyXMLParserAlgorithm(const std::string & hostBaseUrl);
    std::vector<std::string> SearchForLinks(const std::string& haystack) override;
private:
    const std::string& _hostDomain;
    std::stack<tinyxml2::XMLElement*> _dfsStack;

    bool TryAddUrlToResult(std::vector<std::string>& result, std::string& urlToAdd) const;

    bool TryAutocompleteUrl(std::string& urlToComplete) const;

    bool ValidateUrl(const std::string& toCheck) const;

};


#endif //CRAWLER_TINYXMLPARSERALGORITHM_H
