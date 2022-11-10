export class Interface {
    //GetEditorColor
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
