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

class CColor(ctypes.Structure):
	_fields_ = [
		("red", ctypes.c_float),
		("green", ctypes.c_float),
		("blue", ctypes.c_float)
	]

class CColorTheme(ctypes.Structure):
	_fields_ = [
		("objects", CColor),
		("highlight", CColor),
		("nodes", CColor)
	]

class CStyleData(ctypes.Structure):
    _fields_ = [
		("theme", CColorTheme),
		("thickness", ctypes.c_float),
		("nodesMode", ctypes.c_bool)
	]

class CPosition(ctypes.Structure):
	_fields_ = [
		("x", ctypes.c_float),
		("y", ctypes.c_float)
	]

class CCut(ctypes.Structure):
	_fields_ = [
		("start", CPosition),
		("end", CPosition)
	]

class CIndex(ctypes.Structure):
	_fields_ = [
		("figure", ctypes.c_int),
		("offset", ctypes.c_uint),
		("count", ctypes.c_uint)
	]

class CVertex(ctypes.Structure):
	_fields_ = [
		("x", ctypes.c_float),
		("y", ctypes.c_float),
		("z", ctypes.c_float)
	]

def OpenSessionAPI():
	core.mc_open_session.restype = ctypes.c_int
	return core.mc_open_session()

def CloseSessionAPI():
	core.mc_close_session.restype = ctypes.c_int
	return core.mc_close_session()

def CreateDocumentAPI(style):
	core.mc_create_document.argtypes = [CStyleData]
	core.mc_create_document.restype = ctypes.c_int
	return core.mc_create_document(style)

def OpenDocumentAPI(style, data):
	class CStorageData(ctypes.Structure):
		_fields_ = [
		("cuts", CCut * len(data)),
		("size", ctypes.c_uint)
	]
	
	core.mc_open_document.argtypes = [CStyleData, CStorageData]
	core.mc_open_document.restype = ctypes.c_int
	return core.mc_open_document(style, data)

def GetStorageBufferSizeAPI(docId):
	core.mc_get_storage_buffer_size.argtypes = [ctypes.c_int]
	core.mc_get_storage_buffer_size.restype = ctypes.c_uint
	return core.mc_get_storage_buffer_size(docId)

def CloseDocumentAPI(docId):
	size = GetStorageBufferSizeAPI(docId)

	class CStorageData(ctypes.Structure):
		_fields_ = [
		("cuts", CCut * size),
		("size", ctypes.c_uint)
	]

	core.mc_close_document.argtypes = [ctypes.c_int]
	core.mc_close_document.restype = CStorageData
	return core.mc_close_document(docId)

def SetColorThemeAPI(docId, theme):
	core.mc_set_color_theme.argtypes = [ctypes.c_int, CColorTheme]
	core.mc_set_color_theme.restype = ctypes.c_int
	return core.mc_set_color_theme(docId, theme)

def SetThicknessAPI(docId, thickness):
	core.mc_set_thickness.argtypes = [ctypes.c_int, ctypes.c_float]
	core.mc_set_thickness.restype = ctypes.c_int
	return core.mc_set_thickness(docId, thickness)

def SetNodesModeAPI(docId, mode):
	core.mc_set_nodes_mode.argtypes = [ctypes.c_int, ctypes.c_bool]
	core.mc_set_nodes_mode.restype = ctypes.c_int
	return core.mc_set_nodes_mode(docId, mode)

def GetVerticesBufferSizeAPI(docId):
	core.mc_get_vertices_buffer_size.argtypes = [ctypes.c_int]
	core.mc_get_vertices_buffer_size.restype = ctypes.c_uint
	return core.mc_get_vertices_buffer_size(docId)

def GetIndicesBufferSizeAPI(docId):
	core.mc_get_indices_buffer_size.argtypes = [ctypes.c_int]
	core.mc_get_indices_buffer_size.restype = ctypes.c_uint
	return core.mc_get_indices_buffer_size(docId)

