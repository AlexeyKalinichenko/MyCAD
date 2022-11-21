#ifndef __BASE_H__
#define __BASE_H__

#include "definitions.h"
#include "line.h"
#include <vector>
#include <map>

class Base
{
private:
    std::vector<std::map<ObjectId, Line>> _history;
    std::map<ObjectId, Line> _state;
    int _objectsCounter;
    int _stepsCounter;

public:
    Base();

    void Load(const std::vector<Line> & lines);
    std::vector<Line> Upload();

    ObjectId AddObject(const Line & line);
    void RemoveObject(ObjectId id);

    Line & GetObject(ObjectId id);
    std::vector<ObjectId> GetObjects();

    void Undo();
    void Redo();
    void Commit();
};

#endif //__BASE_H__
