#ifndef __DOCUMENT_H__
#define __DOCUMENT_H__

#include "definitions.h"
#include "base.h"
#include <string>

class Document
{
public:
    struct Color
    {
        float red = 0.0f;
        float green = 0.0f;
        float blue = 0.0f;
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
        Color objects;
        Color nodes;
        float thickness;
        bool nodesMode;

        std::vector<Index> indices;
        std::vector<Vertex> vertices;
    };

    struct StorageData
    {
        std::vector<Line> lines;
    };

private:
    Color _objectColor;
    Color _nodeColor;
    float _thickness;
    bool _nodesMode;

    Base _base;

public:
    Document();
    Document(Color objectColor, Color nodeColor, float thickness, bool nodesMode);

    void Load(StorageData data);
    StorageData Save();

    RenderingData GetDataForRendering();
};

#endif //__DOCUMENT_H__