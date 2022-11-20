#include "headers/definitions.h"
#include "headers/document.h"
#include "headers/line.h"
#include "headers/point.h"
#include <iostream>

using namespace std;

int main()
{
    Color c1;
    c1.red = 0.1;
    c1.green = 0.2;
    c1.blue = 0.3;

    Color c2;
    c2.red = 0.4;
    c2.green = 0.5;
    c2.blue = 0.6;

    Color c3;
    c3.red = 0.7;
    c3.green = 0.8;
    c3.blue = 0.9;
    
    ColorTheme ct;
    ct.objects = c1;
    ct.highlight = c2;
    ct.nodes = c3;
    
    StyleData sd;
    sd.theme = ct;
    sd.thickness = 0.1;
    sd.nodesMode = true;

    Line l1(Point(-5, 1), Point(5, 1));
    Line l2(Point(-5, 2), Point(5, 2));
    Line l3(Point(-5, 3), Point(5, 3));

    StorageData data;
    data.lines = { l1, l2, l3 };

    Document doc(sd);
    doc.Load(data);
    doc.SetHighlightedObjects({1});
    RenderingData rd = doc.GetRenderingData();

    return 0;
}