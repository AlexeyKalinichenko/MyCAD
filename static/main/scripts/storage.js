export class Storage {
    
    static ColorThemeEnum = { Dark: "dark", Light: "light" };
    static ThicknessEnum  = { One: "one", Two: "two", Three: "three" };
    static SnapToModeEnum = { None: "none", Node: "node", Angle: "angle" };
    static NodesModeEnum  = { On: "on", Off: "off" };

    ColorTheme = Storage.ColorThemeEnum.Dark;
    Thickness  = Storage.ThicknessEnum.Two;
    SnapToMode = Storage.SnapToModeEnum.None;
    NodesMode  = Storage.NodesModeEnum.Off;
    
    LoadState = function() {
        let theme = localStorage.getItem("ColorTheme");
        this.ColorTheme = theme ? theme : Storage.ColorThemeEnum.Dark;
        
        let thickness = localStorage.getItem("Thickness");
        this.Thickness = thickness ? thickness : Storage.ThicknessEnum.Two;

        let snap = localStorage.getItem("SnapToMode");
        this.SnapToMode = snap ? snap : Storage.SnapToModeEnum.None;

        let nodes = localStorage.getItem("NodesMode");
        this.NodesMode = nodes ? nodes : Storage.NodesModeEnum.Off;
    };

    SaveState = function() {
        localStorage.setItem("ColorTheme", this.ColorTheme);
        localStorage.setItem("Thickness", this.Thickness);
        localStorage.setItem("SnapToMode", this.SnapToMode);
        localStorage.setItem("NodesMode", this.NodesMode);
    };

    ResetState = function() {
        localStorage.clear();
    };
}

export let St = new Storage();
