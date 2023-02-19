//
// Created by kriz on 31.07.2022.
//

#ifndef CRAWLER_SIMPLESEARCHALGORITHM_H
#define CRAWLER_SIMPLESEARCHALGORITHM_H

#include "SearchAlgorithm.h"

class SimpleSearchAlgorithm : public SearchAlgorithm {
public:
    std::vector<std::string> SearchForLinks(const std::string& haystack) override;
private:

    const std::string _regexUrlPattern = R"((\https?:\/\/)[-a-zA-Z0-9:@;?&=\/%\+\.\*!'\(\),\$_\{\}\^~\[\]`#|]+)";
};


#endif //CRAWLER_SIMPLESEARCHALGORITHM_H
