#include "headers/core_api.h"

Session * pSession = nullptr;

int open_session()
{
	pSession = new Session();
	return 0;
}

int close_session()
{
	delete pSession;
	pSession = nullptr;
	return 0;
}

int open_document(Document::Color objectColor, Document::Color nodeColor,
        float thickness, bool nodesMode, Document::StorageData data)
{
	return pSession->OpenDocument(objectColor, nodeColor, thickness, nodesMode, data);
}

Document::StorageData close_document(DocumentId id)
{
	return pSession->CloseDocument(id);
}

int set_color_theme(DocumentId id, Document::Color objects, Document::Color nodes)
{
	auto doc = pSession->GetDocument(id);
	doc.SetColorTheme(objects, nodes);
	
	return 0;
}

int set_thickness(DocumentId id, float thickness)
{
	auto doc = pSession->GetDocument(id);
	doc.SetThickness(thickness);
	return 0;
}

int set_nodes_mode(DocumentId id, bool mode)
{
	auto doc = pSession->GetDocument(id);
	doc.SetNodesMode(mode);
	return 0;
}

Document::Info get_document_info(DocumentId id)
{
	auto doc = pSession->GetDocument(id);
	return doc.GetDocumentInfo();
}

Document::RenderingData get_rendering_data(DocumentId id)
{
	auto doc = pSession->GetDocument(id);
	return doc.GetDataForRendering();
}

int add_object(DocumentId id, Line object)
{
	auto base = pSession->GetDocument(id).GetBase();
	return base.AddObject(object);
}

int remove_object(DocumentId id, int objectId)
{
	auto base = pSession->GetDocument(id).GetBase();
	base.RemoveObject(objectId);

	return 0;
}

int undo(DocumentId id)
{
	auto base = pSession->GetDocument(id).GetBase();
	base.Undo();

	return 0;
}

int redo(DocumentId id)
{
	auto base = pSession->GetDocument(id).GetBase();
	base.Redo();

	return 0;
}

int commit(DocumentId id)
{
	auto base = pSession->GetDocument(id).GetBase();
	base.Commit();

	return 0;
}
