export class Connector {

    static RequestEnum = {
        OpenDocument:  "OpenDocument/",
        CloseDocument: "CloseDocument/",
        RunOperation:  "RunOperation/1",
        ButtonEvent:   "ButtonEvent/2",
        MouseMoveEvent: "MouseMoveEvent/2",
        SendIntData:    "SendIntData/1",
        SendStringData: "SendStringData/1",
        IsDocumentChanged:   "IsDocumentChanged/",
        GetDataForRendering: "GetDataForRendering/",
        GetDocumentInfo: "GetDocumentInfo/"
    };

    static ServerResponseEnum = {
        ResultOk: 0,
        ResultError: 1,
        ResultErrorNotFound: 2,
        ResultErrorInternal: 3
    };

    static OperationIdEnum = {
        OperationUndo: 0,
        OperationRedo: 1,
        OperationLine: 2,
        OperationClear: 3,
        OperationSnapTo: 4,
        OperationNodes: 5,
        OperationThickness: 6,
        OperationColorTheme: 7
    };

    Request = function(request, params = []) {
        let requestUrl = this.GetUrl(request, params);
        console.log("Request: " + requestUrl);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl, false);
        xhr.send();

        console.log("Response: " + xhr.responseText);
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

//export let Cn = new Connector();
