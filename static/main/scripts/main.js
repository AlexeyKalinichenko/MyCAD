import {Storage, St} from "./storage.js";
import {Interface, Ui} from "./interface.js";
import {Connector, Cn} from "./connector.js";
import {Editor, Ed} from "./editor.js";


window.onload = function()
{
    St.LoadState();
    Ui.SetDisplayMode(St.ColorTheme, St.Thickness, St.SnapToMode, St.NodesMode);
    Ed.SetColorTheme(St.ColorTheme);
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
        let coords = Ed.ConvertCoords(event.clientX, event.clientY);
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordX, coords[0]);
        Ui.UpdateText(Interface.UIElementsEnum.TitleCoordY, coords[1]);
    }
}

window.onkeydown = function(event)
{
}


Ui.RegisterHandler(Interface.UIElementsEnum.ButtonUndo, () => { alert("Btn Undo"); });
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonRedo, () => { alert("Btn Redo"); });
Ui.RegisterHandler(Interface.UIElementsEnum.ButtonLine, () => {
    //alert("Btn Line");
    //
    Ed.DrawScene(testBuffer);
    //
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonClear, () => { alert("Btn Clear"); });

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapTo, () => {
    Ui.ShowMenu(Interface.UIElementsEnum.ButtonSnapTo);
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToNode, () => {
    switch(St.SnapToMode) {
        case Storage.SnapToModeEnum.Node:
            St.SnapToMode = Storage.SnapToModeEnum.None;
            Ui.SetSnapMode(Interface.SnapToModeEnum.None);
            break;
        case Storage.SnapToModeEnum.Angle:
            St.SnapToMode = Storage.SnapToModeEnum.Both;
            Ui.SetSnapMode(Interface.SnapToModeEnum.Both);
            break;
        case Storage.SnapToModeEnum.Both:
            St.SnapToMode = Storage.SnapToModeEnum.Angle;
            Ui.SetSnapMode(Interface.SnapToModeEnum.Angle);
            break;
        default:
            St.SnapToMode = Storage.SnapToModeEnum.Node;
            Ui.SetSnapMode(Interface.SnapToModeEnum.Node);
    }
});

Ui.RegisterHandler(Interface.UIElementsEnum.ButtonSnapToAngle, () => {
    switch(St.SnapToMode) {
        case Storage.SnapToModeEnum.Node:
            St.SnapToMode = Storage.SnapToModeEnum.Both;
            Ui.SetSnapMode(Interface.SnapToModeEnum.Both);
            break;
        case Storage.SnapToModeEnum.Angle:
            St.SnapToMode = Storage.SnapToModeEnum.None;
            Ui.SetSnapMode(Interface.SnapToModeEnum.None);
            break;
        case Storage.SnapToModeEnum.Both:
            St.SnapToMode = Storage.SnapToModeEnum.Node;
            Ui.SetSnapMode(Interface.SnapToModeEnum.Node);
            break;
        default:
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
        Ed.SetColorTheme(Editor.ColorThemeEnum.Light);
    }
    else
    {
        St.ColorTheme = Storage.ColorThemeEnum.Dark;
        Ui.SetColorTheme(Interface.ColorThemeEnum.Dark);
        Ed.SetColorTheme(Editor.ColorThemeEnum.Dark);
    }
});

//
let testBuffer = {
    Indices: [
        { Figure: "triangles", Offset: 0, Count: 6 },
        { Figure: "points", Offset: 18, Count: 6 }
    ],
    ObjectsColor: { R: 0.85, G: 0.87, B: 0.91 },
    NodesColor: { R: 0.98, G: 0.68, B: 0.35 },
    Vertices: [
        { X: -0.4, Y: 0.4012, Z: 0.0 },
        { X:  0.4, Y:    0.4, Z: 0.0 },
        { X: -0.4, Y:    0.4, Z: 0.0 },

        { X:  0.4, Y:    0.4, Z: 0.0 },
        { X:  0.4, Y: 0.4012, Z: 0.0 },
        { X: -0.4, Y: 0.4012, Z: 0.0 },

        { X: -0.4, Y: 0.3025, Z: 0.0 },
        { X:  0.4, Y:    0.3, Z: 0.0 },
        { X: -0.4, Y:    0.3, Z: 0.0 },

        { X:  0.4, Y:    0.3, Z: 0.0 },
        { X:  0.4, Y: 0.3025, Z: 0.0 },
        { X: -0.4, Y: 0.3025, Z: 0.0 },

        { X: -0.4, Y:  0.205, Z: 0.0 },
        { X:  0.4, Y:    0.2, Z: 0.0 },
        { X: -0.4, Y:    0.2, Z: 0.0 },

        { X:  0.4, Y:    0.2, Z: 0.0 },
        { X:  0.4, Y:  0.205, Z: 0.0 },
        { X: -0.4, Y:  0.205, Z: 0.0 },

        { X:  0.4, Y: 0.4006, Z: 0.0 },

        { X: -0.4, Y: 0.4006, Z: 0.0 },

        { X:  0.4, Y: 0.3012, Z: 0.0 },

        { X: -0.4, Y: 0.3012, Z: 0.0 },

        { X:  0.4, Y: 0.2025, Z: 0.0 },

        { X: -0.4, Y: 0.2025, Z: 0.0 } 
    ]
};
//

/*
DrawObjects = function() {
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
};
*/
