#include "headers/core_api.h"
#include <vector>

Session * pSession = nullptr;

std::vector<float> StorageDataBuffer;
std::vector<ObjectId> ObjectsBuffer;
std::vector<float> RenderingColorsBuffer;
std::vector<unsigned> indicesBuffer;
std::vector<float> verticesBuffer;

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

DocumentId mc_create_document(StyleDataExt style)
{
	StyleData styleData;

	styleData.theme.objects.red = style.objects[0];
	styleData.theme.objects.green = style.objects[1];
	styleData.theme.objects.blue = style.objects[2];

	styleData.theme.highlight.red = style.highlight[0];
	styleData.theme.highlight.green = style.highlight[1];
	styleData.theme.highlight.blue = style.highlight[2];

	styleData.theme.nodes.red = style.nodes[0];
	styleData.theme.nodes.green = style.nodes[1];
	styleData.theme.nodes.blue = style.nodes[2];

	styleData.thickness = style.thickness;
	styleData.nodesMode = style.nodesMode;

	return pSession->CreateDocument(styleData);
}

DocumentId mc_open_document(StyleDataExt style, StorageDataExt data)
{
	StyleData styleData;

	styleData.theme.objects.red = style.objects[0];
	styleData.theme.objects.green = style.objects[1];
	styleData.theme.objects.blue = style.objects[2];

	styleData.theme.highlight.red = style.highlight[0];
	styleData.theme.highlight.green = style.highlight[1];
	styleData.theme.highlight.blue = style.highlight[2];

	styleData.theme.nodes.red = style.nodes[0];
	styleData.theme.nodes.green = style.nodes[1];
	styleData.theme.nodes.blue = style.nodes[2];

	styleData.thickness = style.thickness;
	styleData.nodesMode = style.nodesMode;

	StorageData storageData;

	for (int i = 0; i < data.size; ++i)
	{
		if (i == 0 || i % 4 == 0)
			storageData.lines.emplace_back(Point(data.lines[i], data.lines[i+1]),
				Point(data.lines[i+2], data.lines[i+3]));
		else
			continue;
	}

	return pSession->OpenDocument(styleData, storageData);
}

StorageDataExt mc_close_document(DocumentId docId)
{
	StorageData storage = pSession->CloseDocument(docId);

	StorageDataBuffer.clear();

	for (auto it = storage.lines.begin(); it != storage.lines.end(); ++it)
	{
		auto pair = it->GetNodes();
		StorageDataBuffer.push_back(pair.first.x);
		StorageDataBuffer.push_back(pair.first.y);
		StorageDataBuffer.push_back(pair.second.x);
		StorageDataBuffer.push_back(pair.second.y);
	}

	StorageDataExt storageExt;

	storageExt.lines = StorageDataBuffer.data();
	storageExt.size = StorageDataBuffer.size();

	return storageExt;
}

Status mc_set_color_theme(DocumentId docId, ColorThemeExt theme)
{
	Document & document = pSession->GetDocument(docId);
	
	ColorTheme colorTheme;

	colorTheme.objects.red = theme.objects[0];
	colorTheme.objects.green = theme.objects[1];
	colorTheme.objects.blue = theme.objects[2];

	colorTheme.highlight.red = theme.highlight[0];
	colorTheme.highlight.green = theme.highlight[1];
	colorTheme.highlight.blue = theme.highlight[2];
	
	colorTheme.nodes.red = theme.nodes[0];
	colorTheme.nodes.green = theme.nodes[1];
	colorTheme.nodes.blue = theme.nodes[2];

	document.SetColorTheme(colorTheme);

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

RenderingStatusExt mc_get_rendering_status(DocumentId docId)
{
	Document & document = pSession->GetDocument(docId);
	RenderingStatus status = document.GetRenderingStatus();

	RenderingStatusExt statusExt;
	statusExt.needUpdate = status.needUpdate;

	RenderingColorsBuffer.clear();
	RenderingColorsBuffer = {
		status.data.theme.objects.red,
		status.data.theme.objects.green,
		status.data.theme.objects.blue,
		status.data.theme.highlight.red,
		status.data.theme.highlight.green,
		status.data.theme.highlight.blue,
		status.data.theme.nodes.red,
		status.data.theme.nodes.green,
		status.data.theme.nodes.blue
	};

	statusExt.objects = RenderingColorsBuffer.data();
	statusExt.highlight = RenderingColorsBuffer.data() + 3;
	statusExt.nodes = RenderingColorsBuffer.data() + 6;

	statusExt.thickness = status.data.thickness;
	statusExt.nodesMode = status.data.nodesMode;

	indicesBuffer.clear();
	for (auto it = status.data.indices.begin(); it != status.data.indices.end(); ++it)
	{
		indicesBuffer.push_back((it->figure == "triangles") ? 0 : 1);
		indicesBuffer.push_back(it->offset);
		indicesBuffer.push_back(it->count);
	}
	statusExt.indices = indicesBuffer.data();
	statusExt.indicesSize = indicesBuffer.size();

	verticesBuffer.clear();
	for (auto it = status.data.vertices.begin(); it != status.data.vertices.end(); ++it)
	{
		verticesBuffer.push_back(it->x);
		verticesBuffer.push_back(it->y);
		verticesBuffer.push_back(it->z);
	}

	statusExt.vertices = verticesBuffer.data();
    statusExt.verticesSize = verticesBuffer.size();

	return statusExt;
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

	ObjectsBuffer.clear();
	ObjectsBuffer.assign(objects.begin(), objects.end());

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
