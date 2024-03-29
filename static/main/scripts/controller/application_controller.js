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

    documentId = 0;

    curButton = OperationController.ButtonId.None;
    curMousePos = { x: null, y: null };
    selectedMousePos = { x: null, y: null };

    refrashSceneCallback = null;

    needRefreshScene = false;

    snapToNodeMode = false;
    snapToAngleMode = false;

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
        this.curOperation.SetDocumentId(this.documentId);
        this.curOperation.SetSnapToNodeMode(this.snapToNodeMode);
        this.curOperation.SetSnapToAngleMode(this.snapToAngleMode);
        this.curOperation.SetRefrashSceneCallback(this.refrashSceneCallback);
        this.curOperation.Run();
    };

    SetIntData = function(data)
    {
        this.CheckOperationStatusBefore();

        if (this.curOperation)
            this.curOperation.SetIntData(data);

        this.CheckOperationStatusAfter();
    };

    SetDoubleData = function(data)
    {
        this.CheckOperationStatusBefore();

        if (this.curOperation)
            this.curOperation.SetDoubleData(data);

        this.CheckOperationStatusAfter();
    };

    SetStringData = function(data)
    {
        this.CheckOperationStatusBefore();

        if (this.curOperation)
            this.curOperation.SetStringData(data);

        this.CheckOperationStatusAfter();
    };

    ButtonEvent = function(butId)
    {
        this.curButton = butId;
        this.Operate();

        this.CheckOperationStatusBefore();

        if (this.curOperation)
            this.curOperation.ButtonEvent(butId);

        this.CheckOperationStatusAfter();
    };

    MouseMoveEvent = function(x, y)
    {
        this.curMousePos.x = x;
        this.curMousePos.y = y;
        this.Operate();

        this.CheckOperationStatusBefore();

        if (this.curOperation)
            this.curOperation.MouseMoveEvent(x, y);

        this.CheckOperationStatusAfter();
    };

    MouseClickEvent = function(x, y)
    {
        this.selectedMousePos.x = x;
        this.selectedMousePos.y = y;
        this.Operate();

        this.CheckOperationStatusBefore();

        if (this.curOperation)
            this.curOperation.MouseClickEvent(x, y);

        this.CheckOperationStatusAfter();
    };

    CheckOperationStatusBefore = function()
    {
        if (this.curOperation)
        {
            let st = this.curOperation.GetStatus();
            if (st == OperationController.OperationStatus.Inactive ||
                st == OperationController.OperationStatus.Completed)
                this.curOperation = null;
        }
    };

    CheckOperationStatusAfter = function()
    {
        if (this.curOperation && this.curOperation.GetResult().length > 0)
        {
            let data = JSON.parse(this.curOperation.GetResult());
            
            if ("SnapToNode" in data)
                this.snapToNodeMode = data.SnapToNode;
            else if ("SnapToAngle" in data)
                this.snapToAngleMode = data.SnapToAngle;
        }
    };

    RollbackOperation = function()
    {
        if (this.curOperation)
        {
            Cn.RequestGet(Connector.RequestEnum.Rollback, [this.documentId]);
            this.curOperation = null;
        }
    };

    GetRenderingData = function()
    {
        let response = Cn.RequestGet(Connector.RequestEnum.GetRenderingData, [this.documentId]);
        return response.data;
    };

    GetObjectsCount = function()
    {
        let response = Cn.RequestGet(Connector.RequestEnum.GetAllObjects, [this.documentId]);
        return response.objects.length;
    };

    Operate = function()
    {
        if (this.curButton == OperationController.ButtonId.Escape)
        {
            this.RollbackOperation();
            this.refrashSceneCallback();
            this.curButton = OperationController.ButtonId.None;
        }
        
        if (this.curMousePos.x != null && (this.curOperation == null || this.curOperation.highlightObjects))
        {
            let response1 = Cn.RequestGet(Connector.RequestEnum.GetAllObjects, [this.documentId]);
            let sceneObjects = response1.objects;

            let data = { radius: 0.02, position: { x: this.curMousePos.x, y: this.curMousePos.y } };

            let needToHighlight = [];

            for (let object of sceneObjects)
            {
                let body = 'docId=' + encodeURIComponent(this.documentId) +
                    '&objId=' + encodeURIComponent(object) + '&data=' + encodeURIComponent(JSON.stringify(data));

                let response2 = Cn.RequestPost(Connector.RequestEnum.IsLineUnderCursor, body);
                if (response2.topology != -1)
                    needToHighlight.push(object);
            }

            if (this.needRefreshScene)
            {
                this.refrashSceneCallback();
                this.needRefreshScene = false;
            }

            if (needToHighlight.length != 0)
            {
                Cn.RequestGet(Connector.RequestEnum.HighlightObject, [this.documentId, needToHighlight[0]]);
                this.refrashSceneCallback();
                this.needRefreshScene = true;
            }
        }
    };
}

export let Ac = new ApplicationController();
