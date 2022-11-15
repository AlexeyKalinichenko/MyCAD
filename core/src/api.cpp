#include "headers/api.h"

int test_api(int counter)
{
	return counter * 2;
}

int statisticsAPI(int counter)
{
	int numberOfObjects = counter / 2;
	return numberOfObjects;
}