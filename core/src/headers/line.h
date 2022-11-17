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

    std::pair<Point, Point> GetNodes() const;
    Point GetFirstNode();
    Point GetSecondNode();

    std::vector<Point> GetPointsForRendering(float thickness);

    float GetLength();
    float GetAngle();

    std::pair<bool, int> IsNodeInArea(Point center, float radius);

    bool IsPointInLine(Point point);
};

bool operator==(const Line & op1, const Line & op2);

#endif //__LINE_H__