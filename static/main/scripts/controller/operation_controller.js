export class OperationController {

    static OperationStatus = {
        Inactive: 0,
        Inprogress: 1,
        Completed: 2
    };

    static ButtonId = {
        None: -1,
        Enter: 0,
        Escape: 1
    };

    curStep = -1;
    curStatus = OperationStatus.Inactive;

    indData = null;
    doubleData = null;
    stringData = null;

    curButton = ButtonId.None;
    curMousePos = { x: null, y: null };

    Run = function()
    {
        this.curStep = 0;
        this.curStatus = OperationStatus.Inprogress;
        this.Operate();
    };

    SetIntData = function(data)
    {
        this.indData = data;
        this.Operate();
    };

    SetDoubleData = function(data)
    {
        this.doubleData = data;
        this.Operate();
    };

    SetStringData = function(data)
    {
        this.stringData = data;
        this.Operate();
    };

    ButtonEvent = function(butId)
    {
        this.curButton = butId;
        this.Operate();
    };

    MouseEvent = function(x, y)
    {
        this.curMousePos.x = x;
        this.curMousePos.y = y;
        this.Operate();
    };

    GetStatus = function() { return this.curStatus; }

    Operate = function() {};
}
