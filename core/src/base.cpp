#include "headers/base.h"

Base::Base()
{
    _counter = -1;
    _states.push_back(std::map<ObjectId, Line>());
    _currentState = _states.begin();
}

void Base::Load(const std::vector<Line> & lines)
{
    for (auto it = lines.begin(); it != lines.end(); ++it)
        _currentState->insert(std::make_pair(++_counter, *it));
}

ObjectId Base::AddObject(Line line)
{
    _currentState->insert(std::make_pair(++_counter, line));
    return _counter;
}

void Base::RemoveObject(ObjectId id)
{
    _currentState->erase(id);
}

Line Base::GetObject(ObjectId id)
{
    return _currentState->at(id);
}

std::vector<Line> Base::GetObjects()
{
    std::vector<Line> objects;

    for (auto it = _currentState->begin(); it != _currentState->end(); ++it)
        objects.push_back(it->second);

    return objects;
}

void Base::Undo()
{
    if (_currentState == _states.begin())
        return;

    --_currentState;
}

void Base::Redo()
{
    if (_currentState == _states.end() - 1)
        return;

    ++_currentState;
}

void Base::Commit()
{
    auto state = *_currentState;

    if (_currentState == _states.end() - 1)
    {
        if (_currentState->size() == _limit)
            _states.erase(_states.begin());
    }
    else
    {
        std::vector<std::map<ObjectId, Line>> erased(_states.begin(), _currentState + 1);
        _states = erased;
    }

    _states.emplace_back(state);
    _currentState = --_states.end();
}
