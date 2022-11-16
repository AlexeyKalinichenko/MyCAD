#include "headers/document.h"
#include <iostream>

Document::Document()
{
    _colorTheme = ColorTheme::Dark;
    _thickness = Thickness::Two;
    _nodeMode = NodeMode::Off;
    _snapMode = SnapMode::None;
}

Document::Document(std::string jsonData)
{
}
