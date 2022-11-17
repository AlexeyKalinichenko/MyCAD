#ifndef __API_H__
#define __API_H__

#include "definitions.h"
#include "session.h"
#include "document.h"
#include "line.h"

extern "C" int open_session();
extern "C" int close_session();

extern "C" DocumentId open_document(Document::Color objectColor, Document::Color nodeColor,
        float thickness, bool nodesMode, Document::StorageData data);
extern "C" Document::StorageData close_document(DocumentId id);

extern "C" int set_color_theme(DocumentId id, Document::Color objects, Document::Color nodes);
extern "C" int set_thickness(DocumentId id, float thickness);
extern "C" int set_nodes_mode(DocumentId id, bool mode);

extern "C" Document::Info get_document_info(DocumentId id);
extern "C" Document::RenderingData get_rendering_data(DocumentId id);

extern "C" int add_object(DocumentId id, Line object);
extern "C" int remove_object(DocumentId id, int objectId);

extern "C" int undo(DocumentId id);
extern "C" int redo(DocumentId id);
extern "C" int commit(DocumentId id);

#endif //__API_H__
