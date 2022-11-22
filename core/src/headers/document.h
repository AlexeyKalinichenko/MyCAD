#ifndef __DOCUMENT_H__
#define __DOCUMENT_H__

#include "definitions.h"
#include "base.h"
#include "line.h"
#include <vector>

struct StorageData
{
    std::vector<Line> lines;
};

struct StorageDataExt
{
    float * lines;
    unsigned size;
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

    void Load(const StorageData & data);
    StorageData Save();

    Base & GetBase();

    void SetHighlightedObjects(const std::vector<ObjectId> & objects);

    RenderingData GetRenderingData();
    RenderingStatus GetRenderingStatus();

    void MarkAsChanged();
};

#endif //__DOCUMENT_H__
