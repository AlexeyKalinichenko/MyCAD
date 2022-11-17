import sys
import ctypes

if __name__ != '__main__':
	from MyCAD.deploy import deploy
	dirPath = deploy['core_path']
else:
	dirPath = '/Users/alexey/Documents/reps/MyCAD/core/build/'

CORE_LIBRARY = ''

if sys.platform == 'linux' or sys.platform == 'linux2':
	CORE_LIBRARY = 'libcore.so'
elif sys.platform == 'darwin':
	CORE_LIBRARY = 'libcore.dylib'
elif sys.platform == 'win32':
	CORE_LIBRARY = 'core.dll'

core = ctypes.CDLL(dirPath + CORE_LIBRARY)

#def statisticsWrapper(counter):
#	core.statisticsAPI.argtypes = [ctypes.c_int]
#	core.statisticsAPI.restype = ctypes.c_int
#	result = core.statisticsAPI(counter)
#	return result

#if __name__ == '__main__':
#	print(statisticsWrapper(2))
#	print(statisticsWrapper(4))
#	print(statisticsWrapper(8))
