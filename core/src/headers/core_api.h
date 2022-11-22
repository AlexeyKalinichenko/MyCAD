#ifndef __API_H__
#define __API_H__

#define CORE_API extern "C"

#include "definitions.h"
#include "session.h"

CORE_API Status mc_open_session();
CORE_API Status mc_close_session();

CORE_API DocumentId mc_create_document(StyleData style);
CORE_API DocumentId mc_open_document(StyleData style, StorageData data);
CORE_API StorageData mc_close_document(DocumentId docId);

CORE_API Status mc_set_color_theme(DocumentId docId, ColorTheme theme);
CORE_API Status mc_set_thickness(DocumentId docId, float thickness);
CORE_API Status mc_set_nodes_mode(DocumentId docId, bool mode);

CORE_API RenderingStatus mc_get_rendering_status(DocumentId docId);

CORE_API Status mc_undo(DocumentId docId);
CORE_API Status mc_redo(DocumentId docId);
CORE_API Status mc_commit(DocumentId docId);

CORE_API ObjectId mc_create_line(DocumentId docId, Position start, Position end);
CORE_API Status mc_edit_line(DocumentId docId, ObjectId objId, LineTopology index, Position pos);
CORE_API Status mc_delete_line(DocumentId docId, ObjectId objId);

CORE_API Position mc_get_line_node(DocumentId docId, ObjectId objId, LineTopology index);
CORE_API float mc_get_line_length(DocumentId docId, ObjectId objId);
CORE_API float mc_get_line_angle(DocumentId docId, ObjectId objId);
CORE_API LineTopology mc_is_line_under_cursor(DocumentId docId, ObjectId objId, Position pos, float radius);

CORE_API Objects mc_get_all_objects(DocumentId docId);
CORE_API Status mc_highlight_object(DocumentId docId, ObjectId objId);

#endif //__API_H__
