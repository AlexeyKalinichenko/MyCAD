export class Controller {

    static OperationId = {
        Undo: 0,
        Redo: 1,
        Line: 2,
        Clear: 3,
        SnapToNode: 4,
        SnapToAngle: 5,
        Nodes: 6,
        Thickness: 7,
        Theme: 8
    };

    static ButtonId = {
        Enter: 0,
        Escape: 1
    };

    static curOperation = null;

    RunOperation = function(opId)
    {
        curOperation = opId;
        curOperation.Run();
    };

    SetIntData = function(data)
    {
        curOperation.SetIntData(data);
    };

    SetDoubleData = function(data)
    {
        curOperation.SetDoubleData(data);
    };

    SetStringData = function(data)
    {
        curOperation.SetStringData(data);
    };

    ButtonEvent = function(butId)
    {
        curOperation.ButtonEvent(butId);
    };

    MouseEvent = function(x, y)
    {
        curOperation.MouseEvent(x, y);
    };
}

export let Cn = new Controller();
