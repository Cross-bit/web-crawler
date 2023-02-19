//
// Created by kriz on 31.07.2022.
//

#include "LinksFinder.h"

using namespace std;

LinksFinder::LinksFinder(const string& haystack, std::unique_ptr<SearchAlgorithm>&& searchAlgorithm) :
_haystack(haystack), _searchAlgo(std::move(searchAlgorithm))
{ }

vector<string> LinksFinder::Search() {
    return move(_searchAlgo->SearchForLinks(_haystack));
}