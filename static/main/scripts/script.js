// Классы и определения

class SessionManager {
    static ThemeColorEnum = { Dark: "dark", Light: "light" };
    static ThicknessEnum  = { One: "one", Two: "two", Three: "three" };
    static SnapToEnum     = { None: "none", Node: "Node", Angle: "Angle" };
    static NodesEnum      = { On: "on", Off: "off" };

    ThemeColor = SessionManager.ThemeColorEnum.Dark;
    Thickness  = SessionManager.ThicknessEnum.Two;
    Snap       = SessionManager.SnapToEnum.None;
    Nodes      = SessionManager.NodesEnum.Off;
    
    LoadContext = function() {
        let theme = localStorage.getItem("ThemeColor");
        this.ThemeColor = theme ? theme : SessionManager.ThemeColorEnum.Dark;
        
        let thickness = localStorage.getItem("Thickness");
        this.Thickness = thickness ? thickness : SessionManager.ThicknessEnum.Two;

        let snap = localStorage.getItem("Snap");
        this.Snap = snap ? snap : SessionManager.SnapToEnum.None;

        let nodes = localStorage.getItem("Nodes");
        this.Nodes = nodes ? nodes : SessionManager.NodesEnum.Off;
    };

    SaveContext = function() {
        localStorage.setItem("ThemeColor", ThemeColor);
        localStorage.setItem("Thickness", Thickness);
        localStorage.setItem("Snap", Snap);
        localStorage.setItem("Nodes", Nodes);
    };

    resetContext = function() {
        localStorage.clear();
    };
}

class EditorManager {
    static gl = null;

    constructor() {
        var canvas = document.getElementById("Editor");
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!this.gl)
            alert("WebGL is not supported");
    }

    ResizeCanvas = function() {
        var canvas = document.getElementById("Editor");
        var space = document.getElementById("space");
    
        canvas.setAttribute('width', space.offsetWidth);
        canvas.setAttribute('height', space.offsetHeight);

        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
    
        initShaders();
        loadSceneData();
        RefreshScene();
    }
}

class ConnectionManager {

}

let SM = null;
let CM = null;
let EM = null;


var shaderProgram;
var vertexBuffer; // буфер вершин
var verticesBuffer = [];

const ControllerSteps = { POINT1: 0, POINT2: 1, DRAWING: 2 };
var step = ControllerSteps.POINT1;

const LightThemeColor = { R: 1.0, G: 1.0, B: 1.0, A: 1.0 };
const DarkThemeColor = { R: 0.19, G: 0.22, B: 0.25, A: 1.0 };
let currentThemeColor = DarkThemeColor;

const Thickness = { ONE: 0, TWO: 1, THREE: 2 };
let currentThickness = Thickness.TWO;

const Nodes = { ON: 0, OFF: 1 };
let currentNodes = Nodes.OFF;

const SnapTo = { NONE: 0, NODE: 1, ANGLE: 2 };
let currentSnap = SnapTo.NONE;

// установка шейдеров
function initShaders()
{
    var fragmentShader = getShader(EM.gl.FRAGMENT_SHADER, 'shader-fs');
    var vertexShader = getShader(EM.gl.VERTEX_SHADER, 'shader-vs');

    shaderProgram = EM.gl.createProgram();

    EM.gl.attachShader(shaderProgram, vertexShader);
    EM.gl.attachShader(shaderProgram, fragmentShader);

    EM.gl.linkProgram(shaderProgram);

    if (!EM.gl.getProgramParameter(shaderProgram, EM.gl.LINK_STATUS))
    {
        alert("Failed to install shaders");
    }

    EM.gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = EM.gl.getAttribLocation(shaderProgram, "aVertexPosition");
    EM.gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = EM.gl.getAttribLocation(shaderProgram, "aVertexColor");
    EM.gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

// Функция создания шейдера
function getShader(type, id)
{
    var source = document.getElementById(id).innerHTML;
    var shader = EM.gl.createShader(type);

    EM.gl.shaderSource(shader, source);
    EM.gl.compileShader(shader);

    if (!EM.gl.getShaderParameter(shader, EM.gl.COMPILE_STATUS))
    {
        alert("Shader compilation error: " + EM.gl.getShaderInfoLog(shader));
        EM.gl.deleteShader(shader);   
        return null;
    }
    return shader;  
}

function ClearScene(themeColor)
{
    EM.gl.clearColor(themeColor.R, themeColor.G, themeColor.B, themeColor.A);
    EM.gl.viewport(0, 0, EM.gl.viewportWidth, EM.gl.viewportHeight);
    EM.gl.clear(EM.gl.COLOR_BUFFER_BIT);
}

function RefreshScene()
{
    ClearScene(currentThemeColor);
    drawTempObjects();
}

function loadSceneData()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url + 'getdata/', false);
    xhr.send();

    data = JSON.parse(xhr.responseText);

    verticesBuffer = data.vertices;
}

