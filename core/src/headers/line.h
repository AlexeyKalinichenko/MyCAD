#ifndef __LINE_H__
#define __LINE_H__

#include "point.h"

class Line
{
private:
    Point _node1;
    Point _node2;

public:
    Line();
    Line(Point p1, Point p2);
};

#endif //__LINE_H__