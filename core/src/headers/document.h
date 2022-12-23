#ifndef __DOCUMENT_H__
#define __DOCUMENT_H__

#include "definitions.h"
#include "base.h"
#include "line.h"
#include <vector>

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

    void Load(const std::vector<Line> & lines);
    std::vector<Line> Save();

    Base & GetBase();

    void SetHighlightedObjects(const std::vector<ObjectId> & objects);

    RenderingDataInt GetRenderingData(bool clearHighlightedObjects = false);
    bool GetRenderingStatus();

    void MarkAsChanged();
};

Index CreateIndex(Figures figure, unsigned offset, unsigned count, bool highlight);
Vertex CreateVertex(float x, float y, float z);

Cut LineToCut(const Line & line);
Line CutToLine(const Cut & cut);

#endif //__DOCUMENT_H__
