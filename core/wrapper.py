import sys
import ctypes
from MyCAD.deploy import deploy

CORE_LIBRARY = ''

if sys.platform == 'linux' or sys.platform == 'linux2':
	CORE_LIBRARY = 'libcore.so'
elif sys.platform == 'darwin':
	CORE_LIBRARY = 'libcore.dylib'
elif sys.platform == 'win32':
	CORE_LIBRARY = 'core.dll'

core = ctypes.CDLL(deploy['core_path'] + CORE_LIBRARY)

def statisticsWrapper(counter):
	core.statisticsAPI.argtypes = [ctypes.c_int]
	core.statisticsAPI.restype = ctypes.c_int
	result = core.statisticsAPI(counter)
	return result
