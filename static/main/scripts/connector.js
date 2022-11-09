export class Connector {
    LoadSceneData = function()
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + 'getdata/', false);
        xhr.send();
    
        let data = JSON.parse(xhr.responseText);
    
        //EM.VerticesBuffer = data.vertices;
    }
}

export let Cn = new Connector();
