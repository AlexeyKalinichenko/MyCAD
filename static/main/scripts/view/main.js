import {Storage, St} from "./storage.js";
import {Interface, Ui} from "./interface.js";
import {Editor, Ed} from "./editor.js";


window.onload = function() {
    St.LoadState();
    Ui.SetDisplayMode(St.ColorTheme, St.Thickness, St.SnapToMode, St.NodesMode);
    Ed.SetColorTheme(St.ColorTheme);
};

window.onunload = function() {
    St.SaveState();
};

window.onresize = function() {
    Ed.ResizeCanvas();
};

window.onclick = function() {
    Ui.HideAllMenu();
};

window.onmousemove = function(event) {
    var current = document.elementFromPoint(event.clientX, event.clientY);
    var canvas = document.getElementById("Editor");

    if (current === canvas)
    {
        let coords = Ed.ConvertCoords(event.clientX, event.clientY);
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordX, coords[0]);
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordY, coords[1]);
    }
};

window.onkeydown = function() {};


Ui.RegisterHandler(Interface.UIElementsEnum.ButtonUndo, () => {});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonRedo, () => {});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonLine, () => {});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonClear, () => {});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapTo, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonSnapTo);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToNode, () => {
    switch(St.SnapToMode) {
        case Storage.SnapToModeEnum.Node:
            St.SnapToMode = Storage.SnapToModeEnum.None;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.None);
            break;
        case Storage.SnapToModeEnum.Angle:
            St.SnapToMode = Storage.SnapToModeEnum.Both;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.Both);
            break;
        case Storage.SnapToModeEnum.Both:
            St.SnapToMode = Storage.SnapToModeEnum.Angle;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.Angle);
            break;
        default:
            St.SnapToMode = Storage.SnapToModeEnum.Node;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.Node);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToAngle, () => {
    switch(St.SnapToMode) {
        case Storage.SnapToModeEnum.Node:
            St.SnapToMode = Storage.SnapToModeEnum.Both;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.Both);
            break;
        case Storage.SnapToModeEnum.Angle:
            St.SnapToMode = Storage.SnapToModeEnum.None;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.None);
            break;
        case Storage.SnapToModeEnum.Both:
            St.SnapToMode = Storage.SnapToModeEnum.Node;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.Node);
            break;
        default:
            St.SnapToMode = Storage.SnapToModeEnum.Angle;
            St.SaveState();
            Ui.SetSnapMode(Interface.SnapToModeEnum.Angle);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonNodes, () => {
    if (St.NodesMode == Storage.NodesModeEnum.On)
    {
        St.NodesMode = Storage.NodesModeEnum.Off;
        St.SaveState();
        Ui.SetNodeMode(Interface.NodesModeEnum.Off);
    }
    else
    {
        St.NodesMode = Storage.NodesModeEnum.On;
        St.SaveState();
        Ui.SetNodeMode(Interface.NodesModeEnum.On);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonThickness);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness1, () => {
    St.Thickness = Storage.ThicknessEnum.One;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.One);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness2, () => {
    St.Thickness = Storage.ThicknessEnum.Two;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.Two);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness3, () => {
    St.Thickness = Storage.ThicknessEnum.Three;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.Three);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonTheme, () => {
    if (St.ColorTheme == Storage.ColorThemeEnum.Dark)
    {
        St.ColorTheme = Storage.ColorThemeEnum.Light;
        St.SaveState();
        Ui.SetColorTheme(Interface.ColorThemeEnum.Light);
        Ed.SetColorTheme(Editor.ColorThemeEnum.Light);
    }
    else
    {
        St.ColorTheme = Storage.ColorThemeEnum.Dark;
        St.SaveState();
        Ui.SetColorTheme(Interface.ColorThemeEnum.Dark);
        Ed.SetColorTheme(Editor.ColorThemeEnum.Dark);
    }
});
