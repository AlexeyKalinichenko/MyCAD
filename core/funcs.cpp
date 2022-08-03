#include "funcs.h"
#include <iostream>

int statistics(int counter)
{
	int numberOfObjects = counter / 2;
	std::cout << "Scene objects: " << numberOfObjects << std::endl;
	return numberOfObjects;
}