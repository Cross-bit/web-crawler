//
// Created by kriz on 31.07.2022.
//

#include "SimpleSearchAlgorithm.h"
#include <regex>
#include "../../Utils/TrimHelper.h"
using namespace std;
#include <regex>
#include "../../Utils/TrimHelper.h"


vector<string> SimpleSearchAlgorithm::SearchForLinks(const std::string& haystack) {

    vector<string> result;

    if(haystack.empty())
        return result;

    regex re(_regexUrlPattern);

    regex_iterator<string::const_iterator> it(haystack.begin(), haystack.end(), re);
    regex_iterator<string::const_iterator> end;


    for (; it != end; ++it){

        auto linkRaw = it->str();
        auto linkTrimmed = TrimHelper::rtrim(TrimHelper::trim(TrimHelper::trim(linkRaw, '"')), '/');

        result.push_back(linkTrimmed);
    }

    return result;
}