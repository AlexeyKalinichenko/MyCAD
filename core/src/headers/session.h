#ifndef __SESSION_H__
#define __SESSION_H__

#include "definitions.h"
#include "document.h"
#include <map>

class Session
{
private:
    std::map<DocumentId, Document> _documents;
    int _counter;

public:
    Session();

    DocumentId CreateDocument(const StyleData & style);
    DocumentId OpenDocument(const StyleData & style, const StorageData & data);
    StorageData CloseDocument(DocumentId id);
    Document & GetDocument(DocumentId id);
};

#endif //__SESSION_H__
