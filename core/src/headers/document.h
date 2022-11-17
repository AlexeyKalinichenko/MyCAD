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

    struct ColorTheme
    {
        Color objects;
        Color highlight;
        Color nodes;
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

    struct StorageData
    {
        std::vector<Line> lines;
    };

    struct Info
    {
        ColorTheme theme;
        float thickness;
        bool nodesMode;
        int numberOfObjects;
    };

private:
    ColorTheme _theme;
    float _thickness;
    bool _nodesMode;

    std::vector<ObjectId> _highlighted;

    Base _base;

public:
    Document();
    Document(ColorTheme theme, float thickness, bool nodesMode);

    void SetColorTheme(ColorTheme theme);
    void SetThickness(float thickness);
    void SetNodesMode(bool mode);

    void Load(StorageData data);
    StorageData Save();

    Base GetBase();

    Info GetDocumentInfo();

    void SetHighlightedObjects(std::vector<ObjectId> objects);

    RenderingData GetDataForRendering();
};

#endif //__DOCUMENT_H__