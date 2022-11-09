// Классы и определения

class SessionManager {
    static ThicknessEnum  = { One: "one", Two: "two", Three: "three" };
    static SnapToEnum     = { None: "none", Node: "Node", Angle: "Angle" };
    static NodesEnum      = { On: "on", Off: "off" };
    static ThemeColorEnum = { Dark: "dark", Light: "light" };

    Thickness  = SessionManager.ThicknessEnum.Two;
    Snap       = SessionManager.SnapToEnum.None;
    Nodes      = SessionManager.NodesEnum.Off;

    ThemeColor = {
        editorBgColorDark: { R: 0.19, G: 0.22, B: 0.25, A: 1.0 },  // #303841
        editorBgColorLight: { R: 1.0, G: 1.0, B: 1.0, A: 1.0 },    // #ffffff

        Theme: SessionManager.ThemeColorEnum.Dark,
        GetColor: function() {
            return (this.Theme == SessionManager.ThemeColorEnum.Dark) ?
                this.editorBgColorDark : this.editorBgColorLight;
        }
    };
    
    LoadContext = function() {
        let theme = localStorage.getItem("ThemeColor");
        this.ThemeColor.Theme = theme ? theme : SessionManager.ThemeColorEnum.Dark;
        
        let thickness = localStorage.getItem("Thickness");
        this.Thickness = thickness ? thickness : SessionManager.ThicknessEnum.Two;

        let snap = localStorage.getItem("Snap");
        this.Snap = snap ? snap : SessionManager.SnapToEnum.None;

        let nodes = localStorage.getItem("Nodes");
        this.Nodes = nodes ? nodes : SessionManager.NodesEnum.Off;
    };

    SaveContext = function() {
        localStorage.setItem("ThemeColor", this.ThemeColor.Theme);
        localStorage.setItem("Thickness", this.Thickness);
        localStorage.setItem("Snap", this.Snap);
        localStorage.setItem("Nodes", this.Nodes);
    };

    resetContext = function() {
        localStorage.clear();
    };

    CheckSnapMode = function() {
        var theme = (this.ThemeColor.Theme == SessionManager.ThemeColorEnum.Dark) ?
                document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
        var style = window.getComputedStyle(theme);
        
        if (this.Snap == SessionManager.SnapToEnum.Node || this.Snap == SessionManager.SnapToEnum.Angle)
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
}

class EditorManager {
    static gl = null;
    static shaderProgram = null;
    static VerticesBuffer = [];

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
    
        this.InitShaders();
        CM.LoadSceneData();
        this.RefreshScene();
    }

    InitShaders = function() {
        var fragmentShader = this.GetShader(this.gl.FRAGMENT_SHADER, 'shader-fs');
        var vertexShader = this.GetShader(this.gl.VERTEX_SHADER, 'shader-vs');

        this.shaderProgram = this.gl.createProgram();

        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);

        this.gl.linkProgram(this.shaderProgram);

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS))
            alert("Failed to install shaders");

        this.gl.useProgram(this.shaderProgram);

        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    }

    GetShader = function(type, id) {
        var source = document.getElementById(id).innerHTML;
        var shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
        {
            alert("Shader compilation error: " + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);   
            return null;
        }
        return shader;
    }

    ClearScene = function(themeColor) {
        this.gl.clearColor(themeColor.R, themeColor.G, themeColor.B, themeColor.A);
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    RefreshScene = function() {
        
        let test = SM.ThemeColor.GetColor();
        
        this.ClearScene(SM.ThemeColor.GetColor());
        this.drawTempObjects();
    }

    drawTempObjects = function() {
        var coef = 1.971;
    
        let vertices = [
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
    
        let vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    
        this.gl.vertexAttribPointer(
            this.shaderProgram.vertexPositionAttribute,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT
        );
    
        this.gl.vertexAttribPointer(
            this.shaderProgram.vertexColorAttribute,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );
    
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3*10);
        this.gl.drawArrays(this.gl.POINTS, 30, 1*6);
    }
}

class ConnectionManager {
    LoadSceneData = function()
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + 'getdata/', false);
        xhr.send();
    
        let data = JSON.parse(xhr.responseText);
    
        EM.VerticesBuffer = data.vertices;
    }
}

let SM = null;
let CM = null;
let EM = null;


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
