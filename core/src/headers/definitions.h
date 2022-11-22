#ifndef __DEFINITIONS_H__
#define __DEFINITIONS_H__

#include <vector>
#include <string>

using DocumentId = int;
using ObjectId = int;

enum class Status { Ok, Cancel };
enum class LineTopology { None = -1, StartNode, EndNode, Body };
enum class Figures { Triangles, Points };

const float Pi = 3.14159265358979323846;

const unsigned HistoryLimit = 5;

struct Color
{
    float red = 0.0f;
    float green = 0.0f;
    float blue = 0.0f;
};

struct ColorTheme
{
    Color objects;
    Color highlight;
    Color nodes;
};

struct StyleData
{
    ColorTheme theme;
    float thickness;
    bool nodesMode;
};

struct Index
{
    Figures figure;
    unsigned offset;
    unsigned count;
};

struct Vertex
{
    float x;
    float y;
    float z;
};

struct RenderingDataInt
{
    ColorTheme theme;
    float thickness;
    bool nodesMode;

    std::vector<Index> indices;
    std::vector<Vertex> vertices;
};

struct RenderingData
{
    ColorTheme theme;
    float thickness;
    bool nodesMode;

    Index * indices;
    unsigned iSize;

    Vertex * vertices;
    unsigned vSize;
};

struct RenderingStatusInt
{
    bool needUpdate;
    RenderingDataInt data;
};

struct RenderingStatus
{
    bool needUpdate;
    RenderingData data;
};

struct Position
{
    float x;
    float y;
};

struct Objects
{
    ObjectId * data;
    unsigned size;
};

#endif //__DEFINITIONS_H__
