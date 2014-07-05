
EXT_LIB=extlib

CORE=src/*.js
EXCEPTIONS=src/exceptions/*js
ABSTRACT_NODES=src/nodes/abstract/*.js
NODES=src/nodes/*.js

TARGET_DEBUG=x3djs.debug.js
TARGET_MIN=x3djs.min.js
TARGETS_ALL=$(TARGET_MIN) $(TARGET_DEBUG)


.PHONY: all install clean

all: $(TARGET_MIN)

$(TARGET_MIN): $(TARGET_DEBUG)
	yuicompressor.sh $(TARGET_DEBUG) -o $@

$(TARGET_DEBUG): Makefile $(CORE) $(EXCEPTIONS) $(ABSTRACT_NODES) $(NODES)
	cat $(CORE) $(EXCEPTIONS) $(ABSTRACT_NODES) $(NODES) > $@

install: $(TARGETS_ALL)
	cp $(TARGETS_ALL) $(EXT_LIB)/x3djs

clean: 
	rm -f $(TARGETS_ALL)

