//
// Created by kriz on 07.08.2022.
//

#ifndef CRAWLER_TRIMHELPER_H
#define CRAWLER_TRIMHELPER_H

#include <iostream>
#include <string>


class TrimHelper {
public:

    static inline const std::string WHITESPACE = " \n\r\t\f\v";

    static inline std::string ltrim(const std::string &inputStr, char trimTo = ' ')
    {
        size_t start = inputStr.find_first_not_of(trimTo == ' ' ? WHITESPACE : std::string(1, trimTo));
        return (start == std::string::npos) ? "" : inputStr.substr(start);
    }

    static inline std::string rtrim(const std::string &inputStr, char trimTo = ' ')
    {
        size_t end = inputStr.find_last_not_of(trimTo == ' ' ? WHITESPACE : std::string(1, trimTo));
        return (end == std::string::npos) ? "" : inputStr.substr(0, end + 1);
    }

    static inline std::string trim(const std::string &inputStr, char trimTo = ' ') {
        return rtrim(ltrim(inputStr, trimTo), trimTo);
    }
};


#endif //CRAWLER_TRIMHELPER_H
