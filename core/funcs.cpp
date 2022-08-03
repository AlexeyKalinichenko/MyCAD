#include "funcs.h"
#include <iostream>

void statistics(int counter)
{
	int numberOfObjects = (counter - 1) / 2;
	std::cout << "Objects: " << numberOfObjects << std::endl;
}