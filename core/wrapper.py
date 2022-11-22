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

class CColorTheme(ctypes.Structure):
	_fields_ = [
		("objects", ctypes.POINTER(ctypes.c_float)),
		("highlight", ctypes.pointer(ctypes.c_float)),
		("nodes", ctypes.pointer(ctypes.c_float))
	]

class CPosition(ctypes.Structure):
	_fields_ = [
		("x", ctypes.c_float),
		("y", ctypes.c_float)
	]

class CObjects(ctypes.Structure):
    _fields_ = [
		("data", ctypes.pointer(ctypes.c_int)),
		("size", ctypes.c_uint)
	]

def OpenSessionApi():
	core.mc_open_session.restype = ctypes.c_int
	return core.mc_open_session()

def CloseSessionApi():
	core.mc_close_session.restype = ctypes.c_int
	return core.mc_close_session()

def mc_create_document(): pass
def mc_open_document(): pass
def mc_close_document(): pass

def SetColorThemeApi(docId, theme):
	core.mc_set_color_theme.argtypes = [ctypes.c_int, CColorTheme]
	core.mc_set_color_theme.restype = ctypes.c_int
	return core.mc_set_color_theme(docId, theme)

def SetThicknessApi(docId, thickness):
	core.mc_set_thickness.argtypes = [ctypes.c_int, ctypes.c_float]
	core.mc_set_thickness.restype = ctypes.c_int
	return core.mc_set_thickness(docId, thickness)

def SetNodesModeApi(docId, mode):
	core.mc_set_nodes_mode.argtypes = [ctypes.c_int, ctypes.c_bool]
	core.mc_set_nodes_mode.restype = ctypes.c_int
	return core.mc_set_nodes_mode(docId, mode)

def mc_get_rendering_status(): pass

def UndoApi(docId):
	core.mc_undo.argtypes = [ctypes.c_int]
	core.mc_undo.restype = ctypes.c_int
	return core.mc_undo(docId)

def RedoApi(docId):
	core.mc_redo.argtypes = [ctypes.c_int]
	core.mc_redo.restype = ctypes.c_int
	return core.mc_redo(docId)

def CommitApi(docId):
	core.mc_commit.argtypes = [ctypes.c_int]
	core.mc_commit.restype = ctypes.c_int
	return core.mc_commit(docId)

def CreateLineApi(docId, start, end):
	core.mc_create_line.argtypes = [ctypes.c_int, CPosition, CPosition]
	core.mc_create_line.restype = ctypes.c_int
	return core.mc_create_line(docId, start, end)

def EditLineApi(docId, objId, index, pos):
	core.mc_edit_line.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int, CPosition]
	core.mc_edit_line.restype = ctypes.c_int
	return core.mc_edit_line(docId, objId, index, pos)

def DeleteLineApi(docId, objId):
	core.mc_delete_line.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_delete_line.restype = ctypes.c_int
	return core.mc_delete_line(docId, objId)

def GetLineNodeApi(docId, objId, index):
	core.mc_get_line_node.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int]
	core.mc_get_line_node.restype = CPosition
	return core.mc_get_line_node(docId, objId, index)

def GetLineLengthApi(docId, objId):
	core.mc_get_line_length.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_get_line_length.restype = ctypes.c_float
	return core.mc_get_line_length(docId, objId)

def GetLineAngleApi(docId, objId):
	core.mc_get_line_angle.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_get_line_angle.restype = ctypes.c_float
	return core.mc_get_line_angle(docId, objId)

def IsLineUnderCursorApi(docId, objId, pos, radius):
	core.mc_is_line_under_cursor.argtypes = [ctypes.c_int, ctypes.c_int, CPosition, ctypes.c_float]
	core.mc_is_line_under_cursor.restype = ctypes.c_int
	return core.mc_is_line_under_cursor(docId, objId, pos, radius)

def GetAllObjectsApi(docId):
	core.mc_get_all_objects.argtypes = [ctypes.c_int]
	core.mc_get_all_objects.restype = CObjects
	return core.mc_get_all_objects(docId)

def HighlightObjectApi(docId, objId):
	core.mc_highlight_object.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_highlight_object.restype = ctypes.c_int
	return core.mc_highlight_object(docId, objId)


if __name__ == '__main__':
	res1 = OpenSessionApi()
	res2 = CloseSessionApi()

	check = True
