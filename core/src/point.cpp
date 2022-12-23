#include "headers/point.h"
#include <cmath>

Point::Point() : Point(0.0, 0.0) {}
Point::Point(float value1, float value2) : x(value1), y(value2) {}

bool operator==(const Point & op1, const Point & op2)
{
    return (op1.x == op2.x && op1.y == op2.y);
}
