#include "headers/definitions.h"
#include "headers/core_api.h"
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

    mc_open_session();
    DocumentId d1 = mc_create_document(sd);

    mc_set_color_theme(d1, ct);
    mc_set_thickness(d1, 0.15);
    mc_set_nodes_mode(d1, true);

    ObjectId l1 = mc_create_line(d1, PointToPosition(Point(1, 1)), PointToPosition(Point(5, 1)));
    ObjectId l2 = mc_create_line(d1, PointToPosition(Point(1, 2)), PointToPosition(Point(5, 2)));
    ObjectId l3 = mc_create_line(d1, PointToPosition(Point(1, 5)), PointToPosition(Point(5, 5)));

    mc_commit(d1);
    
    mc_edit_line(d1, l1, LineTopology::StartNode, PointToPosition(Point(10, 10)));
    mc_delete_line(d1, l3);

    Position pos1 = mc_get_line_node(d1, l2, LineTopology::StartNode);

    float len1 = mc_get_line_length(d1, l1);
    float ang1 = mc_get_line_angle(d1, l1);

    LineTopology top1 = mc_is_line_under_cursor(d1, l1, PointToPosition(Point(3, 1)), 0.5);

    Objects objs = mc_get_all_objects(d1);

    mc_highlight_object(d1, l1);

    mc_commit(d1);

    RenderingStatus rd1 = mc_get_rendering_status(d1);

    StorageData sd1 = mc_close_document(d1);

    DocumentId d2 = mc_open_document(sd, sd1);
    DocumentId d3 = mc_open_document(sd, sd1);

    ObjectId l4 = mc_create_line(d3, PointToPosition(Point(2, 2)), PointToPosition(Point(3, 3)));
    mc_commit(d3);

    ObjectId l5 = mc_create_line(d3, PointToPosition(Point(3, 3)), PointToPosition(Point(4, 4)));
    mc_commit(d3);

    mc_undo(d3);
    mc_redo(d3);
    mc_undo(d3);

    ObjectId l6 = mc_create_line(d3, PointToPosition(Point(1, 1)), PointToPosition(Point(10, 10)));
    mc_commit(d3);

    StorageData sd2 = mc_close_document(d3);

    mc_close_session();

    return 0;
}
