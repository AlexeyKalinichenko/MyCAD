#ifndef __LINE_H__
#define __LINE_H__

#include "definitions.h"
#include "point.h"
#include <vector>
#include <utility>

class Line
{
private:
    Point _node1;
    Point _node2;

public:
    Line();
    Line(Point p1, Point p2);

    std::pair<Point, Point> GetNodes();

    std::vector<Point> GetPointsForRendering(Thickness thickness);
};

#endif //__LINE_H__