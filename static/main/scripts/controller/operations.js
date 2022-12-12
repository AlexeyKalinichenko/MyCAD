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
            this.refrashSceneCallback();
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
        this.refrashSceneCallback();
    };
}

export class RedoOperation extends OperationController {

    Operate = function()
    {
        let documentId = 0;
        Cn.RequestGet(Connector.RequestEnum.Redo, [documentId]);
        this.curStatus = OperationController.OperationStatus.Completed;
        this.refrashSceneCallback();
    };
}

export class LineOperation extends OperationController {

    startPos = { x: null, y: null };
    lineId = null;

    Operate = function()
    {
        if (this.curStep == 0)
        {
            if (this.selectedMousePos.x != null)
            {
                this.startPos.x = this.selectedMousePos.x;
                this.startPos.y = this.selectedMousePos.y;

                this.selectedMousePos.x = null;
                this.selectedMousePos.y = null;

                ++this.curStep;
            }
        }
        else if (this.curStep == 1)
        {
            if (this.curMousePos.x != null)
            {
                let documentId = 0;
                let data = { positions: [
                    { x: this.startPos.x, y: this.startPos.y },
                    { x: this.curMousePos.x, y: this.curMousePos.y }
                ] };
	            let body = 'docId=' + encodeURIComponent(documentId) + '&data=' + encodeURIComponent(JSON.stringify(data));

                let response = Cn.RequestPost(Connector.RequestEnum.CreateLine, body);
                this.lineId = response.objId;

                ++this.curStep;
            }
        }
        else if (this.curStep == 2)
        {
            if (this.curMousePos.x != null)
            {
                let documentId = 0;
                let data = { index: 1, position: { x: this.curMousePos.x, y: this.curMousePos.y } };
                let body = 'docId=' + encodeURIComponent(documentId) + '&objId=' + encodeURIComponent(this.lineId) +
                    '&data=' + encodeURIComponent(JSON.stringify(data));

                Cn.RequestPost(Connector.RequestEnum.EditLine, body);
                this.refrashSceneCallback();
            }

            if (this.selectedMousePos.x != null)
            {
                ++this.curStep;
            }
        }
        else if (this.curStep == 3)
        {
            let documentId = 0;
            Cn.RequestGet(Connector.RequestEnum.Commit, [documentId]);
            Cn.RequestGet(Connector.RequestEnum.SaveDocument, [documentId]);
            this.curStatus = OperationController.OperationStatus.Completed;
            this.refrashSceneCallback();
        }
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
            this.refrashSceneCallback();
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
            this.refrashSceneCallback();
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
            this.refrashSceneCallback();
        }
    };
}
