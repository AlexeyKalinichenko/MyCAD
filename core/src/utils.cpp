#include "headers/utils.h"
#include <cmath>

Position PointToPosition(Point point)
{
    Position pos;
    pos.x = point.x;
    pos.y = point.y;

    return pos;
}

Point PositionToPoint(Position position)
{
    return Point(position.x, position.y);;
}

float CalcDistance(Point p1, Point p2)
{
    return sqrt(pow((p2.x - p1.x), 2) + pow((p2.y - p1.y), 2));
}

float Round1(float value)
{
    return (round(value * 10) / 10);
}

float Round2(float value)
{
    return (round(value * 100) / 100);
}
