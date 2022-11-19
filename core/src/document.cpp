#include "headers/document.h"
#include <algorithm>

Document::Document()
{
    _needToUpdate = true;
    
    _thickness = 0.0f;
    _nodesMode = false;
}

Document::Document(StyleData style)
{
    _needToUpdate = true;
    
    _theme = style.theme;
    _thickness = style.thickness;
    _nodesMode = style.nodesMode;
}

void Document::SetColorTheme(ColorTheme theme)
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

void Document::Load(StorageData data)
{
    _base.Load(data.lines);
}

StorageData Document::Save()
{
    StorageData data;
    
    data.lines = _base.Upload();
    
    return data;
}

Base Document::GetBase()
{
    return _base;
}

void Document::SetHighlightedObjects(std::vector<ObjectId> objects)
{
    _highlighted = objects;
    _needToUpdate = true;
}

RenderingData Document::GetRenderingData()
{
    RenderingData data;

    data.theme = _theme;
    data.thickness = _thickness;
    data.nodesMode = _nodesMode;

    auto ids = _base.GetObjects();

    for (auto id = ids.begin(); id != ids.end(); ++id)
    {
        if (std::find(_highlighted.begin(), _highlighted.end(), *id) != _highlighted.end())
            break;

        auto points = _base.GetObject(*id).GetPointsForRendering(_thickness);
        for (auto point = points.begin(); point != points.end(); ++point)
            data.vertices.emplace_back(point->x, point->y, 0.0f);
    }

    unsigned triangleVerticesCount = data.vertices.size();
    data.indices.emplace_back("triangles", 0, triangleVerticesCount);

    unsigned highlightedTriangleVerticesCount = _highlighted.size();
    if (!_highlighted.empty())
    {
        for (auto it = _highlighted.begin(); it != _highlighted.end(); ++it)
        {
            auto points = _base.GetObject(*it).GetPointsForRendering(_thickness);
            for (auto point = points.begin(); point != points.end(); ++point)
                data.vertices.emplace_back(point->x, point->y, 0.0f);
        }

        data.indices.emplace_back("triangles", triangleVerticesCount, highlightedTriangleVerticesCount);

        _highlighted.clear();
    }

    if (_nodesMode)
    {
        for (auto id = ids.begin(); id != ids.end(); ++id)
        {
            auto nodes = _base.GetObject(*id).GetNodes();
            data.vertices.emplace_back(nodes.first.x, nodes.first.y, 0.0);
            data.vertices.emplace_back(nodes.second.x, nodes.second.y, 0.0);
        }

        data.indices.emplace_back("points", triangleVerticesCount + highlightedTriangleVerticesCount,
            data.vertices.size() - triangleVerticesCount - highlightedTriangleVerticesCount);
    }

    return data;
}

RenderingStatus Document::GetRenderingStatus()
{
    RenderingStatus result;
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
