#ifndef __BASE_H__
#define __BASE_H__

#include "definitions.h"
#include "line.h"
#include <map>

class Base
{
private:

public:
    Base() {}

    ObjectId AddObject(Line line);
    void RemoveObject(ObjectId id);
    Line GetObject(ObjectId id);

    void Undo();
    void Redo();
    void Commit();

    std::map<ObjectId, Line> GetCurrentState();
};

#endif //__BASE_H__