import {Storage, St} from "./storage.js";
import {Interface, Ui} from "./interface.js";
import {Connector, Cn} from "./connector.js";
import {Editor, Ed} from "./editor.js";


window.onload = function()
{
    St.LoadState();
    Ui.SetDisplayMode(St.ColorTheme, St.Thickness, St.SnapToMode, St.NodesMode);

    Ed.ResizeCanvas();
}

window.onresize = function()
{
    Ed.ResizeCanvas();
}

window.onclick = function(event)
{
    Ui.HideAllMenu();
}

window.onmousemove = function(event)
{
    var current = document.elementFromPoint(event.clientX, event.clientY);
    var canvas = document.getElementById("Editor");

    if (current === canvas)
    {
        //editor module//
        var offsetX = - 0.009;
        var offsetY = 0.009;

        var glX = ((event.clientX - Ed.gl.viewportWidth / 2) / Ed.gl.viewportWidth) * 2 + offsetX;
        var glY = ((Ed.gl.viewportHeight / 2 - event.clientY) / Ed.gl.viewportHeight) * 2 + offsetY;
        //editor module//

        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordX, glX);
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordY, glY);
    }
}

window.onkeydown = function(event)
{
}


Ui.RegisterHandler(Interface.UIElementsEnum.ButtonUndo, () => { alert("Btn Undo"); });
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonRedo, () => { alert("Btn Redo"); });
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonLine, () => { alert("Btn Line"); });
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonClear, () => { alert("Btn Clear"); });

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapTo, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonSnapTo);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToNode, () => {
    if (St.SnapToMode == Storage.SnapToModeEnum.Node)
    {
        St.SnapToMode = Storage.SnapToModeEnum.None;
        Ui.SetSnapMode(Interface.SnapToModeEnum.None);
    }
    else
    {
        St.SnapToMode = Storage.SnapToModeEnum.Node;
        Ui.SetSnapMode(Interface.SnapToModeEnum.Node);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToAngle, () => {
    if (St.SnapToMode == Storage.SnapToModeEnum.Angle)
    {
        St.SnapToMode = Storage.SnapToModeEnum.None;
        Ui.SetSnapMode(Interface.SnapToModeEnum.None);
    }
    else
    {
        St.SnapToMode = Storage.SnapToModeEnum.Angle;
        Ui.SetSnapMode(Interface.SnapToModeEnum.Angle);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonNodes, () => {
    if (St.NodesMode == Storage.NodesModeEnum.On)
    {
        St.NodesMode = Storage.NodesModeEnum.Off;
        Ui.SetNodeMode(Interface.NodesModeEnum.Off);
    }
    else
    {
        St.NodesMode = Storage.NodesModeEnum.On;
        Ui.SetNodeMode(Interface.NodesModeEnum.On);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonThickness);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness1, () => {
    St.Thickness = Storage.ThicknessEnum.One;
    Ui.SetThickness(Interface.ThicknessEnum.One);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness2, () => {
    St.Thickness = Storage.ThicknessEnum.Two;
    Ui.SetThickness(Interface.ThicknessEnum.Two);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonThickness3, () => {
    St.Thickness = Storage.ThicknessEnum.Three;
    Ui.SetThickness(Interface.ThicknessEnum.Three);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonTheme, () => {
    if (St.ColorTheme == Storage.ColorThemeEnum.Dark)
    {
        St.ColorTheme = Storage.ColorThemeEnum.Light;
        Ui.SetColorTheme(Interface.ColorThemeEnum.Light);
    }
    else
    {
        St.ColorTheme = Storage.ColorThemeEnum.Dark;
        Ui.SetColorTheme(Interface.ColorThemeEnum.Dark);
    }
});
