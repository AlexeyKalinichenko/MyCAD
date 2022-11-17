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

std::pair<Point, Point> Line::GetNodes()
{
    return std::make_pair(_node1, _node2);
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