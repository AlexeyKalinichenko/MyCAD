#include "headers/point.h"

Point::Point() { x = 0.0; y = 0.0; }
Point::Point(float x, float y) { this->x = x; this->y = y; }

bool operator==(const Point & op1, const Point & op2)
{
    return (op1.x == op2.x && op1.y == op2.y);
}
