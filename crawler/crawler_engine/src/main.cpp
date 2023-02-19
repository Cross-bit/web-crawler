#include <iostream>
#include <string>
#include <unordered_set>
#include "Crawler/Crawler.h"
#include "../External/includes/nlohmann/json.hpp"
#include <regex>

using json = nlohmann::json;

using namespace std::chrono;
using namespace std;

int main(int argv, char** argc) {


    string url = "https://en.cppreference.com/w"; // argv >= 1 ? argc[1] : "" //https://geeksforgeeks.org/ // todo: rm test
    //string url = (argv >= 2 ? argc[1] : "");
    string regexBoundary = R"(https://(www.)?en.cppreference.com/w/cpp/numeric/\w*)"; // argv == 2 ? argc[2] : ""

    //string regexBoundary = (argv == 3 ? argc[2] : "");
    /*std::cout << regexBoundary << endl;
    return 0;*/
    Crawler crawler(std::cout, url, regexBoundary);


    unordered_set<string> validExtensions({"html", "php"});

    crawler.SetValidExtensions(validExtensions);

    crawler.UpdateLoop();


    return 0;
}


