
EXT_LIB=extlib

CORE=src/X3d.js src/X3dUnknownNodeException.js src/X3dNode.js
ABSTRACT_NODES=src/nodes/abstract/*.js
NODES=src/nodes/*.js

TARGET_DEBUG=x3djs.debug.js
TARGET_MIN=x3djs.min.js
TARGETS_ALL=$(TARGET_MIN) $(TARGET_DEBUG)


.PHONY: all install clean

all: $(TARGET_MIN)

$(TARGET_MIN): $(TARGET_DEBUG)
	yuicompressor.sh $(TARGET_DEBUG) -o $@

$(TARGET_DEBUG): Makefile $(CORE) $(ABSTRACT_NODES) $(NODES)
	cat $(CORE) $(ABSTRACT_NODES) $(NODES) > $@

install: $(TARGETS_ALL)
	cp $(TARGETS_ALL) $(EXT_LIB)/x3djs

clean: 
	rm -f $(TARGETS_ALL)

