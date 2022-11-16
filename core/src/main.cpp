#include "headers/definitions.h"
#include "headers/api.h"
#include "headers/document.h"
#include "headers/session.h"

int main()
{
    int res1 = test_api(2);
    int res2 = test_api(3);
    int res3 = test_api(6);

    auto x = ColorTheme::Dark;

    return 0;
}