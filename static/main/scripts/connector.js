export class Connector {

    static RequestEnum = {
        OpenDocument: "OpenDocument/",
        CloseDocument: "CloseDocument/",
        RunOperation: "RunOperation/1",
        ButtonEvent: "ButtonEvent/2",
        MouseMoveEvent: "MouseMoveEvent/2",
        SendIntData: "SendIntData/1",
        SendStringData: "SendStringData/1",
        IsDocumentChanged: "IsDocumentChanged/",
        GetDataForRendering: "GetDataForRendering/",
        GetDocumentInfo: "GetDocumentInfo/"
    };

    Request = function(request, params) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.GetUrl(request, params), false);
        xhr.send();
    
        return JSON.parse(xhr.responseText);
    };

    GetUrl = function(request, params = []) {
        const separator = "/";

        let requestArray = request.split(separator);

        let result = url + requestArray[0] + separator;

        if (requestArray.length != 1)
        {
            if (isNaN(requestArray[1]) || Number(requestArray[1]) != params.length)
                throw "Invalid number of parameters";

            for (let param of params)
                result += (param + separator);
        }

        return result;
    };
}

export let Cn = new Connector();
