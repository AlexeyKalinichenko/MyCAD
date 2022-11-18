#include "headers/core_api.h"

Session * pSession = nullptr;

Status mc_open_session()
{
	pSession = new Session();
	return Status::Ok;
}

Status mc_close_session()
{
	delete pSession;
	pSession = nullptr;
	return Status::Ok;
}

DocumentId mc_open_document(StyleData style, StorageData data)
{
	return pSession->OpenDocument(style, data);
}

StorageData mc_close_document(DocumentId docId)
{
	return pSession->CloseDocument(docId);
}

Status mc_set_color_theme(DocumentId docId, ColorTheme theme)
{
	auto document = pSession->GetDocument(docId);
	document.SetColorTheme(theme);

	return Status::Ok;
}

Status mc_set_thickness(DocumentId docId, float thickness)
{
	auto document = pSession->GetDocument(docId);
	document.SetThickness(thickness);
	return Status::Ok;
}

Status mc_set_nodes_mode(DocumentId docId, bool mode)
{
	auto document = pSession->GetDocument(docId);
	document.SetNodesMode(mode);
	return Status::Ok;
}

RenderingData mc_get_rendering_data(DocumentId docId)
{
	auto document = pSession->GetDocument(docId);
	return document.GetDataForRendering();
}

Status mc_undo(DocumentId docId)
{
	auto base = pSession->GetDocument(docId).GetBase();
	base.Undo();

	return Status::Ok;
}

Status mc_redo(DocumentId docId)
{
	auto base = pSession->GetDocument(docId).GetBase();
	base.Redo();

	return Status::Ok;
}

Status mc_commit(DocumentId docId)
{
	auto base = pSession->GetDocument(docId).GetBase();
	base.Commit();

	return Status::Ok;
}

ObjectId mc_create_line(DocumentId docId, Position start, Position end)
{
	auto base = pSession->GetDocument(docId).GetBase();
	auto line = Line(PositionToPoint(start), PositionToPoint(end));

	return base.AddObject(line);
}

Status mc_edit_line(DocumentId docId, ObjectId objId, LineTopology index, Position pos)
{
	auto base = pSession->GetDocument(docId).GetBase();
	auto line = base.GetObject(objId);
	line.SetNode(index, PositionToPoint(pos));

	return Status::Ok;
}

Status mc_delete_line(DocumentId docId, ObjectId objId)
{
	auto base = pSession->GetDocument(docId).GetBase();
	base.RemoveObject(objId);

	return Status::Ok;
}

Position mc_get_line_node(DocumentId docId, ObjectId objId, LineTopology index)
{
	auto base = pSession->GetDocument(docId).GetBase();
	auto line = base.GetObject(objId);
	auto point = line.GetNode(index);

	return PointToPosition(point);
}

float mc_get_line_length(DocumentId docId, ObjectId objId)
{
	auto base = pSession->GetDocument(docId).GetBase();
	return base.GetObject(objId).GetLength();
}

float mc_get_line_angle(DocumentId docId, ObjectId objId)
{
	auto base = pSession->GetDocument(docId).GetBase();
	return base.GetObject(objId).GetAngle();
}

LineTopology mc_is_line_under_cursor(DocumentId docId, ObjectId objId, Position pos, float radius)
{
	LineTopology index = LineTopology::None;

	auto base = pSession->GetDocument(docId).GetBase();
	auto line = base.GetObject(objId);

	auto result = line.IsPointInNodes(PositionToPoint(pos), radius);

	if (result.first)
	{
		index = (result.second == LineTopology::StartNode) ? LineTopology::StartNode : LineTopology::EndNode;
	}
	else if (line.IsPointInLine(PositionToPoint(pos)))
	{
		index = LineTopology::Body;
	}

	return index;
}

Objects mc_get_all_objects(DocumentId docId)
{
	Objects result;

	auto base = pSession->GetDocument(docId).GetBase();
	result.ids = base.GetObjectIds();

	return result;
}

Status mc_highlight_object(DocumentId docId, ObjectId objId)
{
	std::vector<ObjectId> objects;
	objects.push_back(objId);

	pSession->GetDocument(docId).SetHighlightedObjects(objects);

	return Status::Ok;
}
