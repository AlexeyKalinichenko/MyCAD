alert('TEST API!');

function postRequest(methodUrl, body)
{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', methodUrl, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('X-CSRFToken', csrf_token);
    xhr.send(body);

    console.log("Response: " + xhr.responseText);
}

function getRequest(methodUrl)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', methodUrl, false);
    xhr.send();

    console.log("Response: " + xhr.responseText);
}

function requestOpenDocument()
{
    let command = url + 'OpenDocument/';

    let style = {
	    theme: {
		    objects: {
				red: 0.1,
				green: 0.2,
				blue: 0.3
			},
		    highlight: {
				red: 0.4,
				green: 0.5,
				blue: 0.6
			},
		    nodes: {
				red: 0.7,
				green: 0.8,
				blue: 0.9
			}
	    },
	    thickness: 0.15,
	    nodesMode: false
    };

    let body = 'data=' + encodeURIComponent(JSON.stringify(style));

    postRequest(command, body);
}

function requestSetStyleData1()
{
	let command = url + 'SetStyleData/';
	
	let style = {
	    theme: {
		    objects: {
				red: 0.11,
				green: 0.22,
				blue: 0.33
			},
		    highlight: {
				red: 0.44,
				green: 0.55,
				blue: 0.66
			},
		    nodes: {
				red: 0.77,
				green: 0.88,
				blue: 0.99
			}
		}
    };

    let body = 'docId=' + encodeURIComponent(0) + '&data=' + encodeURIComponent(JSON.stringify(style));

	postRequest(command, body)
}

function requestSetStyleData2()
{
	let command = url + 'SetStyleData/';
	let style = { thickness: 0.33 };
    let body = 'docId=' + encodeURIComponent(0) + '&data=' + encodeURIComponent(JSON.stringify(style));
	postRequest(command, body)
}

function requestSetStyleData3()
{
	let command = url + 'SetStyleData/';
	let style = { nodesMode: true };
    let body = 'docId=' + encodeURIComponent(0) + '&data=' + encodeURIComponent(JSON.stringify(style));
	postRequest(command, body)
}

function requestCreateLine1()
{
	let command = url + 'CreateLine/';
	let data = { positions: [ { x: 1, y: 1 }, { x: 5, y: 5 } ] };
	let body = 'docId=' + encodeURIComponent(0) + '&data=' + encodeURIComponent(JSON.stringify(data));
    postRequest(command, body);
}

function requestCreateLine2()
{
	let command = url + 'CreateLine/';
	let data = { positions: [ { x: 1, y: 2 }, { x: 5, y: 2 } ] };
	let body = 'docId=' + encodeURIComponent(0) + '&data=' + encodeURIComponent(JSON.stringify(data));
    postRequest(command, body);
}

function requestCreateLine3()
{
	let command = url + 'CreateLine/';
	let data = { positions: [ { x: 1, y: 5 }, { x: 5, y: 5 } ] };
	let body = 'docId=' + encodeURIComponent(0) + '&data=' + encodeURIComponent(JSON.stringify(data));
    postRequest(command, body);
}

function requestCommit()
{
    let command = url + 'Commit/0/';
    getRequest(command);
}

function requestUndo()
{
    let command = url + 'Undo/0/';
    getRequest(command);
}

function requestRedo()
{
    let command = url + 'Redo/0/';
    getRequest(command);
}

function requestEditLine()
{
	let command = url + 'EditLine/';
	let data = { index: 0, position: { x: 10, y: 10 } };
    let body = 'docId=' + encodeURIComponent(0) + '&objId=' + encodeURIComponent(1) +
		'&data=' + encodeURIComponent(JSON.stringify(data));
	postRequest(command, body)
}

function requestDeleteLine()
{
    let command = url + 'DeleteLine/0/2/';
    getRequest(command);
}

function requestGetLineNode()
{
	let command = url + 'GetLineNode/0/1/0/';
    getRequest(command);
}

function requestGetLineLength()
{
	let command = url + 'GetLineLength/0/0/';
    getRequest(command);
}

function requestGetLineAngle()
{
	let command = url + 'GetLineAngle/0/0/';
    getRequest(command);
}

function requestIsLineUnderCursor()
{
	let command = url + 'IsLineUnderCursor/';
	let data = { radius: 0.5, position: { x: 3, y: 3 } };
    let body = 'docId=' + encodeURIComponent(0) + '&objId=' + encodeURIComponent(0) +
		'&data=' + encodeURIComponent(JSON.stringify(data));
	postRequest(command, body)
}

function GetAllObjects()
{
	let command = url + 'GetAllObjects/0/';
    getRequest(command);
}

function HighlightObject()
{
	let command = url + 'HighlightObject/0/0/';
    getRequest(command);
}

function requestGetRenderingData()
{
	let command = url + 'GetRenderingData/0/';
    getRequest(command);
}

function requestCloseDocument()
{
    let command = url + 'CloseDocument/0/';
    getRequest(command);
}

requestOpenDocument();

requestSetStyleData1();
requestSetStyleData2();
requestSetStyleData3();

requestCreateLine1();
requestCreateLine2();
requestCreateLine3();

requestCommit();

requestEditLine();
requestDeleteLine();

requestCommit();
requestUndo();
requestRedo();

requestGetLineNode();
requestGetLineLength();
requestGetLineAngle();
requestIsLineUnderCursor();

GetAllObjects();
HighlightObject();

requestGetRenderingData();

requestCloseDocument();
