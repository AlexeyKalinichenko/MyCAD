//import "./test_api.js";

import {Storage, St} from "./storage.js";
import {Interface, Ui} from "./interface.js";
import {Connector, Cn} from "./connector.js";
import {Editor, Ed} from "./editor.js";


window.onload = function() {
    St.LoadState();
    Ui.SetDisplayMode(St.ColorTheme, St.Thickness, St.SnapToMode, St.NodesMode);
    Ed.SetColorTheme(St.ColorTheme);
    Cn.Request(Connector.RequestEnum.OpenDocument);
};

window.onunload = function() {
    St.SaveState();
    //Cn.Request(Connector.RequestEnum.CloseDocument);
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


Ui.RegisterHandler(Interface.UIElementsEnum.ButtonUndo, () => {
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationUndo]);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonRedo, () => { 
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationRedo]);
});
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonLine, () => {
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationLine]);
    
    // Test
    let response1 = Cn.Request(Connector.RequestEnum.IsDocumentChanged);
    let response2 = Cn.Request(Connector.RequestEnum.GetDocumentInfo);
    Ui.UpdateText(Interface.UIElementsEnum.TitleObjects, response2.info.objects);

    let response3 = Cn.Request(Connector.RequestEnum.GetDataForRendering);
    Ed.DrawScene(response3.buffer);
    // Test
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonClear, () => {
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationClear]);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapTo, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonSnapTo);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToNode, () => {
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationSnapTo]);
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
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationSnapTo]);
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
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationNodes]);
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
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationThickness]);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness2, () => {
    St.Thickness = Storage.ThicknessEnum.Two;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.Two);
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationThickness]);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness3, () => {
    St.Thickness = Storage.ThicknessEnum.Three;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.Three);
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationThickness]);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonTheme, () => {
    Cn.Request(Connector.RequestEnum.RunOperation, [Connector.OperationIdEnum.OperationColorTheme]);
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


/*
let vertices = [
    // X Y Z R G B
    //Сoordinate system
    0.0,   0.0   * Editor.Coef, 0.0, 0.93, 0.42, 0.37,  // triangle 1 color - #ed6a5e
    0.04,  0.0   * Editor.Coef, 0.0, 0.93, 0.42, 0.37,
    0.005, 0.005 * Editor.Coef, 0.0, 0.93, 0.42, 0.37,

    0.005, 0.005 * Editor.Coef, 0.0, 0.93, 0.42, 0.37,  // triangle 2 color - #ed6a5e
    0.04,  0.0   * Editor.Coef, 0.0, 0.93, 0.42, 0.37,
    0.04,  0.005 * Editor.Coef, 0.0, 0.93, 0.42, 0.37,

    0.0,   0.0   * Editor.Coef, 0.0, 0.38, 0.76, 0.33,  // triangle 3 color - #60c253
    0.0,   0.04  * Editor.Coef, 0.0, 0.38, 0.76, 0.33,
    0.005, 0.005 * Editor.Coef, 0.0, 0.38, 0.76, 0.33,

    0.005, 0.005 * Editor.Coef, 0.0, 0.38, 0.76, 0.33,  // triangle 4 color - #60c253
    0.0,   0.04  * Editor.Coef, 0.0, 0.38, 0.76, 0.33,
    0.005, 0.04  * Editor.Coef, 0.0, 0.38, 0.76, 0.33,

    // LINE 1
    -0.4, 0.4012 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,  // triangle 1
     0.4, 0.4    * Editor.Coef, 0.0, 0.85, 0.87, 0.91,
    -0.4, 0.4    * Editor.Coef, 0.0, 0.85, 0.87, 0.91,

     0.4, 0.4    * Editor.Coef, 0.0, 0.85, 0.87, 0.91,  // triangle 2
     0.4, 0.4012 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,
    -0.4, 0.4012 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,

    // LINE 2
    -0.4, 0.3025 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,  // triangle 1
     0.4, 0.3    * Editor.Coef, 0.0, 0.85, 0.87, 0.91,
    -0.4, 0.3    * Editor.Coef, 0.0, 0.85, 0.87, 0.91,

     0.4, 0.3    * Editor.Coef, 0.0, 0.85, 0.87, 0.91,  // triangle 2
     0.4, 0.3025 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,
    -0.4, 0.3025 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,

    // LINE 3
    -0.4, 0.205 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,  // triangle 1
     0.4, 0.2   * Editor.Coef, 0.0, 0.85, 0.87, 0.91,
    -0.4, 0.2   * Editor.Coef, 0.0, 0.85, 0.87, 0.91,

     0.4, 0.2   * Editor.Coef, 0.0, 0.85, 0.87, 0.91,  // triangle 2
     0.4, 0.205 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,
    -0.4, 0.205 * Editor.Coef, 0.0, 0.85, 0.87, 0.91,

    // NODE 11
     0.4, 0.4006 * Editor.Coef, 0.0, 0.98, 0.68, 0.35,  // point 1

    // NODE 12
    -0.4, 0.4006 * Editor.Coef, 0.0, 0.98, 0.68, 0.35,  // point 2

    // NODE 21
     0.4, 0.3012 * Editor.Coef, 0.0, 0.98, 0.68, 0.35,  // point 1

    // NODE 22
    -0.4, 0.3012 * Editor.Coef, 0.0, 0.98, 0.68, 0.35,  // point 2

    // NODE 31
     0.4, 0.2025 * Editor.Coef, 0.0, 0.98, 0.68, 0.35,  // point 1

    // NODE 32
    -0.4, 0.2025 * Editor.Coef, 0.0, 0.98, 0.68, 0.35,  // point 2
];
*/
