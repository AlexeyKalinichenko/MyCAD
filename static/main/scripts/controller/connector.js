export class Connector {

    static RequestEnum = {
        OpenDocument:  "OpenDocument/",
        CloseDocument: "CloseDocument/1",
        SetStyleData:  "SetStyleData/",
        GetRenderingData: "GetRenderingData/1",
        CreateLine: "CreateLine/",
        EditLine:   "EditLine/",
        DeleteLine: "DeleteLine/2",
        GetLineNode:   "GetLineNode/3",
        GetLineLength: "GetLineLength/2",
        GetLineAngle:  "GetLineAngle/2",
        IsLineUnderCursor: "IsLineUnderCursor/",
        GetAllObjects:   "GetAllObjects/1",
        HighlightObject: "HighlightObject/2",
        Undo:   "Undo/1",
        Redo:   "Redo/1",
        Commit: "Commit/1",
        Rollback: "Rollback/1"
    };

    static ServerResponseEnum = {
        ResultOk: 0,
        ResultError: 1
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

    RequestGet = function(request, params = []) {
        let requestUrl = this.GetUrl(request, params);
        console.log("Request: " + requestUrl);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl, false);
        xhr.send();

        console.log("Response: " + xhr.responseText);
        return JSON.parse(xhr.responseText);
    };

    RequestPost = function(request, body) {
        let requestUrl = this.GetUrl(request);
        console.log("Request: " + requestUrl);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', requestUrl, false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-CSRFToken', csrf_token);

        let bodyString = '';
        let counter = 0;

        for (let key in body)
        {
            if (counter > 0)
                bodyString = bodyString + '&';

            bodyString = bodyString + 'key=' + encodeURIComponent(body[key]);

            ++counter;
        }
    
        xhr.send(bodyString);

        console.log("Response: " + xhr.responseText);
        return JSON.parse(xhr.responseText);
    };
}

export let Cn = new Connector();
