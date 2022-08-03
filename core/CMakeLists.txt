cmake_minimum_required(VERSION 3.5.1)
set(CMAKE_CXX_STANDARD 11)

project(core)

include_directories(${CMAKE_CURRENT_BINARY_DIR} ${CMAKE_CURRENT_SOURCE_DIR}/headers/)
set(SOURCE_LIB funcs.cpp api.cpp)

add_library(${PROJECT_NAME} SHARED ${SOURCE_LIB})