#include "headers/session.h"

Session::Session() : _counter(-1) {}

DocumentId Session::CreateDocument(const StyleData & style)
{
    Document document(style);

    _documents.insert(std::pair<DocumentId, Document>(++_counter, document));
    return _counter;
}

DocumentId Session::OpenDocument(const StyleData & style, const std::vector<Line> & data)
{
    Document document(style);
    document.Load(data);

    _documents.insert(std::pair<DocumentId, Document>(++_counter, document));
    return _counter;
}

std::vector<Line> Session::CloseDocument(DocumentId id)
{
    auto document = _documents.at(id);
    _documents.erase(id);

    return document.Save();
}

Document & Session::GetDocument(DocumentId id)
{
    return _documents.at(id);
}
