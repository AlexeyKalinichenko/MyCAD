export class OperationController {

    static OperationStatus = {
        Inactive: 0,
        Inprogress: 1,
        Completed: 2
    };

    static ButtonId = {
        None: -1,
        Enter: 0,
        Escape: 1,
        Click: 2
    };

    curStep = -1;
    curStatus = OperationController.OperationStatus.Inactive;

    documentId = -1;

    intData = null;
    doubleData = null;
    stringData = null;

    curButton = OperationController.ButtonId.None;
    curMousePos = { x: null, y: null };
    selectedMousePos = { x: null, y: null };

    highlightObjects = false;

    refrashSceneCallback = null;

    snapToNodeMode = false;
    snapToAngleMode = false;

    result = "";

    SetRefrashSceneCallback = function(callback)
    {
        this.refrashSceneCallback = callback;
    };

    SetSnapToNodeMode = function(mode)
    {
        this.snapToNodeMode = mode;
    };

    SetSnapToAngleMode = function(mode)
    {
        this.snapToAngleMode = mode;
    };

    Run = function()
    {
        this.curStep = 0;
        this.curStatus = OperationController.OperationStatus.Inprogress;
        this.Operate();
    };

    SetDocumentId = function(id)
    {
        this.documentId = id;
    };

    SetIntData = function(data)
    {
        this.intData = data;
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

    MouseMoveEvent = function(x, y)
    {
        this.curMousePos.x = x;
        this.curMousePos.y = y;
        this.Operate();
    };

    MouseClickEvent = function(x, y)
    {
        this.selectedMousePos.x = x;
        this.selectedMousePos.y = y;
        this.Operate();
    };

    GetStatus = function() { return this.curStatus; }

    GetResult = function()
    {
        return (this.curStatus == OperationController.OperationStatus.Completed) ? this.result : "";
    }

    Operate = function() {};
}
