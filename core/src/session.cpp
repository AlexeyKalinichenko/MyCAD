#include "headers/session.h"

Session::Session() 
{
    _counter = -1;
}

DocumentId Session::OpenDocument(
    Document::Color objectColor, Document::Color nodeColor,
    float thickness, bool nodesMode, Document::StorageData data)
{
    Document document(objectColor, nodeColor, thickness, nodesMode);

    if (!data.lines.empty())
        document.Load(data);

    _documents.insert(std::pair<DocumentId, Document>(++_counter, document));
    return _counter;
}

Document::StorageData Session::CloseDocument(DocumentId id)
{
    auto document = _documents.at(id);
    _documents.erase(id);

    return document.Save();
}

Document Session::GetDocument(DocumentId id)
{
    return _documents[id];
}
