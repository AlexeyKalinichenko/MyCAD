#include "headers/base.h"

ObjectId Base::AddObject(Line line)
{
    return 0;
}

void Base::RemoveObject(ObjectId id)
{

}

Line Base::GetObject(ObjectId id)
{
    return Line();
}

void Base::Undo()
{

}

void Base::Redo()
{

}

void Base::Commit()
{

}

std::map<ObjectId, Line> Base::GetCurrentState()
{
    return std::map<ObjectId, Line>();
}
