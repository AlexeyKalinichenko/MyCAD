#include "headers/line.h"

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

std::vector<Point> Line::GetPointsForRendering(Thickness thickness)
{
    // todo

    return std::vector<Point>();
}