#include "headers/document.h"
#include <iostream>

Document::Document()
{
    _colorTheme = ColorTheme::Dark;
    _thickness = Thickness::Two;
    _nodeMode = NodeMode::Off;
    _snapMode = SnapMode::None;
}

void Document::Load(std::string jsonData)
{
    // todo
}

std::string Document::Save()
{
    //todo

    return std::string();
}

Base Document::GetBase()
{
    return _base;
}
