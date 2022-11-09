import {Storage, St} from "./storage.js";

export class Editor {
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
        //CM.LoadSceneData();
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
        this.ClearScene(St.ThemeColor.GetColor());
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

export let Ed = new Editor();
