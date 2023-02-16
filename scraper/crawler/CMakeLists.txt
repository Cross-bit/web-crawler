cmake_minimum_required(VERSION 3.16)
project(crawler)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17 -fopenmp")

find_package(CURL REQUIRED)
add_executable(crawler src/main.cpp src/Crawler/Crawler.cpp src/Crawler/Crawler.h src/LinkSearch/LinksFinder.cpp src/LinkSearch/LinksFinder.h src/LinkSearch/algorithms/SimpleSearchAlgorithm.cpp src/LinkSearch/algorithms/SimpleSearchAlgorithm.h src/Downloader/DataDownloader.cpp src/Downloader/DataDownloader.h src/LinkSearch/algorithms/SearchAlgorithm.h src/Utils/TrimHelper.h src/Crawler/DataValidation/CrawlerValidator.cpp src/Crawler/DataValidation/CrawlerValidator.h src/LinkSearch/algorithms/TinyXMLParserAlgorithm.cpp src/LinkSearch/algorithms/TinyXMLParserAlgorithm.h src/LinkSearch/algorithms/SimpleHrefSearchAlgorithm.cpp src/LinkSearch/algorithms/SimpleHrefSearchAlgorithm.h)
target_link_libraries(crawler ${CMAKE_SOURCE_DIR}/External/lib/tinyxml2.cpp ${CMAKE_SOURCE_DIR}/External/includes/TinyXml/tinyxml2.h)

#target_link_libraries(crawler ${CMAKE_SOURCE_DIR}/External/lib/liblexbor_static.a)
find_path(BOOST_URL_INCLUDE_DIRS "boost/url.hpp" PATHS "${CMAKE_SOURCE_DIR}/External/lib")
find_library(BOOST_URL_LIBRARY NAMES libboost_url.a PATHS "${CMAKE_SOURCE_DIR}/External/lib")

#include_directories(${BOOST_URL_INCLUDE_DIRS})
#include_directories(${CMAKE_SOURCE_DIR}/External/includes)
#include_directories(${CMAKE_SOURCE_DIR}/External/includes/boost)
#target_link_libraries(your_target_name ${BOOST_URL_LIBRARY})


target_link_libraries(crawler CURL::libcurl)
target_link_libraries(crawler ${BOOST_URL_LIBRARY})
target_link_libraries(crawler ${CMAKE_SOURCE_DIR}/External/lib/libPocoFoundation.a)