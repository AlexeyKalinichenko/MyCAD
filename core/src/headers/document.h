#ifndef __DOCUMENT_H__
#define __DOCUMENT_H__

#include "definitions.h"
#include "base.h"
#include <string>

class Document
{
private:
    ColorTheme _colorTheme;
    Thickness _thickness;
    NodeMode _nodeMode;
    SnapMode _snapMode;

    Base _base;

public:
    Document();
    Document(std::string jsonData);
};

#endif //__DOCUMENT_H__