function drawTempObjects()
{
    var coef = 1.971;

    vertices = [
        // X Y Z R G B

        //Сoordinate system
        0.0,   0.0   * coef, 0.0, 0.93, 0.42, 0.37,  // triangle 1 color - #ed6a5e
        0.04,  0.0   * coef, 0.0, 0.93, 0.42, 0.37,
        0.005, 0.005 * coef, 0.0, 0.93, 0.42, 0.37,

        0.005, 0.005 * coef, 0.0, 0.93, 0.42, 0.37,  // triangle 2 color - #ed6a5e
        0.04,  0.0   * coef, 0.0, 0.93, 0.42, 0.37,
        0.04,  0.005 * coef, 0.0, 0.93, 0.42, 0.37,

        0.0,   0.0   * coef, 0.0, 0.38, 0.76, 0.33,  // triangle 3 color - #60c253
        0.0,   0.04  * coef, 0.0, 0.38, 0.76, 0.33,
        0.005, 0.005 * coef, 0.0, 0.38, 0.76, 0.33,

        0.005, 0.005 * coef, 0.0, 0.38, 0.76, 0.33,  // triangle 4 color - #60c253
        0.0,   0.04  * coef, 0.0, 0.38, 0.76, 0.33,
        0.005, 0.04  * coef, 0.0, 0.38, 0.76, 0.33,

        // LINE 1
        -0.4, 0.4012 * coef, 0.0, 0.85, 0.87, 0.91,  // triangle 1
         0.4, 0.4    * coef, 0.0, 0.85, 0.87, 0.91,
        -0.4, 0.4    * coef, 0.0, 0.85, 0.87, 0.91,

         0.4, 0.4    * coef, 0.0, 0.85, 0.87, 0.91,  // triangle 2
         0.4, 0.4012 * coef, 0.0, 0.85, 0.87, 0.91,
        -0.4, 0.4012 * coef, 0.0, 0.85, 0.87, 0.91,

        // LINE 2
        -0.4, 0.3025 * coef, 0.0, 0.85, 0.87, 0.91,  // triangle 1
         0.4, 0.3    * coef, 0.0, 0.85, 0.87, 0.91,
        -0.4, 0.3    * coef, 0.0, 0.85, 0.87, 0.91,

         0.4, 0.3    * coef, 0.0, 0.85, 0.87, 0.91,  // triangle 2
         0.4, 0.3025 * coef, 0.0, 0.85, 0.87, 0.91,
        -0.4, 0.3025 * coef, 0.0, 0.85, 0.87, 0.91,

        // LINE 3
        -0.4, 0.205 * coef, 0.0, 0.85, 0.87, 0.91,  // triangle 1
         0.4, 0.2   * coef, 0.0, 0.85, 0.87, 0.91,
        -0.4, 0.2   * coef, 0.0, 0.85, 0.87, 0.91,

         0.4, 0.2   * coef, 0.0, 0.85, 0.87, 0.91,  // triangle 2
         0.4, 0.205 * coef, 0.0, 0.85, 0.87, 0.91,
        -0.4, 0.205 * coef, 0.0, 0.85, 0.87, 0.91,

        // NODE 11
         0.4, 0.4006 * coef, 0.0, 0.98, 0.68, 0.35,  // point 1

        // NODE 12
        -0.4, 0.4006 * coef, 0.0, 0.98, 0.68, 0.35,  // point 2

        // NODE 21
         0.4, 0.3012 * coef, 0.0, 0.98, 0.68, 0.35,  // point 1

        // NODE 22
        -0.4, 0.3012 * coef, 0.0, 0.98, 0.68, 0.35,  // point 2

        // NODE 31
         0.4, 0.2025 * coef, 0.0, 0.98, 0.68, 0.35,  // point 1

        // NODE 32
        -0.4, 0.2025 * coef, 0.0, 0.98, 0.68, 0.35,  // point 2
    ];

    vertexBuffer = EM.gl.createBuffer();
    EM.gl.bindBuffer(EM.gl.ARRAY_BUFFER, vertexBuffer);
    EM.gl.bufferData(EM.gl.ARRAY_BUFFER, new Float32Array(vertices), EM.gl.STATIC_DRAW);

    EM.gl.vertexAttribPointer(
        shaderProgram.vertexPositionAttribute,
        3,
        EM.gl.FLOAT,
        EM.gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );

    EM.gl.vertexAttribPointer(
        shaderProgram.vertexColorAttribute,
        3,
        EM.gl.FLOAT,
        EM.gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    EM.gl.drawArrays(EM.gl.TRIANGLES, 0, 3*10);
    EM.gl.drawArrays(EM.gl.POINTS, 30, 1*6);
}

function checkSnapMode()
{
    var theme = (currentThemeColor == DarkThemeColor) ?
            document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);
    
    if (currentSnap == SnapTo.NODE || currentSnap == SnapTo.ANGLE)
    {
        var color = style.getPropertyValue("--ButtonBgSelectedColor");
        theme.style.setProperty("--SnapToButtonBgColor", color);

        var focusColor = style.getPropertyValue("--ButtonBgSelectedFocusColor");
        theme.style.setProperty("--SnapToButtonBgFocusColor", focusColor);

        var textColor = style.getPropertyValue("--ButtonTextSelectedColor");
        theme.style.setProperty("--SnapToButtonTextColor", textColor);
    }
    else
    {
        var color = style.getPropertyValue("--ButtonBgColor");
        theme.style.setProperty("--SnapToButtonBgColor", color);

        var focusColor = style.getPropertyValue("--ButtonBgFocusColor");
        theme.style.setProperty("--SnapToButtonBgFocusColor", focusColor);

        var textColor = style.getPropertyValue("--ButtonTextColor");
        theme.style.setProperty("--SnapToButtonTextColor", textColor);
    }
}

