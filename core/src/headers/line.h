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
    Line() = default;
    Line(Point p1, Point p2);

    void SetNode(LineTopology index, const Point & point);
    Point GetNode(LineTopology index);
    std::pair<Point, Point> GetNodes() const;

    std::vector<Point> GetPointsForRendering(float thickness);

    float GetLength();
    float GetAngle();

    std::pair<bool, LineTopology> IsPointInNodes(const Point & center, float radius);

    bool IsPointInLine(const Point & point);
};

bool operator==(const Line & op1, const Line & op2);

#endif //__LINE_H__
