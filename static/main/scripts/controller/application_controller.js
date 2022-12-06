import {OperationController} from "./operation_controller.js";
import {Connector, Ct} from "./connector.js";

export class ApplicationController {

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

    curOperation = null;

    curButton = ButtonId.None;
    curMousePos = { x: null, y: null };

    RunOperation = function(opId)
    {
        this.curOperation = opId;
        this.curOperation.Run();
    };

    SetIntData = function(data)
    {
        this.curOperation.SetIntData(data);
    };

    SetDoubleData = function(data)
    {
        this.curOperation.SetDoubleData(data);
    };

    SetStringData = function(data)
    {
        this.curOperation.SetStringData(data);
    };

    ButtonEvent = function(butId)
    {
        this.curButton = butId;
        this.Operate();

        this.curOperation.ButtonEvent(butId);
    };

    MouseEvent = function(x, y)
    {
        this.curMousePos.x = x;
        this.curMousePos.y = y;
        this.Operate();

        this.curOperation.MouseEvent(x, y);
    };

    CheckOperationStatus = function()
    {
        st = this.curOperation.GetStatus();
        if (st == OperationController.OperationStatus.Inactive ||
            st == OperationController.OperationStatus.Completed)
            this.curOperation = null;
    };

    RollbackOperation = function()
    {
        // todo
    };

    Operate = function()
    {
        // todo
    };
}

export let Cn = new Controller();
