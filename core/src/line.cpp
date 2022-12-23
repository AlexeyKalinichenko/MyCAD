#include "headers/line.h"
#include <cmath>
#include <algorithm>

Line::Line(Point p1, Point p2) : _node1(p1), _node2(p2) {}

void Line::SetNode(LineTopology index, const Point & point)
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
    return sqrt(pow((_node2.x - _node1.x), 2) + pow((_node2.y - _node1.y), 2));
}

float Line::GetAngle()
{
    float angle = 0.0f;

    if (GetLength() == 0)
        return angle;

    angle = atan(abs(_node2.y - _node1.y) / abs(_node2.x - _node1.x));

    if (_node2.y >= _node1.y && _node2.x < _node1.x)
    {
        angle = Pi - angle;
    }
    else if (_node2.y < _node1.y && _node2.x <= _node1.x)
    {
        angle = Pi + angle;
    }
    else if (_node2.y < _node1.y && _node2.x > _node1.x)
    {
        angle = 2 * Pi - angle;
    }

    return angle;
}

std::pair<bool, LineTopology> Line::IsPointInNodes(const Point & center, float radius)
{
    bool result = false;
    LineTopology nodeIndex = LineTopology::None;

    if (GetLength() == 0)
    {
        if (center.x == _node1.x && center.y == _node1.y)
        {
            result = true;
            nodeIndex = LineTopology::StartNode;
        }

        return std::make_pair(result, nodeIndex);
    }

    float length1 = sqrt(pow((center.x - _node1.x), 2) + pow((center.y - _node1.y), 2));
    float length2 = sqrt(pow((center.x - _node2.x), 2) + pow((center.y - _node2.y), 2));

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

bool Line::IsPointInLine(const Point & point)
{
    if (GetLength() == 0)
        return (point.x == _node1.x && point.y == _node1.y);

    bool xInside = (std::max(_node1.x, _node2.x) >= point.x) && (std::min(_node1.x, _node2.x) <= point.x);
    bool yInside = (std::max(_node1.y, _node2.y) >= point.y) && (std::min(_node1.y, _node2.y) <= point.y);

    if (Round1(_node1.x) == Round1(_node2.x))
        return (Round1(point.x) == Round1(_node1.x)) && yInside;

    if (Round1(_node1.y) == Round1(_node2.y))
        return ((Round1(point.y) == Round1(_node1.y))) && xInside;

    if (!xInside || !yInside)
        return false;

    float sideA = GetLength();
    float sideB = CalcDistance(_node1, point);
    float sideC = CalcDistance(_node2, point);

    float p = (sideA + sideB + sideC) / 2;
    float h = 2 * sqrt(p * (p - sideA) * (p - sideB) * (p - sideC)) / sideA;

    return (h <= 0.05);
}

bool operator==(const Line & op1, const Line & op2)
{
    auto nodes1 = op1.GetNodes();
    auto nodes2 = op2.GetNodes();

    return (nodes1.first == nodes2.first && nodes1.second == nodes2.second);
}
