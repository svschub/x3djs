X3d.IndexedFaceSetNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.IndexedFaceSetNode.prototype = Object.create(X3d.Node.prototype);

X3d.IndexedFaceSetNode.prototype.parse = function() {
    var child,
        attribute,
        creaseAngle,
        results,
        indexedFaceSet = {};

    console.log('parsing X3D indexed face set');

    attribute = this.node.attr('solid');
    if (attribute) {
        indexedFaceSet.solid = (attribute === "true");
    }

    attribute = this.node.attr('creaseAngle');
    if (attribute) {
        results = this.parseFloatArray(attribute);
        indexedFaceSet.creaseAngle = results[0];
    } else {
        indexedFaceSet.creaseAngle = 0.0;
    }

    attribute = this.node.attr('coordIndex');
    if (attribute) {
        indexedFaceSet.coordIndex = this.parseIntArray(attribute);
    }

    this.node.children().each(function() {
        try {
            child = X3d.Node.parse($(this));
            if ($(this).prop('tagName') === "Coordinate") {
                indexedFaceSet.point = child;
            }
        } catch (e) {
            throw e;
        }
    });

    return indexedFaceSet;
};
