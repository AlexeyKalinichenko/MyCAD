#ifndef __API_H__
#define __API_H__

#include "definitions.h"
#include "session.h"
#include "document.h"
#include "line.h"
#include <vector>

extern "C" int open_session();
extern "C" int close_session();

extern "C" DocumentId open_document(Document::ColorTheme theme,
        float thickness, bool nodesMode, Document::StorageData data);
extern "C" Document::StorageData close_document(DocumentId id);

extern "C" int set_color_theme(DocumentId id, Document::ColorTheme theme);
extern "C" int set_thickness(DocumentId id, float thickness);
extern "C" int set_nodes_mode(DocumentId id, bool mode);

extern "C" Document::Info get_document_info(DocumentId id);
extern "C" Document::RenderingData get_rendering_data(DocumentId id);

extern "C" int add_object(DocumentId id, Line object);
extern "C" int remove_object(DocumentId id, ObjectId objectId);

extern "C" int undo(DocumentId id);
extern "C" int redo(DocumentId id);
extern "C" int commit(DocumentId id);

extern "C" float get_line_angle(DocumentId docid, ObjectId objid);
extern "C" std::vector<Line> get_list_of_objects(DocumentId docid);
extern "C" ObjectId is_object_in_base(DocumentId docid, Line object);
extern "C" int highlight_object(DocumentId docid, ObjectId objectId);

#endif //__API_H__
