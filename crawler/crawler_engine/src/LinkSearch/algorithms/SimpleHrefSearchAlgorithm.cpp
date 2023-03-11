//
// Created by kriz on 14.08.2022.
//

#include "SimpleHrefSearchAlgorithm.h"
#include <regex>
#include "../../Utils/TrimHelper.h"

using namespace std;

SimpleHrefSearchAlgorithm::SimpleHrefSearchAlgorithm(const std::string& hostDomain) : _hostDomain(hostDomain) {}

string SimpleHrefSearchAlgorithm::ProcessExtractedHref(std::string extracted) {
    auto urlStart = extracted.find_first_of("\"'");

    extracted.substr(urlStart);
    auto urlWithoutHref = extracted.substr(urlStart + 1);

    auto urlEnd = urlWithoutHref.find_last_of("\"'");
    auto urlExtracted = urlWithoutHref.substr(0, urlEnd);
    auto urlCleaned = TrimHelper::trim(urlExtracted);

    if (urlCleaned[urlCleaned.length()-1] == '/' || urlCleaned[urlCleaned.length()-1] == '\\'){
        extracted = urlCleaned.substr(0, urlCleaned.length()-1);
        return extracted;
    }


    return urlCleaned;

}

bool SimpleHrefSearchAlgorithm::TryAddUrlToResult(vector<string>& result, string& urlToAdd) const {

    if (!ValidateUrl(urlToAdd)) {
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

bool SimpleHrefSearchAlgorithm::ValidateUrl(const std::string& urlToCheck) const {

    std::string validationPatt = "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)*[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";
    //src.: https://www.regextester.com/94502

    regex urlRe(validationPatt);

    return regex_match(urlToCheck, urlRe);
};

bool SimpleHrefSearchAlgorithm::TryAutocompleteUrl(std::string& urlToComplete) const {

    if (urlToComplete[0] != '/') // invalid relative in the first place...
        return false;
    urlToComplete = _hostDomain + urlToComplete;

    return ValidateUrl(urlToComplete);

}

vector<string> SimpleHrefSearchAlgorithm::SearchForLinks(const std::string& haystack) {

    vector<string> result;

    if (haystack.empty())
        return result;

    regex re(_regexHrefPattern);

    regex_iterator<string::const_iterator> it(haystack.begin(), haystack.end(), re);
    regex_iterator<string::const_iterator> end;

    for (; it != end; ++it){

        auto linkRaw = it->str();

        auto urlCleaned = ProcessExtractedHref(linkRaw);
        TryAddUrlToResult(result, urlCleaned);
    }
    
    return result;
}