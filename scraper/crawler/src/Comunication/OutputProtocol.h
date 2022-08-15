//
// Created by kriz on 09.08.2022.
//

#ifndef CRAWLER_OUTPUTPROTOCOL_H
#define CRAWLER_OUTPUTPROTOCOL_H

#include <iostream>
#include <string>
#include <memory>


class OutputProtocol {
public:
    void InitializeNewDataChunk();

private:
    std::string data;
};


#endif //CRAWLER_OUTPUTPROTOCOL_H
