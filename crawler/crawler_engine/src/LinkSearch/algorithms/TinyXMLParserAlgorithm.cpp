//
// Created by kriz on 13.08.2022.
//

#include "TinyXMLParserAlgorithm.h"
#include "regex"
//#include
using namespace std;
using namespace tinyxml2;

TinyXMLParserAlgorithm::TinyXMLParserAlgorithm(const std::string &hostBaseUrl) : _hostDomain(hostBaseUrl)
{ }

bool TinyXMLParserAlgorithm::TryAddUrlToResult(vector<string>& result, string& urlToAdd) const {

    if (!ValidateUrl(urlToAdd)){
        if (TryAutocompleteUrl(urlToAdd)) {
            result.push_back(urlToAdd);
            return true;
        }
    }
    else {
        result.push_back(urlToAdd);
        return true;
    }

    return false;
}

std::vector<std::string> TinyXMLParserAlgorithm::SearchForLinks(const std::string &haystack) {

    vector<string> result;

    XMLDocument doc;
    doc.Parse(haystack.c_str(), haystack.length());
    XMLElement* element = doc.RootElement();

    if(element == NULL)
        return result;

    _dfsStack.push(element);
    while (!_dfsStack.empty()) {
        XMLElement* current = _dfsStack.top();
        _dfsStack.pop();

        if (strcmp(current->Name(), "a") == 0) {
            string hrefValue = current->Attribute("href");
            TryAddUrlToResult(result, hrefValue);
        }

        // add child elements
        for (tinyxml2::XMLElement* child = current->FirstChildElement(); child != NULL; child = child->NextSiblingElement()) {
            _dfsStack.push(child);
        }
    }


    return result;

}

bool TinyXMLParserAlgorithm::TryAutocompleteUrl(std::string& urlToComplete) const {

    if (urlToComplete[0] != '/') // invalid relative in the first place...
        return false;
    urlToComplete = _hostDomain + urlToComplete;

    return ValidateUrl(urlToComplete);

}

bool TinyXMLParserAlgorithm::ValidateUrl(const std::string& urlToCheck) const {

    std::string validationPatt = "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";
    //src.: https://www.regextester.com/94502

    regex urlRe(validationPatt);

    return regex_match(urlToCheck, urlRe);
};