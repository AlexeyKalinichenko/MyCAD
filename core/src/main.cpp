#include "headers/definitions.h"
#include "headers/line.h"
#include <iostream>

using namespace std;


int main()
{
    Line line(Point(1, 1), Point(5, 5));

    auto res = line.GetPointsForRendering(0.1);

    for (int i = 0; i < res.size(); ++i)
    {
        cout << res[i].x << " - " << res[i].y << endl;
    }



    bool check = true;

    //cout << "P3: " << p3.x << " " << p3.y << endl;

    return 0;
}