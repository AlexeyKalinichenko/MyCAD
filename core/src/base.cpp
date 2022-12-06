#include "headers/base.h"

Base::Base() : _objectsCounter(-1), _stepsCounter(-1) {}

void Base::Load(const std::vector<Line> & lines)
{
    for (auto it = lines.begin(); it != lines.end(); ++it)
        _state.insert(std::make_pair(++_objectsCounter, *it));

    _history.emplace_back(_state);
    _stepsCounter = 0;
}

std::vector<Line> Base::Upload()
{
   std::vector<Line> objects;

    if (!_history.empty())
    {
        std::map<ObjectId, Line> lastState = _history.at(_stepsCounter);
        for (auto it = lastState.begin(); it != lastState.end(); ++it)
            objects.push_back(it->second);
    }

    return objects;
}

ObjectId Base::AddObject(const Line & line)
{
    _state.insert(std::make_pair(++_objectsCounter, line));
    return _objectsCounter;
}

void Base::RemoveObject(ObjectId id)
{
    _state.erase(id);
}

Line & Base::GetObject(ObjectId id)
{
    return _state.at(id);
}

std::vector<ObjectId> Base::GetObjects()
{
    std::vector<ObjectId> ids;

    if (!_state.empty())
    {
        for (auto it = _state.begin(); it != _state.end(); ++it)
            ids.push_back(it->first);
    }

    return ids;
}

void Base::Undo()
{
    if (_stepsCounter == -1 || _stepsCounter == 0)
        return;

    _state = _history.at(--_stepsCounter);
}

void Base::Redo()
{
    if (_stepsCounter == _history.size() - 1)
        return;

    _state = _history.at(++_stepsCounter);
}

void Base::Commit()
{
    if (_stepsCounter == -1)
    {
        _history.emplace_back(_state);
        _stepsCounter = 0;
    }
    else if (_stepsCounter == _history.size() - 1)
    {
        if (_history.size() == HistoryLimit)
            _history.erase(_history.begin());
        else
            ++_stepsCounter;

        _history.emplace_back(_state);
    }
    else
    {
        std::vector<std::map<ObjectId, Line>> erased;
        for (int i = 0; i <= _stepsCounter; ++i)
            erased.emplace_back(_history.at(i));

        _history = erased;
        _history.emplace_back(_state);
        ++_stepsCounter;
    }
}

void Base::Rollback()
{
    if (_history.empty())
    {
        _state.clear();
        return;
    }

    _state = _history.at(_stepsCounter);
}