#include "headers/line.h"
#include <cmath>

Line::Line()
{
    _node1 = Point();
    _node2 = Point();
}

Line::Line(Point p1, Point p2)
{
    _node1 = p1;
    _node2 = p2;
}

void Line::SetNode(LineTopology index, Point point)
{
    if (index == LineTopology::StartNode)
        _node1 = point;
    else if (index == LineTopology::EndNode)
        _node2 = point;
}

Point Line::GetNode(LineTopology index)
{
    Point result;

    if (index == LineTopology::StartNode)
        result = _node1;
    else if (index == LineTopology::EndNode)
        result = _node2;

    return result;
}

std::pair<Point, Point> Line::GetNodes() const
{
    return std::make_pair(_node1, _node2);
}

std::vector<Point> Line::GetPointsForRendering(float thickness)
{
    //float angle = atan((_node2.y - _node1.y) / (_node2.x - _node1.x));
    float angle = GetAngle();

    float deltaX = (thickness / 2) * sin(angle);
    float deltaY = (thickness / 2) * cos(angle);

    Point p1(_node1.x - deltaX, _node1.y + deltaY);
    Point p2(_node1.x + deltaX, _node1.y - deltaY);
    Point p3(_node2.x - deltaX, _node2.y + deltaY);
    Point p4(_node2.x + deltaX, _node2.y - deltaY);
    Point p5(p2);
    Point p6(p3);

    return { p1, p2, p3, p4, p5, p6 };
}

float Line::GetLength()
{
    //return sqrt(pow((_node2.x - _node1.x), 2) - pow((_node2.y - _node1.y), 2));
    return abs((_node2.y - _node1.y) / sin(GetAngle()));
}

float Line::GetAngle()
{
    //return asin((_node2.y - _node1.y) / GetLength());
    return atan((_node2.y - _node1.y) / (_node2.x - _node1.x));
}

std::pair<bool, LineTopology> Line::IsPointInNodes(Point center, float radius)
{
    bool result = false;
    LineTopology nodeIndex = LineTopology::None;

    float length1 = sqrt(pow((center.x - _node1.x), 2) - pow((center.y - _node1.y), 2));
    float length2 = sqrt(pow((center.x - _node2.x), 2) - pow((center.y - _node2.y), 2));

    if (length1 <= radius)
    {
        result = true;
        nodeIndex = LineTopology::StartNode;
    }
    else if (length2 <= radius)
    {
        result = true;
        nodeIndex = LineTopology::EndNode;
    }

    return std::make_pair(result, nodeIndex);
}

bool Line::IsPointInLine(Point point)
{
    bool result = false;

    bool condition1 = ((point.x - _node1.x) / (_node2.x - _node1.x) == (point.y - _node1.y) / (_node2.y - _node1.y));

    bool condition2 = (((_node2.x >= _node1.x) && (point.x >= _node1.x) && (point.x <= _node2.x)) ||
        ((_node2.x < _node1.x) && (point.x >= _node2.x) && (point.x <= _node1.x)));

    bool condition3 = (((_node2.y >= _node1.y) && (point.y >= _node1.y) && (point.y <= _node2.y)) ||
        ((_node2.y < _node1.y) && (point.y >= _node2.y) && (point.y <= _node1.y)));

    if (condition1 && condition2 && condition3)
        result = true;

    return result;
}

bool operator==(const Line & op1, const Line & op2)
{
    auto nodes1 = op1.GetNodes();
    auto nodes2 = op2.GetNodes();

    return (nodes1.first == nodes2.first && nodes1.second == nodes2.second);
}
