#include "headers/core_api.h"
#include <vector>

Session * pSession = nullptr;

std::vector<Line> StorageDataBuffer;
std::vector<ObjectId> ObjectsBuffer;
std::vector<Index> IndicesBuffer;
std::vector<Vertex> VerticesBuffer;

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

DocumentId mc_create_document(StyleData style)
{
	return pSession->CreateDocument(style);
}

DocumentId mc_open_document(StyleData style, StorageData data)
{
	StorageDataInt storageData;
	storageData.lines.assign(data.lines, data.lines + data.size);

	return pSession->OpenDocument(style, storageData);
}

StorageData mc_close_document(DocumentId docId)
{
	StorageDataInt storageInt = pSession->CloseDocument(docId);

	StorageDataBuffer = storageInt.lines;

	StorageData storage;
	storage.lines = StorageDataBuffer.data();
	storage.size = StorageDataBuffer.size();

	return storage;
}

Status mc_set_color_theme(DocumentId docId, ColorTheme theme)
{
	Document & document = pSession->GetDocument(docId);
	document.SetColorTheme(theme);

	return Status::Ok;
}

Status mc_set_thickness(DocumentId docId, float thickness)
{
	Document & document = pSession->GetDocument(docId);
	document.SetThickness(thickness);
	return Status::Ok;
}

Status mc_set_nodes_mode(DocumentId docId, bool mode)
{
	Document & document = pSession->GetDocument(docId);
	document.SetNodesMode(mode);
	return Status::Ok;
}

RenderingStatus mc_get_rendering_status(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	RenderingStatusInt statusInt = document.GetRenderingStatus();

	RenderingStatus status;
	status.needUpdate = statusInt.needUpdate;

	status.data.theme = statusInt.data.theme;
	status.data.thickness = statusInt.data.thickness;
	status.data.nodesMode = statusInt.data.nodesMode;

	IndicesBuffer = statusInt.data.indices;
	VerticesBuffer = statusInt.data.vertices;

	status.data.indices = IndicesBuffer.data();
	status.data.iSize = IndicesBuffer.size();

	status.data.vertices = VerticesBuffer.data();
    status.data.vSize = VerticesBuffer.size();

	return status;
}

Status mc_undo(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	Base & base = document.GetBase();

	base.Undo();
	document.MarkAsChanged();

	return Status::Ok;
}

Status mc_redo(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	Base & base = document.GetBase();

	base.Redo();
	document.MarkAsChanged();

	return Status::Ok;
}

Status mc_commit(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	Base & base = document.GetBase();

	base.Commit();
	document.MarkAsChanged();

	return Status::Ok;
}

ObjectId mc_create_line(DocumentId docId, Position start, Position end)
{
	Document & document = pSession->GetDocument(docId);
	Base & base = document.GetBase();
	Line line = Line(PositionToPoint(start), PositionToPoint(end));
	document.MarkAsChanged();

	return base.AddObject(line);
}

Status mc_edit_line(DocumentId docId, ObjectId objId, LineTopology index, Position pos)
{
	Document & document = pSession->GetDocument(docId);
	Base & base = document.GetBase();
	Line & line = base.GetObject(objId);
	line.SetNode(index, PositionToPoint(pos));
	document.MarkAsChanged();

	return Status::Ok;
}

Status mc_delete_line(DocumentId docId, ObjectId objId)
{
	Document & document = pSession->GetDocument(docId);
	Base & base = document.GetBase();

	base.RemoveObject(objId);
	document.MarkAsChanged();

	return Status::Ok;
}

Position mc_get_line_node(DocumentId docId, ObjectId objId, LineTopology index)
{
	Base & base = pSession->GetDocument(docId).GetBase();
	Line & line = base.GetObject(objId);
	auto point = line.GetNode(index);

	return PointToPosition(point);
}

float mc_get_line_length(DocumentId docId, ObjectId objId)
{
	Base & base = pSession->GetDocument(docId).GetBase();
	return base.GetObject(objId).GetLength();
}

float mc_get_line_angle(DocumentId docId, ObjectId objId)
{
	Base & base = pSession->GetDocument(docId).GetBase();
	return base.GetObject(objId).GetAngle();
}

LineTopology mc_is_line_under_cursor(DocumentId docId, ObjectId objId, Position pos, float radius)
{
	LineTopology index = LineTopology::None;

	Base & base = pSession->GetDocument(docId).GetBase();
	Line & line = base.GetObject(objId);

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
	Base & base = pSession->GetDocument(docId).GetBase();
	std::vector<ObjectId> objects = base.GetObjects();

	ObjectsBuffer = objects;

	Objects result;
	result.data = ObjectsBuffer.data();
	result.size = ObjectsBuffer.size();

	return result;
}

Status mc_highlight_object(DocumentId docId, ObjectId objId)
{
	std::vector<ObjectId> objects;
	objects.push_back(objId);

	pSession->GetDocument(docId).SetHighlightedObjects(objects);

	return Status::Ok;
}
