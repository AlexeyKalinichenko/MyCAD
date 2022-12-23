#ifndef __POINT_H__
#define __POINT_H__

#include "definitions.h"

struct Point
{
    float x;
    float y;

    Point();
    Point(float x, float y);
};

bool operator==(const Point & op1, const Point & op2);

#endif //__POINT_H__
