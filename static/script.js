var gl;
var shaderProgram;
var vertexBuffer; // буфер вершин
var indexBuffer;  // буфер индексов

var verticesBuffer = [];
var indicesBuffer = [];

var indexCounter = 0;

var lastXgl = 0;
var lastYgl = 0;

const ControllerSteps = { POINT1: 0, POINT2: 1, DRAWING: 2 };
var step = ControllerSteps.POINT1;

// установка шейдеров
function initShaders()
{
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Не удалось установить шейдеры");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}

// Функция создания шейдера
function getShader(type, id)
{
    var source = document.getElementById(id).innerHTML;
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);   
        return null;
    }
    return shader;  
}

function ClearScene()
{
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function RefreshScene()
{
    ClearScene();
    drawScene();
}

function drawLine(x1, y1, x2, y2)
{
    addLine(x1, y1, x2, y2);
    drawScene();
}

function drawTempLine(x1, y1, x2, y2)
{
    vertices = [x1, y1, 0.0, x2, y2, 0.0];
    indices = [0, 1];

    draw(vertices, indices);
}

function drawScene()
{
    vertices = verticesBuffer;
    indices = indicesBuffer;

    draw(vertices, indices);
}

function draw(vertices, indices)
{
    // установка буфера вершин
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;

    // создание буфера индексов
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // указываем число индексов это число равно числу индексов
    indexBuffer.numberOfItems = indices.length;

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // отрисовка треугольников
    gl.drawElements(gl.LINES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);
}

function addLine(x1, y1, x2, y2)
{
    verticesBuffer.push(x1);
    verticesBuffer.push(y1);
    verticesBuffer.push(0.0);

    verticesBuffer.push(x2);
    verticesBuffer.push(y2);
    verticesBuffer.push(0.0);

    indicesBuffer.push(indexCounter++);
    indicesBuffer.push(indexCounter++);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url + 'setdata/', false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('X-CSRFToken', csrf_token);

    var body = 'vertices=' + encodeURIComponent(verticesBuffer) +
        '&indices=' + encodeURIComponent(indicesBuffer) +
        '&counter=' + encodeURIComponent(indexCounter);
    xhr.send(body);
}

function loadSceneData()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url + 'getdata/', false);
    xhr.send();

    data = JSON.parse(xhr.responseText);

    verticesBuffer = data.vertices;
    indicesBuffer = data.indices;
    indexCounter = data.counter;
}

window.onload = window.onresize = function()
{
    var canvas = document.getElementById("Editor");

    canvas.setAttribute('width', document.documentElement.clientWidth);
    canvas.setAttribute('height', document.documentElement.clientHeight);

    try
    {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
   
    if (!gl)
    {
        alert("Ваш браузер не поддерживает WebGL");
    }
    
    if(gl)
    {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();
        loadSceneData();
        RefreshScene();
    }
}

window.onclick = function(me)
{
    var offsetX = - 0.009;
    var offsetY = 0.009;

    var Xgl = ((me.clientX - gl.viewportWidth / 2) / gl.viewportWidth) * 2 + offsetX;
    var Ygl = ((gl.viewportHeight / 2 - me.clientY) / gl.viewportHeight) * 2 + offsetY;

    if(step == ControllerSteps.POINT1)
    {
        lastXgl = Xgl;
        lastYgl = Ygl;

        step = ControllerSteps.DRAWING;
    }
    else if (step == ControllerSteps.DRAWING)
    {
        RefreshScene();
        drawLine(lastXgl, lastYgl, Xgl, Ygl);

        lastXgl = 0;
        lastYgl = 0;

        step = ControllerSteps.POINT1;
    }
}

window.onmousemove = function(me)
{
    if(step == ControllerSteps.DRAWING)
    {
        var offsetX = - 0.009;
        var offsetY = 0.009;

        var Xgl = ((me.clientX - gl.viewportWidth / 2) / gl.viewportWidth) * 2 + offsetX;
        var Ygl = ((gl.viewportHeight / 2 - me.clientY) / gl.viewportHeight) * 2 + offsetY;

        RefreshScene();
        drawTempLine(lastXgl, lastYgl, Xgl, Ygl);
    }
}

window.onkeydown = function(e)
{
    if (e.code != "Backspace")
        return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url + 'clearScene/', false);
    xhr.send();

    verticesBuffer = [];
    indicesBuffer = [];
    indexCounter = 0;

    ClearScene();
}














