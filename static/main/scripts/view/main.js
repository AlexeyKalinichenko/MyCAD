import {ApplicationController, Ac} from "../controller/application_controller.js";
import {OperationController} from "../controller/operation_controller.js";
import {Storage, St} from "./storage.js";
import {Interface, Ui} from "./interface.js";
import {Editor, Ed} from "./editor.js";


window.onload = function() {
    St.LoadState();
    Ui.SetDisplayMode(St.ColorTheme, St.Thickness, St.SnapToMode, St.NodesMode);
    Ed.SetColorTheme(St.ColorTheme);
    Ac.RunOperation(ApplicationController.OperationId.OpenDocument);

    let style = {
	    theme: {
		    objects: {
				red: 0.1,
				green: 0.2,
				blue: 0.3
			},
		    highlight: {
				red: 0.4,
				green: 0.5,
				blue: 0.6
			},
		    nodes: {
				red: 0.7,
				green: 0.8,
				blue: 0.9
			}
	    },
	    thickness: 0.15,
	    nodesMode: false
    };

    Ac.SetStringData(JSON.stringify(style));
};

window.onunload = function() {
    St.SaveState();
    Ac.RunOperation(ApplicationController.OperationId.CloseDocument);
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
    let coords = Ed.ConvertCoords(event.clientX, event.clientY);

    if (current === canvas)
    {
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordX, coords[0]);
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordY, coords[1]);
    }

    Ac.MouseEvent(coords[0], coords[1]);
};

window.onkeydown = function(event) {
    if (event.code == 'Enter')
        Ac.ButtonEvent(OperationController.ButtonId.Enter);
    else if (event.code == 'Escape')
        Ac.ButtonEvent(OperationController.ButtonId.Escape);
};


Ui.RegisterHandler(Interface.UIElementsEnum.ButtonUndo, () => {
    Ac.RunOperation(ApplicationController.OperationId.Undo);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonRedo, () => {
    Ac.RunOperation(ApplicationController.OperationId.Redo);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonLine, () => {
    Ac.RunOperation(ApplicationController.OperationId.Line);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonClear, () => {
    Ac.RunOperation(ApplicationController.OperationId.Clear);
});

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

    Ac.RunOperation(ApplicationController.OperationId.SnapToNode);
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

    Ac.RunOperation(ApplicationController.OperationId.SnapToAngle);
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

    Ac.RunOperation(ApplicationController.OperationId.Nodes);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonThickness);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness1, () => {
    St.Thickness = Storage.ThicknessEnum.One;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.One);
    Ac.RunOperation(ApplicationController.OperationId.Thickness);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness2, () => {
    St.Thickness = Storage.ThicknessEnum.Two;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.Two);
    Ac.RunOperation(ApplicationController.OperationId.Thickness);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness3, () => {
    St.Thickness = Storage.ThicknessEnum.Three;
    St.SaveState();
    Ui.SetThickness(Interface.ThicknessEnum.Three);
    Ac.RunOperation(ApplicationController.OperationId.Thickness);
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

    Ac.RunOperation(ApplicationController.OperationId.Theme);
});
