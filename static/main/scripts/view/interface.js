export class Interface {

    static BaseDir = "/static/main/images/";
    
    static ColorThemeEnum = { Dark: "dark", Light: "light" };
    static ThicknessEnum  = { One: "one", Two: "two", Three: "three" };
    static SnapToModeEnum = { None: "none", Node: "node", Angle: "angle", Both: "both" };
    static NodesModeEnum  = { On: "on", Off: "off" };

    static ObjectColorsEnum = {
        Objects: 0,
        Highlighted: 1,
        Nodes: 2
    };

    static UIElementsEnum = {
        ButtonUndo: "undo",
        ButtonRedo: "redo",
        ButtonLine: "line",
        ButtonClear:  "clear",
        ButtonSnapTo: "snap-to",
        ButtonSnapToNode:  "snap-to-node",
        ButtonSnapToAngle: "snap-to-angle",
        ButtonNodes:       "nodes",
        ButtonThickness:  "thickness",
        ButtonThickness1: "thickness-1",
        ButtonThickness2: "thickness-2",
        ButtonThickness3: "thickness-3",
        ButtonTheme:  "theme",
        TitleCoordX:  "coord-x",
        TitleCoordY:  "coord-y",
        TitleObjects: "objects"
    };

    DisplayMode = { ColorTheme: null, Thickness: null, SnapMode: null, NodeMode: null };

    swowMenu = false;
    
    SetColorTheme = function(theme, update = true) {
        this.DisplayMode.ColorTheme = theme;
        this.ChangeTheme(theme);

        if (update)
            this.UpdateSpecialElements();
    };

    SetThickness = function(thickness, update = true) {
        this.DisplayMode.Thickness = thickness;

        if (update)
            this.UpdateSpecialElements();
    };

    SetSnapMode = function(snap, update = true) {
        this.DisplayMode.SnapMode = snap;

        if (update)
            this.UpdateSpecialElements();
    };

    SetNodeMode = function(node, update = true) {
        this.DisplayMode.NodeMode = node;

        if (update)
            this.UpdateSpecialElements();
    };

    SetDisplayMode = function(theme, thickness, snap, node) {
        this.SetColorTheme(theme, false);
        this.SetThickness(thickness, false);
        this.SetSnapMode(snap, false);
        this.SetNodeMode(node, false);
        
        this.UpdateSpecialElements();
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
        
        if (theme == "dark")
        {
            divWindow.classList.add("Dark-Theme");
            divWindow.classList.remove("Light-Theme");
        }
        else
        {
            divWindow.classList.remove("Dark-Theme");
            divWindow.classList.add("Light-Theme");
        }
    };

    ShowMenu = function(element) {
        switch (element) {
            case "snap-to": document.getElementById("btn5-menu").classList.toggle("show"); break;
            case "thickness": document.getElementById("btn7-menu").classList.toggle("show"); break;
            default: throw "Invalid element";
        }

        this.swowMenu = true;
    };

    HideAllMenu = function() {
        if (this.swowMenu)
        {
            this.swowMenu = false;
            return;
        }

        document.getElementById("btn5-menu").classList.remove("show");
        document.getElementById("btn7-menu").classList.remove("show");
    }

    UpdateText = function(element, value) {
        let domElement = null;
        let target = " ";
        
        switch(element) {
            case "coord-x": domElement = document.getElementById("coord_x"); break;
            case "coord-y": domElement = document.getElementById("coord_y"); break;
            case "objects": domElement = document.getElementById("stat"); break;
            default: throw "Invalid element";
        }

        let foundPos = domElement.textContent.indexOf(target);
        let prefix = domElement.textContent.slice(0, foundPos+1);
        
        if (element == Interface.UIElementsEnum.TitleCoordX ||
            element == Interface.UIElementsEnum.TitleCoordY)
        {
            domElement.textContent = prefix + value.toFixed(3);
        }
        else if (element == Interface.UIElementsEnum.TitleObjects)
        {
            domElement.textContent = prefix + value;
        }
    };

    SetElementImage = function(tag, image) {
        document.getElementById(tag).setAttribute("src", Interface.BaseDir + image);
    };

    SetElementColor = function(selector, paramSource, paramTarget) {
        let st = window.getComputedStyle(document.querySelector(selector));
        let value = st.getPropertyValue(paramSource);

        document.querySelector(selector).style.setProperty(paramTarget, value);   
    };

    UpdateSpecialElements = function() {
        // button Undo
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
            this.SetElementImage("img1", "undo.png");
        else
            this.SetElementImage("img1", "undo_light.png");

        // button Redo
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
            this.SetElementImage("img2", "redo.png");
        else
            this.SetElementImage("img2", "redo_light.png");
        
        // button SnapTo
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
        {
            if (this.DisplayMode.SnapMode != Interface.SnapToModeEnum.None)
            {
                this.SetElementColor(".Dark-Theme", "--ButtonBgSelectedColor", "--SnapToButtonBgColor");
                this.SetElementColor(".Dark-Theme", "--ButtonBgSelectedFocusColor", "--SnapToButtonBgFocusColor");
                this.SetElementColor(".Dark-Theme", "--ButtonTextSelectedColor", "--SnapToButtonTextColor");
            }
            else
            {
                this.SetElementColor(".Dark-Theme", "--ButtonBgColor", "--SnapToButtonBgColor");
                this.SetElementColor(".Dark-Theme", "--ButtonBgFocusColor", "--SnapToButtonBgFocusColor");
                this.SetElementColor(".Dark-Theme", "--ButtonTextColor", "--SnapToButtonTextColor");
            }
        }
        else
        {
            if (this.DisplayMode.SnapMode != Interface.SnapToModeEnum.None)
            {
                this.SetElementColor(".Light-Theme", "--ButtonBgSelectedColor", "--SnapToButtonBgColor");
                this.SetElementColor(".Light-Theme", "--ButtonBgSelectedFocusColor", "--SnapToButtonBgFocusColor");
                this.SetElementColor(".Light-Theme", "--ButtonTextSelectedColor", "--SnapToButtonTextColor");
            }
            else
            {
                this.SetElementColor(".Light-Theme", "--ButtonBgColor", "--SnapToButtonBgColor");
                this.SetElementColor(".Light-Theme", "--ButtonBgFocusColor", "--SnapToButtonBgFocusColor");
                this.SetElementColor(".Light-Theme", "--ButtonTextColor", "--SnapToButtonTextColor");
            }
        }

        // button SnapToNode
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
        {
            if (this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Node ||
                this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Both)
            {
                this.SetElementColor(".Dark-Theme", "--MenuSelectedBgColor", "--SnapToNodeButtonColor");
                this.SetElementColor(".Dark-Theme", "--ButtonBgSelectedFocusColor", "--SnapToNodeButtonFocusColor");
            }
            else
            {
                this.SetElementColor(".Dark-Theme", "--MenuBgColor", "--SnapToNodeButtonColor");
                this.SetElementColor(".Dark-Theme", "--MenuBgFocusColor", "--SnapToNodeButtonFocusColor");
            }
        }
        else
        {
            if (this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Node ||
                this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Both)
            {
                this.SetElementColor(".Light-Theme", "--MenuSelectedBgColor", "--SnapToNodeButtonColor");
                this.SetElementColor(".Light-Theme", "--ButtonBgSelectedFocusColor", "--SnapToNodeButtonFocusColor");
            }
            else
            {
                this.SetElementColor(".Light-Theme", "--MenuBgColor", "--SnapToNodeButtonColor");
                this.SetElementColor(".Light-Theme", "--MenuBgFocusColor", "--SnapToNodeButtonFocusColor");
            }
        }

        // button SnapToAngle
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
        {
            if (this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Angle ||
                this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Both)
            {
                this.SetElementColor(".Dark-Theme", "--MenuSelectedBgColor", "--SnapToAngleButtonColor");
                this.SetElementColor(".Dark-Theme", "--ButtonBgSelectedFocusColor", "--SnapToAngleButtonFocusColor");
            }
            else
            {
                this.SetElementColor(".Dark-Theme", "--MenuBgColor", "--SnapToAngleButtonColor");
                this.SetElementColor(".Dark-Theme", "--MenuBgFocusColor", "--SnapToAngleButtonFocusColor");
            }
        }
        else
        {
            if (this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Angle ||
                this.DisplayMode.SnapMode == Interface.SnapToModeEnum.Both)
            {
                this.SetElementColor(".Light-Theme", "--MenuSelectedBgColor", "--SnapToAngleButtonColor");
                this.SetElementColor(".Light-Theme", "--ButtonBgSelectedFocusColor", "--SnapToAngleButtonFocusColor");
            }
            else
            {
                this.SetElementColor(".Light-Theme", "--MenuBgColor", "--SnapToAngleButtonColor");
                this.SetElementColor(".Light-Theme", "--MenuBgFocusColor", "--SnapToAngleButtonFocusColor");
            }
        }

        // button nodes
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
        {
            if (this.DisplayMode.NodeMode == Interface.NodesModeEnum.On)
            {
                this.SetElementColor(".Dark-Theme", "--ButtonBgSelectedColor", "--NodesButtonBgColor");
                this.SetElementColor(".Dark-Theme", "--ButtonBgSelectedFocusColor", "--NodesButtonBgFocusColor");
            }
            else
            {
                this.SetElementColor(".Dark-Theme", "--ButtonBgColor", "--NodesButtonBgColor");
                this.SetElementColor(".Dark-Theme", "--ButtonBgFocusColor", "--NodesButtonBgFocusColor");
            }
        }
        else
        {
            if (this.DisplayMode.NodeMode == Interface.NodesModeEnum.On)
            {
                this.SetElementColor(".Light-Theme", "--ButtonBgSelectedColor", "--NodesButtonBgColor");
                this.SetElementColor(".Light-Theme", "--ButtonBgSelectedFocusColor", "--NodesButtonBgFocusColor");
            }
            else
            {
                this.SetElementColor(".Light-Theme", "--ButtonBgColor", "--NodesButtonBgColor");
                this.SetElementColor(".Light-Theme", "--ButtonBgFocusColor", "--NodesButtonBgFocusColor");
            }
        }

        // button thickness
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
        {
            switch(this.DisplayMode.Thickness) {
                case Interface.ThicknessEnum.One: this.SetElementImage("img4", "thickness1.png"); break;
                case Interface.ThicknessEnum.Two: this.SetElementImage("img4", "thickness2.png"); break;
                case Interface.ThicknessEnum.Three: this.SetElementImage("img4", "thickness3.png"); break;
            }
        }
        else
        {
            switch(this.DisplayMode.Thickness) {
                case Interface.ThicknessEnum.One: this.SetElementImage("img4", "thickness1_light.png"); break;
                case Interface.ThicknessEnum.Two: this.SetElementImage("img4", "thickness2_light.png"); break;
                case Interface.ThicknessEnum.Three: this.SetElementImage("img4", "thickness3_light.png"); break;
            }
        }

        // button thickness 1
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
            this.SetElementImage("img41", "thickness1.png");
        else
            this.SetElementImage("img41", "thickness1_light.png");

        // button thickness 2
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
            this.SetElementImage("img42", "thickness2.png");
        else
            this.SetElementImage("img42", "thickness2_light.png");

        // button thickness 3
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
            this.SetElementImage("img43", "thickness3.png");
        else
            this.SetElementImage("img43", "thickness3_light.png");
        
        // button theme
        if (this.DisplayMode.ColorTheme == Interface.ColorThemeEnum.Dark)
            this.SetElementImage("img5", "light.png");
        else
            this.SetElementImage("img5", "dark.png");
    };

    GetCurrentColor = function(objectType)
    {
        let parameter = null;

        switch(objectType) {
            case Interface.ObjectColorsEnum.Objects:
                parameter = "--ObjectsColor";
                break;
            case Interface.ObjectColorsEnum.Highlighted:
                parameter = "--HighlightedColor";
                break;
            case Interface.ObjectColorsEnum.Nodes:
                parameter = "--NodesColor";
                break;
        }

        let selector = null;

        switch(this.DisplayMode.ColorTheme) {
            case Interface.ColorThemeEnum.Dark:
                selector = ".Dark-Theme";
                break;
            case Interface.ColorThemeEnum.Light:
                selector = ".Light-Theme";
                break;
        }

        let st = window.getComputedStyle(document.querySelector(selector));
        let color = st.getPropertyValue(parameter);

        let colorArray = color.match(/\d{1,}/g);
        let result = [];
        colorArray.forEach((element) => {
            result.push(Number((Number(element) / 255).toFixed(2)));
        });

        let alpha = 1;
        result.push(alpha);

        return result;
    };

    GetCurrentThickness = function()
    {
        let parameter = null;

        switch(this.DisplayMode.Thickness) {
            case Interface.ThicknessEnum.One:
                parameter = "--thicknessOne";
                break;
            case Interface.ThicknessEnum.Two:
                parameter = "--thicknessTwo";
                break;
            case Interface.ThicknessEnum.Three:
                parameter = "--thicknessThree";
                break;
        }

        let st = window.getComputedStyle(document.querySelector("html"));
        return Number(st.getPropertyValue(parameter));
    };
}

export let Ui = new Interface();
