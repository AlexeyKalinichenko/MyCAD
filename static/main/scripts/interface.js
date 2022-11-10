export class Interface {
    
    static ColorThemeEnum = { Dark: "dark", Light: "light" };
    static ThicknessEnum  = { One: "one", Two: "two", Three: "three" };
    static SnapToModeEnum = { None: "none", Node: "node", Angle: "angle" };
    static NodesModeEnum  = { On: "on", Off: "off" };
    
    static UIElementsEnum = {
        ButtonUndo: "undo",
        ButtonRedo: "redo",
        ButtonLine: "line",
        ButtonClear:  "clear",
        ButtonSnapTo: "snap-to",
        ButtonSnapToNode:  "snap-to-node",
        ButtonSnapToAngle: "snap-to-angle",
        ButtonNodes: "nodes",
        ButtonThickness:  "thickness",
        ButtonThickness1: "thickness-1",
        ButtonThickness2: "thickness-2",
        ButtonThickness3: "thickness-3",
        ButtonTheme:  "theme",
        TitleCoordX:  "coord-x",
        TitleCoordY:  "coord-y",
        TitleObjects: "objects"
    };

    static UIElements = [
        { name: Interface.UIElementsEnum.ButtonUndo, handler: null },
        { name: Interface.UIElementsEnum.ButtonRedo, handler: null },
        { name: Interface.UIElementsEnum.ButtonLine, handler: null },
        { name: Interface.UIElementsEnum.ButtonClear, handler: null },
        { name: Interface.UIElementsEnum.ButtonSnapTo, handler: null },
        { name: Interface.UIElementsEnum.ButtonSnapToNode, handler: null },
        { name: Interface.UIElementsEnum.ButtonSnapToAngle, handler: null },
        { name: Interface.UIElementsEnum.ButtonNodes, handler: null },
        { name: Interface.UIElementsEnum.ButtonThickness, handler: null },
        { name: Interface.UIElementsEnum.ButtonThickness1, handler: null },
        { name: Interface.UIElementsEnum.ButtonThickness2, handler: null },
        { name: Interface.UIElementsEnum.ButtonThickness3, handler: null },
        { name: Interface.UIElementsEnum.ButtonTheme, handler: null },
        { name: Interface.UIElementsEnum.TitleCoordX },
        { name: Interface.UIElementsEnum.TitleCoordY },
        { name: Interface.UIElementsEnum.TitleObjects }
    ];

    static DisplayMode = { ColorTheme: null, Thickness: null, SnapMode: null, NodeMode: null, Elements: null };
    
    SetColorTheme = function(theme) {
        Interface.displayMode.ColorTheme = theme;
        this.ChangeTheme(theme);
        this.UpdateElementsState();
    };

    SetThickness = function(thickness) { Interface.displayMode.Thickness = thickness; };
    SetSnapMode = function(snap) { Interface.displayMode.SnapMode = snap; };
    SetNodeMode = function(node) { Interface.displayMode.NodeMode = node; };

    SetDisplayMode = function(theme, thickness, snap, node) {
        SetColorTheme(theme);
        SetThickness(thickness);
        SetSnapMode(snap);
        SetNodeMode(node);
    };

    RegisterHandler = function(element, handler) {
        switch (element) {
            case "undo": document.getElementById("btn1").addEventListener("click", handler); break;
            case "redo": document.getElementById("btn2").addEventListener("click", handler); break;
            case "line": document.getElementById("btn3").addEventListener("click", handler); break;
            case "clear":   document.getElementById("btn4").addEventListener("click", handler); break;
            case "snap-to": document.getElementById("btn5").addEventListener("click", handler); break;
            case "snap-to-node":  document.getElementById("btn51").addEventListener("click", handler); break;
            case "snap-to-angle": document.getElementById("btn52").addEventListener("click", handler); break;
            case "nodes":   document.getElementById("btn6").addEventListener("click", handler); break;
            case "thickness":   document.getElementById("btn7").addEventListener("click", handler); break;
            case "thickness-1": document.getElementById("btn71").addEventListener("click", handler); break;
            case "thickness-2": document.getElementById("btn72").addEventListener("click", handler); break;
            case "thickness-3": document.getElementById("btn73").addEventListener("click", handler); break;
            case "theme":   document.getElementById("btn8").addEventListener("click", handler); break;
            case "coord-x": document.getElementById("coord_x").addEventListener("click", handler); break;
            case "coord-y": document.getElementById("coord_y").addEventListener("click", handler); break;
            case "objects": document.getElementById("stat").addEventListener("click", handler); break;
            default: throw "Invalid element";
        }
    };

    ChangeTheme = function(theme) {
        var divWindow = document.getElementsByClassName("window")[0];

        switch (theme) {
            case "dark":
                divWindow.classList.add("Dark-Theme");
                divWindow.classList.remove("Light-Theme");
                break;
            case "light":
                divWindow.classList.remove("Dark-Theme");
                divWindow.classList.add("Light-Theme");
                break;
            default:
                throw "Invalid theme";
        }

         // todo
    };

    ShowMenu = function(element) {
        switch (element) {
            case "snap-to": document.getElementById("btn5-menu").classList.toggle("show"); break;
            case "thickness": document.getElementById("btn7-menu").classList.toggle("show"); break;
            default: throw "Invalid element";
        }
    };

    UpdateText = function(element, value) {
        let domElement = null;
        let target = " ";
        
        switch(element) {
            case "coord-x": domElement = document.getElementById("coord_x"); break;
            case "coord-y": domElement = document.getElementById("coord_y"); break;
            default: throw "Invalid element";
        }
        
        let foundPos = domElement.textContent.indexOf(target);
        let prefix = domElement.textContent.slice(0, foundPos+1);
        domElement.textContent = prefix + value.toFixed(3);
    };

    UpdateElementsState = function() {};
}

export let Ui = new Interface();


/*
ThemeColor = {
    editorBgColorDark: { R: 0.19, G: 0.22, B: 0.25, A: 1.0 },  // #303841
    editorBgColorLight: { R: 1.0, G: 1.0, B: 1.0, A: 1.0 },    // #ffffff

    Theme: Storage.ThemeColorEnum.Dark,
    GetColor: function() {
        return (this.Theme == Storage.ThemeColorEnum.Dark) ?
            this.editorBgColorDark : this.editorBgColorLight;
    }
};
*/

/*
CheckSnapMode = function() {
    var theme = (this.ThemeColor.Theme == Storage.ThemeColorEnum.Dark) ?
            document.querySelector(".Dark-Theme") : document.querySelector(".Light-Theme");
    var style = window.getComputedStyle(theme);
    
    if (this.Snap == Storage.SnapToEnum.Node || this.Snap == Storage.SnapToEnum.Angle)
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
*/
