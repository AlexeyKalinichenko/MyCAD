import {Storage, St} from "./storage.js";
import {Interface, Ui} from "./interface.js";
import {Connector, Cn} from "./connector.js";
import {Editor, Ed} from "./editor.js";

//cursor

window.onload = function()
{
    //St.LoadContext();
    Ed.ResizeCanvas();
}

window.onresize = function()
{
    Ed.ResizeCanvas();
}

window.onclick = function(event)
{
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

/*
document.getElementById("btn5").addEventListener("click", function () {
    document.getElementById("btn5-menu").classList.toggle("show");
});

document.getElementById("btn51").addEventListener("click", () => {
    if (St.Snap != Storage.SnapToEnum.Node)
        St.Snap = Storage.SnapToEnum.Node;
    else
        St.Snap = Storage.SnapToEnum.None;
    
    St.CheckSnapMode();
});

document.getElementById("btn52").addEventListener("click", () => {
    if (St.Snap != Storage.SnapToEnum.Angle)
        St.Snap = Storage.SnapToEnum.Angle;
    else
        St.Snap = Storage.SnapToEnum.None;
    
    St.CheckSnapMode();
});

document.getElementById("btn6").addEventListener("click", () => {
    St.Nodes = (St.Nodes == Storage.NodesEnum.On) ? Storage.NodesEnum.Off : Storage.NodesEnum.On;

    var theme = (St.ThemeColor.Theme == Storage.ThemeColorEnum.Dark) ?
        document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);
    
    if (St.Nodes == Storage.NodesEnum.On)
    {
        var selectedColor = style.getPropertyValue("--ButtonBgSelectedColor");
        theme.style.setProperty("--NodesButtonBgColor", selectedColor);

        var focusColor = style.getPropertyValue("--ButtonBgSelectedFocusColor");
        theme.style.setProperty("--NodesButtonBgFocusColor", focusColor);
    }
    else
    {
        var color = style.getPropertyValue("--ButtonBgColor");
        theme.style.setProperty("--NodesButtonBgColor", color);

        var focusColor = style.getPropertyValue("--ButtonBgFocusColor");
        theme.style.setProperty("--NodesButtonBgFocusColor", focusColor);
    }
});

document.getElementById("btn7").addEventListener("click", () => {
    document.getElementById("btn7-menu").classList.toggle("show");
});


document.getElementById("btn71").addEventListener("click", () => {
    var imagePath = (St.ThemeColor.Theme == Storage.ThemeColorEnum.Dark) ?
        "/static/main/images/thickness1.png" : "/static/main/images/thickness1_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    St.Thickness = Storage.ThicknessEnum.One;

    document.getElementById("btn7-menu").classList.remove("show");
});

document.getElementById("btn72").addEventListener("click", () => {
    var imagePath = (St.ThemeColor.Theme == Storage.ThemeColorEnum.Dark) ?
        "/static/main/images/thickness2.png" : "/static/main/images/thickness2_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    St.Thickness = Storage.ThicknessEnum.Two;

    document.getElementById("btn7-menu").classList.remove("show");
});

document.getElementById("btn73").addEventListener("click", () => {
    var imagePath = (St.ThemeColor.Theme == Storage.ThemeColorEnum.Dark) ?
        "/static/main/images/thickness3.png" : "/static/main/images/thickness3_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    St.Thickness = Storage.ThicknessEnum.Three;

    document.getElementById("btn7-menu").classList.remove("show");
});
*/

//
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonTheme, () => { Ui.SetColorTheme(Interface.ColorThemeEnum.Light); });
//

/*
document.getElementById("btn8").addEventListener("click", () => {
    var divWindow = document.getElementsByClassName("window")[0];
    divWindow.classList.toggle("Dark-Theme");
    divWindow.classList.toggle("Light-Theme");

    St.ThemeColor.Theme = divWindow.classList.contains("Dark-Theme") ?
        Storage.ThemeColorEnum.Dark : Storage.ThemeColorEnum.Light;

    var theme = (St.ThemeColor.Theme == Storage.ThemeColorEnum.Dark) ?
        document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);

    if (St.Nodes == Storage.NodesEnum.Off)
    {
        var color = style.getPropertyValue("--ButtonBgColor");
        theme.style.setProperty("--NodesButtonBgColor", color);

        var focusColor = style.getPropertyValue("--ButtonBgFocusColor");
        theme.style.setProperty("--NodesButtonBgFocusColor", focusColor);
    }

    if (St.ThemeColor.Theme == Storage.ThemeColorEnum.Dark)
    {
        document.getElementById("img1").setAttribute("src", "/static/main/images/undo.png");
        document.getElementById("img2").setAttribute("src", "/static/main/images/redo.png");

        var imagePath = "/static/main/images/thickness1.png";
        if (St.Thickness == Storage.ThicknessEnum.Two)
            imagePath = "/static/main/images/thickness2.png";
        else if (St.Thickness == Storage.ThicknessEnum.Three)
            imagePath = "/static/main/images/thickness3.png";

        document.getElementById("img4").setAttribute("src", imagePath);
        document.getElementById("img41").setAttribute("src", "/static/main/images/thickness1.png");
        document.getElementById("img42").setAttribute("src", "/static/main/images/thickness2.png");
        document.getElementById("img43").setAttribute("src", "/static/main/images/thickness3.png");
        document.getElementById("img5").setAttribute("src", "/static/main/images/light.png");
    }
    else
    {
        document.getElementById("img1").setAttribute("src", "/static/main/images/undo_light.png");
        document.getElementById("img2").setAttribute("src", "/static/main/images/redo_light.png");

        var imagePath = "/static/main/images/thickness1_light.png";
        if (St.Thickness == Storage.ThicknessEnum.Two)
            imagePath = "/static/main/images/thickness2_light.png";
        else if (St.Thickness == Storage.ThicknessEnum.Three)
            imagePath = "/static/main/images/thickness3_light.png";
    
        document.getElementById("img4").setAttribute("src", imagePath);
        document.getElementById("img41").setAttribute("src", "/static/main/images/thickness1_light.png");
        document.getElementById("img42").setAttribute("src", "/static/main/images/thickness2_light.png");
        document.getElementById("img43").setAttribute("src", "/static/main/images/thickness3_light.png");
        document.getElementById("img5").setAttribute("src", "/static/main/images/dark.png");
    }

    Ed.RefreshScene();
});
*/