//
// Created by kriz on 01.08.2022.
//

#ifndef CRAWLER_SEARCHALGORITHM_H
#define CRAWLER_SEARCHALGORITHM_H
#include <iostream>
#include <vector>
#include <string>

class SearchAlgorithm{
public:
    std::vector<std::string> virtual SearchForLinks(const std::string& haystack)=0;
};

#endif //CRAWLER_SEARCHALGORITHM_H