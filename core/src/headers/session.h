#ifndef __SESSION_H__
#define __SESSION_H__

#include "definitions.h"
#include "document.h"
#include <map>
#include <string>

class Session
{
private:
    std::map<DocumentId, Document> _documents;
    int _counter;

public:
    Session();

    DocumentId CreateDocument();
    DocumentId OpenDocument(std::string jsonData);
    void CloseDocument(DocumentId id);

    Document GetDocument(DocumentId id);
};

#endif //__SESSION_H__