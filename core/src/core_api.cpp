#include "headers/core_api.h"
#include <vector>

Session * pSession = nullptr;

std::vector<Cut> StorageDataBuffer;
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

DocumentId mc_open_document(StyleData style, Cut * data, unsigned size)
{
	std::vector<Line> lines;

	for (int i = 0; i < size; ++i)
		lines.push_back(CutToLine(data[i]));

	return pSession->OpenDocument(style, lines);
}

unsigned mc_get_storage_buffer_size(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	std::vector<Line> lines = document.Save();
	return lines.size();
}

Cut * mc_close_document(DocumentId docId)
{
	std::vector<Line> lines = pSession->CloseDocument(docId);

	if (lines.empty())
		return nullptr;

	StorageDataBuffer.clear();

	for (auto it = lines.begin(); it != lines.end(); ++it)
		StorageDataBuffer.push_back(LineToCut(*it));

	return StorageDataBuffer.data();
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

RenderingBuffersSizes mc_get_rendering_buffers_sizes(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	RenderingDataInt dataInt = document.GetRenderingData(false);

	RenderingBuffersSizes sizes;
	sizes.indicesSize = dataInt.indices.size();
	sizes.verticesSize = dataInt.vertices.size();

	return sizes;
}

RenderingData mc_get_rendering_data(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	RenderingDataInt dataInt = document.GetRenderingData(true);

	RenderingData data;
	data.needUpdate = dataInt.needUpdate;

	data.theme = dataInt.theme;
	data.thickness = dataInt.thickness;
	data.nodesMode = dataInt.nodesMode;

	if (dataInt.indices.empty())
	{
		data.indices = nullptr;
		data.vertices = nullptr;
		return data;
	}
	
	IndicesBuffer = dataInt.indices;
	VerticesBuffer = dataInt.vertices;

	data.indices = IndicesBuffer.data();
	data.vertices = VerticesBuffer.data();

	return data;
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

unsigned mc_get_objects_buffer_size(DocumentId docId)
{
	Base & base = pSession->GetDocument(docId).GetBase();
	std::vector<ObjectId> objects = base.GetObjects();
	return objects.size();
}

ObjectId * mc_get_all_objects(DocumentId docId)
{
	Base & base = pSession->GetDocument(docId).GetBase();
	std::vector<ObjectId> objects = base.GetObjects();

	if (objects.empty())
		return nullptr;

	ObjectsBuffer = objects;

	return ObjectsBuffer.data();
}

Status mc_highlight_object(DocumentId docId, ObjectId objId)
{
	std::vector<ObjectId> objects;
	objects.push_back(objId);

	pSession->GetDocument(docId).SetHighlightedObjects(objects);

	return Status::Ok;
}
