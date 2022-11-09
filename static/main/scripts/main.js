import {SessionManager, SM} from "./session_manager.js";
import {UIManager, UM} from "./ui_manager.js";
import {ConnectionManager, CM} from "./connection_manager.js";
import {EditorManager, EM} from "./editor_manager.js";


window.onload = function()
{
    SM.LoadContext();
    EM.ResizeCanvas();
}

window.onresize = function()
{
    EM.ResizeCanvas();
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
        var offsetX = - 0.009;
        var offsetY = 0.009;

        var glX = ((event.clientX - EM.gl.viewportWidth / 2) / EM.gl.viewportWidth) * 2 + offsetX;
        var glY = ((EM.gl.viewportHeight / 2 - event.clientY) / EM.gl.viewportHeight) * 2 + offsetY;

        var target = " ";
    
        var xCoord = document.getElementById("coord_x");
        var foundPos = xCoord.textContent.indexOf(target);
        var prefix = xCoord.textContent.slice(0, foundPos+1);
        xCoord.textContent = prefix + glX.toFixed(3);

        var yCoord = document.getElementById("coord_y");
        foundPos = yCoord.textContent.indexOf(target);
        prefix = yCoord.textContent.slice(0, foundPos+1);
        yCoord.textContent = prefix + glY.toFixed(3);
    }
}

window.onkeydown = function(event)
{
}

function OnBtn1Click() { alert("Btn Undo"); }
function OnBtn2Click() { alert("Btn Redo"); }
function OnBtn3Click() { alert("Btn Line"); }
function OnBtn4Click() { alert("Btn Clear"); }

function OnBtn5Click()
{
    document.getElementById("btn5-menu").classList.toggle("show");
}

function OnBtn51Click()
{
    if (SM.Snap != SessionManager.SnapToEnum.Node)
        SM.Snap = SessionManager.SnapToEnum.Node;
    else
        SM.Snap = SessionManager.SnapToEnum.None;
    
    SM.CheckSnapMode();
}

function OnBtn52Click()
{
    if (SM.Snap != SessionManager.SnapToEnum.Angle)
        SM.Snap = SessionManager.SnapToEnum.Angle;
    else
        SM.Snap = SessionManager.SnapToEnum.None;
    
    SM.CheckSnapMode();
}

function OnBtn6Click()
{
    SM.Nodes = (SM.Nodes == SessionManager.NodesEnum.On) ? SessionManager.NodesEnum.Off : SessionManager.NodesEnum.On;

    var theme = (SM.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark) ?
        document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);
    
    if (SM.Nodes == SessionManager.NodesEnum.On)
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
}

function OnBtn7Click()
{
    document.getElementById("btn7-menu").classList.toggle("show");
}

function OnBtn71Click()
{
    var imagePath = (SM.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark) ?
        "/static/main/images/thickness1.png" : "/static/main/images/thickness1_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    SM.Thickness = SessionManager.ThicknessEnum.One;

    document.getElementById("btn7-menu").classList.remove("show");
}

function OnBtn72Click()
{
    var imagePath = (SM.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark) ?
        "/static/main/images/thickness2.png" : "/static/main/images/thickness2_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    SM.Thickness = SessionManager.ThicknessEnum.Two;

    document.getElementById("btn7-menu").classList.remove("show");
}

function OnBtn73Click()
{
    var imagePath = (SM.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark) ?
        "/static/main/images/thickness3.png" : "/static/main/images/thickness3_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    SM.Thickness = SessionManager.ThicknessEnum.Three;

    document.getElementById("btn7-menu").classList.remove("show");
}

function OnBtn8Click()
{
    var divWindow = document.getElementsByClassName("window")[0];
    divWindow.classList.toggle("Dark-Theme");
    divWindow.classList.toggle("Light-Theme");

    SM.ThemeColor.Theme = divWindow.classList.contains("Dark-Theme") ?
        SessionManager.ThemeColorEnum.Dark : SessionManager.ThemeColorEnum.Light;

    var theme = (SM.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark) ?
        document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);

    if (SM.Nodes == SessionManager.NodesEnum.Off)
    {
        var color = style.getPropertyValue("--ButtonBgColor");
        theme.style.setProperty("--NodesButtonBgColor", color);

        var focusColor = style.getPropertyValue("--ButtonBgFocusColor");
        theme.style.setProperty("--NodesButtonBgFocusColor", focusColor);
    }

    if (SM.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark)
    {
        document.getElementById("img1").setAttribute("src", "/static/main/images/undo.png");
        document.getElementById("img2").setAttribute("src", "/static/main/images/redo.png");

        var imagePath = "/static/main/images/thickness1.png";
        if (SM.Thickness == SessionManager.ThicknessEnum.Two)
            imagePath = "/static/main/images/thickness2.png";
        else if (SM.Thickness == SessionManager.ThicknessEnum.Three)
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
        if (SM.Thickness == SessionManager.ThicknessEnum.Two)
            imagePath = "/static/main/images/thickness2_light.png";
        else if (SM.Thickness == SessionManager.ThicknessEnum.Three)
            imagePath = "/static/main/images/thickness3_light.png";
    
        document.getElementById("img4").setAttribute("src", imagePath);
        document.getElementById("img41").setAttribute("src", "/static/main/images/thickness1_light.png");
        document.getElementById("img42").setAttribute("src", "/static/main/images/thickness2_light.png");
        document.getElementById("img43").setAttribute("src", "/static/main/images/thickness3_light.png");
        document.getElementById("img5").setAttribute("src", "/static/main/images/dark.png");
    }

    EM.RefreshScene();
}

alert("main.js");
