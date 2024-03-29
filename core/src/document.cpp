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

void Document::Load(const std::vector<Line> & lines)
{
    _base.Load(lines);
}

std::vector<Line> Document::Save()
{
    return _base.Upload();;
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

RenderingDataInt Document::GetRenderingData(bool clearHighlightedObjects)
{
    RenderingDataInt data;

    data.needUpdate = GetRenderingStatus();
    data.theme = _theme;
    data.thickness = _thickness;
    data.nodesMode = _nodesMode;

    auto ids = _base.GetObjects();
    if (ids.empty())
        return data;

    for (auto id = ids.begin(); id != ids.end(); ++id)
    {
        if (std::find(_highlighted.begin(), _highlighted.end(), *id) != _highlighted.end())
            continue;

        auto points = _base.GetObject(*id).GetPointsForRendering(_thickness);
        for (auto point = points.begin(); point != points.end(); ++point)
            data.vertices.push_back(CreateVertex(point->x, point->y, 0.0f));
    }

    unsigned triangleVerticesCount = data.vertices.size();
    if (triangleVerticesCount > 0)
        data.indices.push_back(CreateIndex(Figures::Triangles, 0, triangleVerticesCount, false));

    unsigned highlightedTriangleVerticesCount = _highlighted.size() * 6;
    if (!_highlighted.empty())
    {
        for (auto it = _highlighted.begin(); it != _highlighted.end(); ++it)
        {
            auto points = _base.GetObject(*it).GetPointsForRendering(_thickness);
            for (auto point = points.begin(); point != points.end(); ++point)
                data.vertices.push_back(CreateVertex(point->x, point->y, 0.0f));
        }

        data.indices.push_back(CreateIndex(Figures::Triangles, triangleVerticesCount, highlightedTriangleVerticesCount, true));

        if (clearHighlightedObjects)
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
            data.vertices.size() - triangleVerticesCount - highlightedTriangleVerticesCount, false));
    }

    return data;
}

bool Document::GetRenderingStatus()
{
    bool result = false;

    if (_needToUpdate)
    {
        result = true;
        _needToUpdate = false;
    }

    return result;
}

void Document::MarkAsChanged()
{
    _needToUpdate = true;
}

Index CreateIndex(Figures figure, unsigned offset, unsigned count, bool highlight)
{
    Index index;
    index.figure = figure;
    index.offset = offset;
    index.count = count;
    index.highlight = highlight;

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

Cut LineToCut(const Line & line)
{
    auto pair = line.GetNodes();
    
    Cut cut;
    cut.start.x = pair.first.x;
    cut.start.y = pair.first.y;
    cut.end.x = pair.second.x;
    cut.end.y = pair.second.y;

    return cut;
}

Line CutToLine(const Cut & cut)
{
    Line line;
    line.SetNode(LineTopology::StartNode, Point(cut.start.x, cut.start.y));
    line.SetNode(LineTopology::EndNode, Point(cut.end.x, cut.end.y));

    return line;
}
