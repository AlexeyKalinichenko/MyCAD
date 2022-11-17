#include "headers/document.h"
#include <iostream>

Document::Document()
{
    _thickness = 0.0f;
    _nodesMode = false;
}

Document::Document(Document::Color objectColor, Document::Color nodeColor, float thickness, bool nodesMode)
{
    _objectColor = objectColor;
    _nodeColor = nodeColor;
    _thickness = thickness;
    _nodesMode = nodesMode;
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

Document::RenderingData Document::GetDataForRendering()
{
    RenderingData data;

    data.objects = _objectColor;
    data.nodes = _nodeColor;
    data.thickness = _thickness;
    data.nodesMode = _nodesMode;

    auto objects = _base.GetObjects();

    for (auto object = objects.begin(); object != objects.end(); ++object)
    {
        auto points = object->GetPointsForRendering(_thickness);
        for (auto point = points.begin(); point != points.end(); ++point)
            data.vertices.emplace_back(point->x, point->y, 0.0f);
    }

    unsigned triangleVerticesCount = data.vertices.size();
    data.indices.emplace_back("triangles", 0, triangleVerticesCount);

    if (_nodesMode)
    {
        for (auto object = objects.begin(); object != objects.end(); ++object)
        {
            auto nodes = object->GetNodes();
            data.vertices.emplace_back(nodes.first.x, nodes.first.y, 0.0);
            data.vertices.emplace_back(nodes.second.x, nodes.second.y, 0.0);
        }

        data.indices.emplace_back("points", triangleVerticesCount, data.vertices.size() - triangleVerticesCount);
    }

    return data;
}
