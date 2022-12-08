import {OperationController} from "./operation_controller.js";
import {Connector, Ct} from "./connector.js";
import "./operations";

export class ApplicationController {

    static OperationId = {
        OpenDocument: 0,
        CloseDocument: 1,
        Undo: 2,
        Redo: 3,
        Line: 4,
        Clear: 5,
        SnapToNode: 6,
        SnapToAngle: 7,
        Nodes: 8,
        Thickness: 9,
        Theme: 10
    };

    curOperation = null;

    curButton = ButtonId.None;
    curMousePos = { x: null, y: null };

    RunOperation = function(opId)
    {
        let operation = null;

        switch(opId) {
            case OperationId.OpenDocument:
                operation = new OpenDocumentOperation();
                break;
            case OperationId.CloseDocument:
                operation = new CloseDocumentOperation();
                break;
            case OperationId.Undo:
                operation = new UndoOperation();
                break;
            case OperationId.Redo:
                operation = new RedoOperation();
                break;
            case OperationId.Line:
                operation = new LineOperation();
                break;
            case OperationId.Clear:
                operation = new ClearOperation();
                break;
            case OperationId.SnapToNode:
                operation = new SnapToNodeOperation();
                break;
            case OperationId.SnapToAngle:
                operation = new SnapToAngleOperation();
                break;
            case OperationId.Nodes:
                operation = new NodesOperation();
                break;
            case OperationId.Thickness:
                operation = new ThicknessOperation();
                break;
            case OperationId.Theme:
                operation = new ThemeOperation();
                break;
            default:
                console.log("Invalid operation ID");
        }

        this.curOperation = operation;
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
        let documentId = 0;
        Ct.RequestGet(Connector.RequestEnum.Rollback, [documentId]);
        this.curOperation = null;
    };

    Operate = function()
    {
        // todo
    };
}

export let Cn = new Controller();
