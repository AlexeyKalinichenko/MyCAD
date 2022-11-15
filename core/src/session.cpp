#include "headers/session.h"

Session::Session() 
{
    _counter = -1;
}

DocumentId Session::CreateDocument()
{
    return OpenDocument(std::string());
}

DocumentId Session::OpenDocument(std::string jsonData)
{
    auto document = Document(jsonData);
    _documents.insert(std::pair<DocumentId, Document>(++_counter, document));
    return _counter;
}

void Session::CloseDocument(DocumentId id)
{
    _documents.erase(id);
}

Document Session::GetDocument(DocumentId id)
{
    return _documents[id];
}
