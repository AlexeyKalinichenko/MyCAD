cmake_minimum_required(VERSION 3.5.1)
set(CMAKE_CXX_STANDARD 11)

project(core)

set(SOURCE_APP main.cpp document.cpp base.cpp line.cpp point.cpp session.cpp core_api.cpp utils.cpp)
set(SOURCE_LIB document.cpp base.cpp line.cpp point.cpp session.cpp core_api.cpp utils.cpp)

#add_executable(${PROJECT_NAME} ${SOURCE_APP})
add_library(${PROJECT_NAME} SHARED ${SOURCE_LIB})