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

std::pair<Point, Point> Line::GetNodes() const
{
    return std::make_pair(_node1, _node2);
}

Point Line::GetFirstNode()
{
    return _node1;
}

Point Line::GetSecondNode()
{
    return _node2;
}

std::vector<Point> Line::GetPointsForRendering(float thickness)
{
    float angle = atan((_node2.y - _node1.y) / (_node2.x - _node1.x));

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
    return sqrt(pow((_node2.x - _node1.x), 2) - pow((_node2.y - _node1.y), 2));
}

float Line::GetAngle()
{
    return asin((_node2.y - _node1.y) / GetLength());
}

std::pair<bool, int> Line::IsNodeInArea(Point center, float radius)
{
    bool result = false;
    int nodeIndex = -1;

    float length1 = sqrt(pow((center.x - _node1.x), 2) - pow((center.y - _node1.y), 2));
    float length2 = sqrt(pow((center.x - _node2.x), 2) - pow((center.y - _node2.y), 2));

    if (length1 <= radius)
    {
        result = true;
        nodeIndex = 0;
    }
    else if (length2 <= radius)
    {
        result = true;
        nodeIndex = 1;
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
    auto pair1 = op1.GetNodes();
    auto pair2 = op2.GetNodes();

    return (pair1.first == pair2.first && pair1.second == pair2.second);
}
