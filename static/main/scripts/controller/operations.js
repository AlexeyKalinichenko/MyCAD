import {OperationController} from "./operation_controller.js";
import {Connector, Cn} from "./connector.js";

export class OpenDocumentOperation extends OperationController {

    Operate = function()
    {
        if (this.stringData)
        {
            let body = 'data=' + encodeURIComponent(this.stringData);
            Cn.RequestPost(Connector.RequestEnum.OpenDocument, body);
            this.curStatus = OperationController.OperationStatus.Completed;
        }
    };
}

export class CloseDocumentOperation extends OperationController {

    Operate = function()
    {
        let documentId = 0;
        Cn.RequestGet(Connector.RequestEnum.CloseDocument, [documentId], true);
        this.curStatus = OperationController.OperationStatus.Completed;
    };
}

export class UndoOperation extends OperationController {

    Operate = function()
    {
        let documentId = 0;
        Cn.RequestGet(Connector.RequestEnum.Undo, [documentId]);
        this.curStatus = OperationController.OperationStatus.Completed;
    };
}

export class RedoOperation extends OperationController {

    Operate = function()
    {
        let documentId = 0;
        Cn.RequestGet(Connector.RequestEnum.Redo, [documentId]);
        this.curStatus = OperationController.OperationStatus.Completed;
    };
}

export class LineOperation extends OperationController {

    Operate = function()
    {
        // todo
    };
}

export class ClearOperation extends OperationController {

    Operate = function()
    {
        // todo
    };
}

export class SnapToNodeOperation extends OperationController {

    Operate = function()
    {
        // todo
    };
}

export class SnapToAngleOperation extends OperationController {

    Operate = function()
    {
        // todo
    };
}

export class NodesOperation extends OperationController {

    Operate = function()
    {
        if (this.stringData)
        {
            let documentId = 0;
            let body = 'docId=' + encodeURIComponent(documentId) + '&data=' + encodeURIComponent(this.stringData);
            Cn.RequestPost(Connector.RequestEnum.SetStyleData, body);
            this.curStatus = OperationController.OperationStatus.Completed;
        }
    };
}

export class ThicknessOperation extends OperationController {

    Operate = function()
    {
        if (this.stringData)
        {
            let documentId = 0;
            let body = 'docId=' + encodeURIComponent(documentId) + '&data=' + encodeURIComponent(this.stringData);
            Cn.RequestPost(Connector.RequestEnum.SetStyleData, body);
            this.curStatus = OperationController.OperationStatus.Completed;
        }
    };
}

export class ThemeOperation extends OperationController {

    Operate = function()
    {
        if (this.stringData)
        {
            let documentId = 0;
            let body = 'docId=' + encodeURIComponent(documentId) + '&data=' + encodeURIComponent(this.stringData);
            Cn.RequestPost(Connector.RequestEnum.SetStyleData, body);
            this.curStatus = OperationController.OperationStatus.Completed;
        }
    };
}
