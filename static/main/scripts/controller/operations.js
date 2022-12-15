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
        Cn.RequestGet(Connector.RequestEnum.CloseDocument, [this.documentId], true);
        this.curStatus = OperationController.OperationStatus.Completed;
    };
}

export class UndoOperation extends OperationController {

    Operate = function()
    {
        Cn.RequestGet(Connector.RequestEnum.Undo, [this.documentId]);
        this.curStatus = OperationController.OperationStatus.Completed;
        this.refrashSceneCallback();
    };
}

export class RedoOperation extends OperationController {

    Operate = function()
    {
        Cn.RequestGet(Connector.RequestEnum.Redo, [this.documentId]);
        this.curStatus = OperationController.OperationStatus.Completed;
        this.refrashSceneCallback();
    };
}

export class LineOperation extends OperationController {

    startPos = { x: null, y: null };
    lineId = null;
    ids = null;

    Operate = function()
    {
        if (this.curStep == 0)
        {
            if (this.selectedMousePos.x != null)
            {
                this.startPos.x = this.selectedMousePos.x;
                this.startPos.y = this.selectedMousePos.y;

                this.ids = Cn.RequestGet(Connector.RequestEnum.GetAllObjects, [this.documentId]);

                if (this.snapToNodeMode)
                {
                    let sceneObjects = this.ids.objects;
                    let data = { radius: 0.05, position: { x: this.selectedMousePos.x, y: this.selectedMousePos.y } };
                    let nearestNode = null;

                    for (let object of sceneObjects)
                    {
                        let body = 'docId=' + encodeURIComponent(this.documentId) +
                            '&objId=' + encodeURIComponent(object) + '&data=' + encodeURIComponent(JSON.stringify(data));

                        let response2 = Cn.RequestPost(Connector.RequestEnum.IsLineUnderCursor, body);
                        if (response2.topology == 0 || response2.topology == 1)
                        {
                            nearestNode = { id: object, topology: response2.topology };
                            break;
                        }
                    }

                    if (nearestNode)
                    {
                        let pos = Cn.RequestGet(Connector.RequestEnum.GetLineNode,
                            [this.documentId, nearestNode.id, nearestNode.topology]);
                        
                        this.startPos.x = pos.position.x;
                        this.startPos.y = pos.position.y;
                    }
                }

                this.selectedMousePos.x = null;
                this.selectedMousePos.y = null;

                ++this.curStep;
            }
        }
        else if (this.curStep == 1)
        {
            if (this.curMousePos.x != null)
            {
                let data = { positions: [
                    { x: this.startPos.x, y: this.startPos.y },
                    { x: this.curMousePos.x, y: this.curMousePos.y }
                ] };
	            let body = 'docId=' + encodeURIComponent(this.documentId) + '&data=' + encodeURIComponent(JSON.stringify(data));

                let response = Cn.RequestPost(Connector.RequestEnum.CreateLine, body);
                this.lineId = response.objId;

                ++this.curStep;
            }
        }
        else if (this.curStep == 2)
        {
            if (this.curMousePos.x != null)
            {
                let data = { index: 1, position: { x: this.curMousePos.x, y: this.curMousePos.y } };
                let body = 'docId=' + encodeURIComponent(this.documentId) + '&objId=' + encodeURIComponent(this.lineId) +
                    '&data=' + encodeURIComponent(JSON.stringify(data));

                Cn.RequestPost(Connector.RequestEnum.EditLine, body);

                if (this.snapToNodeMode)
                {
                    let sceneObjects = this.ids.objects;
                    let data = { radius: 0.02, position: { x: this.curMousePos.x, y: this.curMousePos.y } };
                    let nearestNode = null;

                    for (let object of sceneObjects)
                    {
                        let body = 'docId=' + encodeURIComponent(this.documentId) +
                            '&objId=' + encodeURIComponent(object) + '&data=' + encodeURIComponent(JSON.stringify(data));

                        let response2 = Cn.RequestPost(Connector.RequestEnum.IsLineUnderCursor, body);
                        if (response2.topology == 0 || response2.topology == 1)
                        {
                            nearestNode = { id: object, topology: response2.topology };
                            break;
                        }
                    }

                    if (nearestNode)
                    {
                        let pos = Cn.RequestGet(Connector.RequestEnum.GetLineNode,
                            [this.documentId, nearestNode.id, nearestNode.topology]);

                        let data = { index: 1, position: { x: pos.position.x, y: pos.position.y } };
                        let body = 'docId=' + encodeURIComponent(this.documentId) +
                            '&objId=' + encodeURIComponent(this.lineId) + '&data=' + encodeURIComponent(JSON.stringify(data));

                        Cn.RequestPost(Connector.RequestEnum.EditLine, body);
                    }
                }

                if (this.snapToAngleMode)
                {
                    // todo
                }

                this.refrashSceneCallback();
            }

            if (this.selectedMousePos.x != null)
            {
                ++this.curStep;
            }
        }
        else if (this.curStep == 3)
        {
            Cn.RequestGet(Connector.RequestEnum.Commit, [this.documentId]);
            Cn.RequestGet(Connector.RequestEnum.SaveDocument, [this.documentId]);
            this.curStatus = OperationController.OperationStatus.Completed;
            this.refrashSceneCallback();
        }
    };
}

