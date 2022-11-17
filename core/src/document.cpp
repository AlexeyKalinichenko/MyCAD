#include "headers/document.h"
#include <algorithm>

Document::Document()
{
    _thickness = 0.0f;
    _nodesMode = false;
}

Document::Document(Document::ColorTheme theme, float thickness, bool nodesMode)
{
    _theme = theme;
    _thickness = thickness;
    _nodesMode = nodesMode;
}

void Document::SetColorTheme(ColorTheme theme)
{
    _theme = theme;
}

void Document::SetThickness(float thickness)
{
    _thickness = thickness;
}

void Document::SetNodesMode(bool mode)
{
    _nodesMode = mode;
}

void Document::Load(Document::StorageData data)
{
    _base.Load(data.lines);
}

Document::StorageData Document::Save()
{
    StorageData data;
    
    data.lines = _base.GetObjects();
    
    return data;
}

Base Document::GetBase()
{
    return _base;
}

Document::Info Document::GetDocumentInfo()
{
    Info info;

    info.theme = _theme;
    info.thickness = _thickness;
    info.nodesMode = _nodesMode;
    info.numberOfObjects = _base.GetObjects().size();

    return info;
}

void Document::SetHighlightedObjects(std::vector<ObjectId> objects)
{
    _highlighted = objects;
}

Document::RenderingData Document::GetDataForRendering()
{
    RenderingData data;

    data.theme = _theme;
    data.thickness = _thickness;
    data.nodesMode = _nodesMode;

    auto ids = _base.GetObjectIds();

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
        auto objects = _base.GetObjects();
        for (auto object = objects.begin(); object != objects.end(); ++object)
        {
            auto nodes = object->GetNodes();
            data.vertices.emplace_back(nodes.first.x, nodes.first.y, 0.0);
            data.vertices.emplace_back(nodes.second.x, nodes.second.y, 0.0);
        }

        data.indices.emplace_back("points", triangleVerticesCount + highlightedTriangleVerticesCount,
            data.vertices.size() - triangleVerticesCount - highlightedTriangleVerticesCount);
    }

    return data;
}
