#ifndef __BASE_H__
#define __BASE_H__

#include "definitions.h"
#include "line.h"
#include <vector>
#include <map>

class Base
{
private:
    std::vector<std::map<ObjectId, Line>> _states;
    std::vector<std::map<ObjectId, Line>>::iterator _currentState;
    const unsigned _limit = 5;
    int _counter;

public:
    Base();

    ObjectId AddObject(Line line);
    void RemoveObject(ObjectId id);
    Line GetObject(ObjectId id);

    void Undo();
    void Redo();
    void Commit();
};

#endif //__BASE_H__