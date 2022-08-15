//
// Created by kriz on 31.07.2022.
//

#ifndef CRAWLER_LINKSFINDER_H
#define CRAWLER_LINKSFINDER_H

#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
#include <memory>
#include "algorithms/SearchAlgorithm.h"

class LinksFinder {
public:
    LinksFinder(const std::string& haystack, std::unique_ptr<SearchAlgorithm>&& searchAlgorithm);

    virtual ~LinksFinder() {}

    virtual std::vector<std::string> Search();

private:
    const std::string & _haystack;

    std::unique_ptr<SearchAlgorithm> _searchAlgo;
};


#endif //CRAWLER_LINKSFINDER_H
