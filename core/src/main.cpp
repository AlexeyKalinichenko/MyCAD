#include "headers/definitions.h"
#include "headers/core_api.h"
#include "headers/document.h"
#include "headers/line.h"
#include "headers/point.h"
#include <iostream>

using namespace std;

int main()
{
    float objects[3] { 0.1, 0.2, 0.3 };
    float highlight[3] { 0.4, 0.5, 0.6 };
    float nodes[3] { 0.7, 0.8, 0.9 };

    ColorThemeExt ct;
    ct.objects = objects;
    ct.highlight = highlight;
    ct.nodes = nodes;

    StyleDataExt sd;
    sd.objects = objects;
    sd.highlight = highlight;
    sd.nodes = nodes;
    sd.thickness = 0.1;
    sd.nodesMode = true;

    mc_open_session();
    DocumentId d1 = mc_create_document(sd);

    mc_set_color_theme(d1, ct);
    mc_set_thickness(d1, 0.15);
    mc_set_nodes_mode(d1, true);

    ObjectId l1 = mc_create_line(d1, PointToPosition(Point(1, 1)), PointToPosition(Point(5, 5)));
    ObjectId l2 = mc_create_line(d1, PointToPosition(Point(1, 2)), PointToPosition(Point(5, 2)));
    ObjectId l3 = mc_create_line(d1, PointToPosition(Point(1, 5)), PointToPosition(Point(5, 5)));

    mc_commit(d1);
    
    mc_edit_line(d1, l2, LineTopology::StartNode, PointToPosition(Point(10, 10)));
    mc_delete_line(d1, l3);

    Position pos1 = mc_get_line_node(d1, l2, LineTopology::StartNode);

    float length = mc_get_line_length(d1, l1);
    float ang1e = mc_get_line_angle(d1, l1);

    LineTopology top1 = mc_is_line_under_cursor(d1, l1, PointToPosition(Point(3, 3)), 0.5);

    Objects objs = mc_get_all_objects(d1);

    mc_highlight_object(d1, l1);

    mc_commit(d1);

    RenderingStatusExt rd1 = mc_get_rendering_status(d1);

    StorageDataExt sd1 = mc_close_document(d1);

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

    StorageDataExt sd2 = mc_close_document(d3);

    mc_close_session();

    return 0;
}
