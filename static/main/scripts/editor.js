export class Editor {

    static ColorThemeEnum = { Dark: "dark", Light: "light" };

    ColorTheme = Editor.ColorThemeEnum.Dark;
    
    gl = null;
    shaderProgram = null;
    
    static Coef = 1.971; // (w/h)

    SceneBuffer = {
        Vertices: [],   // { X: null, Y: null, Z: null }
        Indices: [],    // { Figure: null, Offset: null, Count: null }
        ObjectsColor: { R: null, G: null, B: null },
        NodesColor: { R: null, G: null, B: null }
    };

    constructor() {
        var canvas = document.getElementById("Editor");
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!this.gl)
        {
            alert("WebGL is not supported");
            return;
        }
        
        this.ResizeCanvas();
    }

    SetColorTheme = function(theme) {
        this.ColorTheme = theme;
        this.RefreshScene();
    };

    DrawScene = function(buffer) {
        this.SceneBuffer = buffer;
        this.RefreshScene();
    };

    ResizeCanvas = function() {
        var canvas = document.getElementById("Editor");
        var space = document.getElementById("space");
    
        canvas.setAttribute('width', space.offsetWidth);
        canvas.setAttribute('height', space.offsetHeight);

        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
    
        this.InitShaders();
        this.RefreshScene();
    };

    ConvertCoords = function(coordX, coordY) {
        let offsetX = - 0.009;
        let offsetY = 0.009;

        let glX = ((coordX - this.gl.viewportWidth / 2) / this.gl.viewportWidth) * 2 + offsetX;
        let glY = ((this.gl.viewportHeight / 2 - coordY) / this.gl.viewportHeight) * 2 + offsetY;

        return [glX, glY];
    };

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
    };

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
    };

    GetColor = function() {
        let selector = (this.ColorTheme == Editor.ColorThemeEnum.Dark) ? ".Dark-Theme" : ".Light-Theme";

        let style = window.getComputedStyle(document.querySelector(selector));
        let colorString = style.getPropertyValue("--EditorBgColor");

        let colorArray = colorString.match(/\d{1,}/g);
        let result = [];
        colorArray.forEach((element) => {
            result.push(Number((Number(element) / 255).toFixed(2)));
        });

        let alpha = 1;
        result.push(alpha);

        return result;
    };

    ClearScene = function() {
        let color = this.GetColor();
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };

    RefreshScene = function() {
        this.ClearScene();
        this.DrawObjects();
        this.DrawSpecialObjects();
    };

    GetVerticesArray = function() {
        let result = [];

        this.SceneBuffer.Vertices.forEach((element, index) => {
            result.push(element.X);
            result.push(element.Y * Editor.Coef);
            result.push(element.Z);

            let currentFigure = null;
            let currentColor = null;

            this.SceneBuffer.Indices.forEach((item) => {
                let figure = null;
                let numberOfIndices = null;

                switch (item.Figure) {
                    case "triangles":
                        figure = this.gl.TRIANGLES;
                        numberOfIndices = 3;
                        break;
                    case "points":
                        figure = this.gl.POINTS;
                        numberOfIndices = 1;
                        break;
                    default:
                        throw "Invalid figure";
                }

                if (index >= item.Offset && index < (numberOfIndices * item.Count))
                    currentFigure = figure;
            });

            currentColor = (currentFigure == this.gl.TRIANGLES) ?
                this.SceneBuffer.ObjectsColor : this.SceneBuffer.NodesColor;

            result.push(currentColor.R);
            result.push(currentColor.G);
            result.push(currentColor.B);
        });

        return result;
    };

    DrawObjects = function() {
        let vertices = this.GetVerticesArray();
        if (vertices.length == 0)
            return;
    
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
    
        this.SceneBuffer.Indices.forEach((element) => {
            let figure = null;
            let numberOfIndices = null;

            switch (element.Figure) {
                case "triangles":
                    figure = this.gl.TRIANGLES;
                    numberOfIndices = 3;
                    break;
                case "points":
                    figure = this.gl.POINTS;
                    numberOfIndices = 1;
                    break;
                default:
                    throw "Invalid figure";
            }

            this.gl.drawArrays(figure, element.Offset, numberOfIndices * element.Count);
        });
    };

    DrawSpecialObjects = function() {
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

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3*4);
    };
}

export let Ed = new Editor();
