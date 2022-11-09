export class Storage {
    static ThicknessEnum  = { One: "one", Two: "two", Three: "three" };
    static SnapToEnum     = { None: "none", Node: "Node", Angle: "Angle" };
    static NodesEnum      = { On: "on", Off: "off" };
    static ThemeColorEnum = { Dark: "dark", Light: "light" };

    Thickness  = Storage.ThicknessEnum.Two;
    Snap       = Storage.SnapToEnum.None;
    Nodes      = Storage.NodesEnum.Off;

    ThemeColor = {
        editorBgColorDark: { R: 0.19, G: 0.22, B: 0.25, A: 1.0 },  // #303841
        editorBgColorLight: { R: 1.0, G: 1.0, B: 1.0, A: 1.0 },    // #ffffff

        Theme: Storage.ThemeColorEnum.Dark,
        GetColor: function() {
            return (this.Theme == Storage.ThemeColorEnum.Dark) ?
                this.editorBgColorDark : this.editorBgColorLight;
        }
    };
    
    LoadContext = function() {
        let theme = localStorage.getItem("ThemeColor");
        this.ThemeColor.Theme = theme ? theme : Storage.ThemeColorEnum.Dark;
        
        let thickness = localStorage.getItem("Thickness");
        this.Thickness = thickness ? thickness : Storage.ThicknessEnum.Two;

        let snap = localStorage.getItem("Snap");
        this.Snap = snap ? snap : Storage.SnapToEnum.None;

        let nodes = localStorage.getItem("Nodes");
        this.Nodes = nodes ? nodes : Storage.NodesEnum.Off;
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
}

export let St = new Storage();
