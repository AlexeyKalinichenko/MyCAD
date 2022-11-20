#ifndef __DEFINITIONS_H__
#define __DEFINITIONS_H__

#include <vector>
#include <string>

using DocumentId = int;
using ObjectId = int;

enum class Status { Ok, Cancel };
enum class LineTopology { None = -1, StartNode, EndNode, Body };

const float Pi = 3.14159265358979323846;

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
    std::string figure;
    unsigned offset;
    unsigned count;

    Index(std::string figure, unsigned offset, unsigned count)
    {
        this->figure = figure;
        this->offset = offset;
        this->count = count;
    }
};

struct Vertex
{
    float x;
    float y;
    float z;

    Vertex(float x, float y, float z)
    {
        this->x = x;
        this->y = y;
        this->z = z;
    }
};

struct RenderingData
{
    ColorTheme theme;
    float thickness;
    bool nodesMode;

    std::vector<Index> indices;
    std::vector<Vertex> vertices;
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
    std::vector<ObjectId> ids;
};

#endif //__DEFINITIONS_H__