def GetRenderingStatusAPI(docId):
	vSize = GetVerticesBufferSizeAPI(docId)
	iSize = GetIndicesBufferSizeAPI(docId)

	class CRenderingData(ctypes.Structure):
		_fields_ = [
		("needUpdate", ctypes.c_bool),
		("theme", CColorTheme),
		("thickness", ctypes.c_float),
		("nodesMode", ctypes.c_bool),
		("indices", CIndex * iSize),
		("iSize", ctypes.c_uint),
		("vertices", CVertex * vSize),
		("vSize", ctypes.c_uint)
	]
		
	core.mc_get_rendering_status.argtypes = [ctypes.c_int]
	core.mc_get_rendering_status.restype = CRenderingData
	return core.mc_get_rendering_status(docId)

def UndoAPI(docId):
	core.mc_undo.argtypes = [ctypes.c_int]
	core.mc_undo.restype = ctypes.c_int
	return core.mc_undo(docId)

def RedoAPI(docId):
	core.mc_redo.argtypes = [ctypes.c_int]
	core.mc_redo.restype = ctypes.c_int
	return core.mc_redo(docId)

def CommitAPI(docId):
	core.mc_commit.argtypes = [ctypes.c_int]
	core.mc_commit.restype = ctypes.c_int
	return core.mc_commit(docId)

def CreateLineAPI(docId, start, end):
	core.mc_create_line.argtypes = [ctypes.c_int, CPosition, CPosition]
	core.mc_create_line.restype = ctypes.c_int
	return core.mc_create_line(docId, start, end)

def EditLineAPI(docId, objId, index, pos):
	core.mc_edit_line.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int, CPosition]
	core.mc_edit_line.restype = ctypes.c_int
	return core.mc_edit_line(docId, objId, index, pos)

def DeleteLineAPI(docId, objId):
	core.mc_delete_line.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_delete_line.restype = ctypes.c_int
	return core.mc_delete_line(docId, objId)

def GetLineNodeAPI(docId, objId, index):
	core.mc_get_line_node.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int]
	core.mc_get_line_node.restype = CPosition
	return core.mc_get_line_node(docId, objId, index)

def GetLineLengthAPI(docId, objId):
	core.mc_get_line_length.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_get_line_length.restype = ctypes.c_float
	return core.mc_get_line_length(docId, objId)

def GetLineAngleAPI(docId, objId):
	core.mc_get_line_angle.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_get_line_angle.restype = ctypes.c_float
	return core.mc_get_line_angle(docId, objId)

def IsLineUnderCursorAPI(docId, objId, pos, radius):
	core.mc_is_line_under_cursor.argtypes = [ctypes.c_int, ctypes.c_int, CPosition, ctypes.c_float]
	core.mc_is_line_under_cursor.restype = ctypes.c_int
	return core.mc_is_line_under_cursor(docId, objId, pos, radius)

def GetObjectsBufferSizeAPI(docId):
	core.mc_get_objects_buffer_size.argtypes = [ctypes.c_int]
	core.mc_get_objects_buffer_size.restype = ctypes.c_uint
	return core.mc_get_objects_buffer_size(docId)

def GetAllObjectsAPI(docId):
	size = GetObjectsBufferSizeAPI(docId)

	class CObjects(ctypes.Structure):
		_fields_ = [
		("data", ctypes.c_int * size),
		("size", ctypes.c_uint)
	]

	core.mc_get_all_objects.argtypes = [ctypes.c_int]
	core.mc_get_all_objects.restype = CObjects

	return core.mc_get_all_objects(docId)

def HighlightObjectAPI(docId, objId):
	core.mc_highlight_object.argtypes = [ctypes.c_int, ctypes.c_int]
	core.mc_highlight_object.restype = ctypes.c_int
	return core.mc_highlight_object(docId, objId)


if __name__ == '__main__':
	res1 = OpenSessionAPI()
	res2 = CloseSessionAPI()

	check = True