// Обработчики событий

window.onload = function()
{
    SM = new SessionManager();
    CM = new ConnectionManager();
    EM = new EditorManager();

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

// Обработчики кнопок

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
    if (currentSnap != SnapTo.NODE)
        currentSnap = SnapTo.NODE;
    else
        currentSnap = SnapTo.NONE;
    
    checkSnapMode();
}

function OnBtn52Click()
{
    if (currentSnap != SnapTo.ANGLE)
        currentSnap = SnapTo.ANGLE;
    else
        currentSnap = SnapTo.NONE;
    
    checkSnapMode();
}

function OnBtn6Click()
{
    currentNodes = (currentNodes == Nodes.ON) ? Nodes.OFF : Nodes.ON;

    var theme = (currentThemeColor == DarkThemeColor) ?
        document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);
    
    if (currentNodes == Nodes.ON)
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
    var imagePath = (currentThemeColor == DarkThemeColor) ?
        "/static/main/images/thickness1.png" : "/static/main/images/thickness1_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    currentThickness = Thickness.ONE;

    document.getElementById("btn7-menu").classList.remove("show");
}

function OnBtn72Click()
{
    var imagePath = (currentThemeColor == DarkThemeColor) ?
        "/static/main/images/thickness2.png" : "/static/main/images/thickness2_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    currentThickness = Thickness.TWO;

    document.getElementById("btn7-menu").classList.remove("show");
}

function OnBtn73Click()
{
    var imagePath = (currentThemeColor == DarkThemeColor) ?
        "/static/main/images/thickness3.png" : "/static/main/images/thickness3_light.png";

    document.getElementById("img4").setAttribute("src", imagePath);

    currentThickness = Thickness.THREE;

    document.getElementById("btn7-menu").classList.remove("show");
}

function OnBtn8Click()
{
    var divWindow = document.getElementsByClassName("window")[0];
    divWindow.classList.toggle("Dark-Theme");
    divWindow.classList.toggle("Light-Theme");

    currentThemeColor = divWindow.classList.contains("Dark-Theme") ? DarkThemeColor : LightThemeColor;

    var theme = (currentThemeColor == DarkThemeColor) ?
        document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);

    if (currentNodes == Nodes.OFF)
    {
        var color = style.getPropertyValue("--ButtonBgColor");
        theme.style.setProperty("--NodesButtonBgColor", color);

        var focusColor = style.getPropertyValue("--ButtonBgFocusColor");
        theme.style.setProperty("--NodesButtonBgFocusColor", focusColor);
    }

    if (currentThemeColor == DarkThemeColor)
    {
        document.getElementById("img1").setAttribute("src", "/static/main/images/undo.png");
        document.getElementById("img2").setAttribute("src", "/static/main/images/redo.png");

        var imagePath = "/static/main/images/thickness1.png";
        if (currentThickness == Thickness.TWO)
            imagePath = "/static/main/images/thickness2.png";
        else if (currentThickness == Thickness.THREE)
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
        if (currentThickness == Thickness.TWO)
            imagePath = "/static/main/images/thickness2_light.png";
        else if (currentThickness == Thickness.THREE)
            imagePath = "/static/main/images/thickness3_light.png";
    
        document.getElementById("img4").setAttribute("src", imagePath);
        document.getElementById("img41").setAttribute("src", "/static/main/images/thickness1_light.png");
        document.getElementById("img42").setAttribute("src", "/static/main/images/thickness2_light.png");
        document.getElementById("img43").setAttribute("src", "/static/main/images/thickness3_light.png");
        document.getElementById("img5").setAttribute("src", "/static/main/images/dark.png");
    }

    RefreshScene();
}