export class ClearOperation extends OperationController {

    highlightObjects = true;
    
    Operate = function()
    {
        if (this.selectedMousePos.x != null)
        {
            let objectId = -1;

            let response1 = Cn.RequestGet(Connector.RequestEnum.GetAllObjects, [this.documentId]);
            let sceneObjects = response1.objects;

            let data = { radius: 0.02, position: { x: this.selectedMousePos.x, y: this.selectedMousePos.y } };

            for (let object of sceneObjects)
            {
                let body = 'docId=' + encodeURIComponent(this.documentId) +
                    '&objId=' + encodeURIComponent(object) + '&data=' + encodeURIComponent(JSON.stringify(data));

                let response2 = Cn.RequestPost(Connector.RequestEnum.IsLineUnderCursor, body);
                if (response2.topology != -1)
                {
                    objectId = object;
                    break;
                }
            }

            if (objectId >= 0)
            {
                Cn.RequestGet(Connector.RequestEnum.DeleteLine, [this.documentId, objectId]);
                Cn.RequestGet(Connector.RequestEnum.Commit, [this.documentId]);
                Cn.RequestGet(Connector.RequestEnum.SaveDocument, [this.documentId]);
                this.curStatus = OperationController.OperationStatus.Completed;
                this.refrashSceneCallback();
            }

            this.selectedMousePos.x = null;
            this.selectedMousePos.y = null;
        }
    };
}

export class SnapToNodeOperation extends OperationController {

    Operate = function()
    {
        if (this.intData != null)
        {
            this.snapToNodeMode = this.intData;
            let data = { SnapToNode: this.snapToNodeMode };
            this.result = JSON.stringify(data);
            this.intData = null;
            this.curStatus = OperationController.OperationStatus.Completed;
        }
    };
}

export class SnapToAngleOperation extends OperationController {

    Operate = function()
    {
        if (this.intData != null)
        {
            this.snapToAngleMode = this.intData;
            let data = { SnapToAngle: this.snapToAngleMode };
            this.result = JSON.stringify(data);
            this.intData = null;
            this.curStatus = OperationController.OperationStatus.Completed;
        }
    };
}

export class NodesOperation extends OperationController {

    Operate = function()
    {
        if (this.stringData)
        {
            let body = 'docId=' + encodeURIComponent(this.documentId) + '&data=' + encodeURIComponent(this.stringData);
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
            let body = 'docId=' + encodeURIComponent(this.documentId) + '&data=' + encodeURIComponent(this.stringData);
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
            let body = 'docId=' + encodeURIComponent(this.documentId) + '&data=' + encodeURIComponent(this.stringData);
            Cn.RequestPost(Connector.RequestEnum.SetStyleData, body);
            this.curStatus = OperationController.OperationStatus.Completed;
            this.refrashSceneCallback();
        }
    };
}
