class OperationController {

    static OperationStatus = {
        Inactive: 0,
        Inprogress: 1,
        Completed: 2
    };

    curStep = -1;

    indData = -1;
    doubleData = -1;
    stringData = -1;

    curButton = -1;
    curMousePos = -1;

    Run = function() {};

    Operate = function() {};

    SetIntData = function(data) {};

    SetDoubleData = function(data) {};

    SetStringData = function(data) {};

    ButtonEvent = function(butId) {};

    MouseEvent = function(x, y) {};
}
