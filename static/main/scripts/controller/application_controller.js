import {OperationController} from "./operation_controller.js";
import {Connector, Cn} from "./connector.js";
import * as op from "./operations.js";

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

    curButton = OperationController.ButtonId.None;
    curMousePos = { x: null, y: null };
    selectedMousePos = { x: null, y: null };

    refrashSceneCallback = null;

    SetRefrashSceneCallback = function(callback)
    {
        this.refrashSceneCallback = callback;
    };

    RunOperation = function(opId)
    {
        let operation = null;

        switch(opId) {
            case ApplicationController.OperationId.OpenDocument:
                operation = new op.OpenDocumentOperation();
                break;
            case ApplicationController.OperationId.CloseDocument:
                operation = new op.CloseDocumentOperation();
                break;
            case ApplicationController.OperationId.Undo:
                operation = new op.UndoOperation();
                break;
            case ApplicationController.OperationId.Redo:
                operation = new op.RedoOperation();
                break;
            case ApplicationController.OperationId.Line:
                operation = new op.LineOperation();
                break;
            case ApplicationController.OperationId.Clear:
                operation = new op.ClearOperation();
                break;
            case ApplicationController.OperationId.SnapToNode:
                operation = new op.SnapToNodeOperation();
                break;
            case ApplicationController.OperationId.SnapToAngle:
                operation = new op.SnapToAngleOperation();
                break;
            case ApplicationController.OperationId.Nodes:
                operation = new op.NodesOperation();
                break;
            case ApplicationController.OperationId.Thickness:
                operation = new op.ThicknessOperation();
                break;
            case ApplicationController.OperationId.Theme:
                operation = new op.ThemeOperation();
                break;
            default:
                console.log("Invalid operation ID");
        }

        this.curOperation = operation;
        this.curOperation.SetRefrashSceneCallback(this.refrashSceneCallback);
        this.curOperation.Run();
    };

    SetIntData = function(data)
    {
        this.CheckOperationStatus();

        if (this.curOperation)
            this.curOperation.SetIntData(data);
    };

    SetDoubleData = function(data)
    {
        this.CheckOperationStatus();

        if (this.curOperation)
            this.curOperation.SetDoubleData(data);
    };

    SetStringData = function(data)
    {
        this.CheckOperationStatus();

        if (this.curOperation)
            this.curOperation.SetStringData(data);
    };

    ButtonEvent = function(butId)
    {
        this.curButton = butId;
        this.Operate();

        this.CheckOperationStatus();

        if (this.curOperation)
            this.curOperation.ButtonEvent(butId);
    };

    MouseMoveEvent = function(x, y)
    {
        this.curMousePos.x = x;
        this.curMousePos.y = y;
        this.Operate();

        this.CheckOperationStatus();

        if (this.curOperation)
            this.curOperation.MouseMoveEvent(x, y);
    };

    MouseClickEvent = function(x, y)
    {
        this.selectedMousePos.x = x;
        this.selectedMousePos.y = y;
        this.Operate();

        this.CheckOperationStatus();

        if (this.curOperation)
            this.curOperation.MouseClickEvent(x, y);
    };

    CheckOperationStatus = function()
    {
        if (this.curOperation)
        {
            let st = this.curOperation.GetStatus();
            if (st == OperationController.OperationStatus.Inactive ||
                st == OperationController.OperationStatus.Completed)
                this.curOperation = null;
        }
    };

    RollbackOperation = function()
    {
        this.CheckOperationStatus();

        if (this.curOperation)
        {
            let documentId = 0;
            Cn.RequestGet(Connector.RequestEnum.Rollback, [documentId]);
            this.curOperation = null;
        }
    };

    GetRenderingData = function()
    {
        let documentId = 0;
        Cn.RequestGet(Connector.RequestEnum.SaveDocument, [documentId]);
        let response = Cn.RequestGet(Connector.RequestEnum.GetRenderingData, [documentId]);
        return response.data;
    };

    Operate = function()
    {
        // todo
    };
}

export let Ac = new ApplicationController();
