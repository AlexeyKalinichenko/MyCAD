#include "headers/document.h"
#include <algorithm>

Document::Document() : _needToUpdate(true), _thickness(0.0f), _nodesMode(false) {}

Document::Document(const StyleData & style) : _needToUpdate(true)
{
    _theme = style.theme;
    _thickness = style.thickness;
    _nodesMode = style.nodesMode;
}

void Document::SetColorTheme(const ColorTheme & theme)
{
    _theme = theme;
    _needToUpdate = true;
}

void Document::SetThickness(float thickness)
{
    _thickness = thickness;
    _needToUpdate = true;
}

void Document::SetNodesMode(bool mode)
{
    _nodesMode = mode;
    _needToUpdate = true;
}

void Document::Load(const StorageDataInt & data)
{
    _base.Load(data.lines);
}

StorageDataInt Document::Save()
{
    StorageDataInt data;
    data.lines = _base.Upload();

    return data;
}

Base & Document::GetBase()
{
    return _base;
}

void Document::SetHighlightedObjects(const std::vector<ObjectId> & objects)
{
    _highlighted = objects;
    _needToUpdate = true;
}

RenderingDataInt Document::GetRenderingData()
{
    RenderingDataInt data;

    data.theme = _theme;
    data.thickness = _thickness;
    data.nodesMode = _nodesMode;

    auto ids = _base.GetObjects();

    for (auto id = ids.begin(); id != ids.end(); ++id)
    {
        if (std::find(_highlighted.begin(), _highlighted.end(), *id) != _highlighted.end())
            continue;

        auto points = _base.GetObject(*id).GetPointsForRendering(_thickness);
        for (auto point = points.begin(); point != points.end(); ++point)
            data.vertices.push_back(CreateVertex(point->x, point->y, 0.0f));
    }

    unsigned triangleVerticesCount = data.vertices.size();
    data.indices.push_back(CreateIndex(Figures::Triangles, 0, triangleVerticesCount));

    unsigned highlightedTriangleVerticesCount = _highlighted.size() * 6;
    if (!_highlighted.empty())
    {
        for (auto it = _highlighted.begin(); it != _highlighted.end(); ++it)
        {
            auto points = _base.GetObject(*it).GetPointsForRendering(_thickness);
            for (auto point = points.begin(); point != points.end(); ++point)
                data.vertices.push_back(CreateVertex(point->x, point->y, 0.0f));
        }

        data.indices.push_back(CreateIndex(Figures::Triangles, triangleVerticesCount, highlightedTriangleVerticesCount));

        _highlighted.clear();
    }

    if (_nodesMode)
    {
        for (auto id = ids.begin(); id != ids.end(); ++id)
        {
            auto nodes = _base.GetObject(*id).GetNodes();
            data.vertices.push_back(CreateVertex(nodes.first.x, nodes.first.y, 0.0));
            data.vertices.push_back(CreateVertex(nodes.second.x, nodes.second.y, 0.0));
        }

        data.indices.push_back(CreateIndex(Figures::Points, triangleVerticesCount + highlightedTriangleVerticesCount,
            data.vertices.size() - triangleVerticesCount - highlightedTriangleVerticesCount));
    }

    return data;
}

RenderingStatusInt Document::GetRenderingStatus()
{
    RenderingStatusInt result;
    result.data = GetRenderingData();

    if (_needToUpdate)
    {
        result.needUpdate = true;
        _needToUpdate = false;
    }
    else
    {
        result.needUpdate = false;
    }

    return result;
}

void Document::MarkAsChanged()
{
    _needToUpdate = true;
}

Index CreateIndex(Figures figure, unsigned offset, unsigned count)
{
    Index index;
    index.figure = figure;
    index.offset = offset;
    index.count = count;

    return index;
}

Vertex CreateVertex(float x, float y, float z)
{
    Vertex index;
    index.x = x;
    index.y = y;
    index.z = z;

    return index;
}
