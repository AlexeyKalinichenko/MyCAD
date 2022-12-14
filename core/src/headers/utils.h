#ifndef __UTILS_H__
#define __UTILS_H__

#include "definitions.h"
#include "point.h"

Position PointToPosition(Point point);
Point PositionToPoint(Position position);

float CalcDistance(Point p1, Point p2);

float Round1(float value);
float Round2(float value);

#endif //__UTILS_H__
