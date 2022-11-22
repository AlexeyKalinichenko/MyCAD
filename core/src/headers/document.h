#ifndef __DOCUMENT_H__
#define __DOCUMENT_H__

#include "definitions.h"
#include "base.h"
#include "line.h"
#include <vector>

struct StorageData
{
    Line * lines;
    unsigned size;
};

struct StorageDataInt
{
    std::vector<Line> lines;
};

class Document
{
private:
    bool _needToUpdate;

    ColorTheme _theme;
    float _thickness;
    bool _nodesMode;

    std::vector<ObjectId> _highlighted;

    Base _base;

public:
    Document();
    Document(const StyleData & style);

    void SetColorTheme(const ColorTheme & theme);
    void SetThickness(float thickness);
    void SetNodesMode(bool mode);

    void Load(const StorageDataInt & data);
    StorageDataInt Save();

    Base & GetBase();

    void SetHighlightedObjects(const std::vector<ObjectId> & objects);

    RenderingDataInt GetRenderingData();
    RenderingStatusInt GetRenderingStatus();

    void MarkAsChanged();
};

Index CreateIndex(Figures figure, unsigned offset, unsigned count);
Vertex CreateVertex(float x, float y, float z);

#endif //__DOCUMENT_H__
