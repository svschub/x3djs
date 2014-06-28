X3d.IndexedLineSetNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.IndexedLineSetNode.prototype = Object.create(X3d.Node.prototype);

X3d.IndexedLineSetNode.prototype.parse = function() {
    var child,
        attribute,
        indexedLineSet = {};

    console.log('parsing X3D indexed line set');

    attribute = this.node.attr('coordIndex');
    if (attribute) {
        indexedLineSet.coordIndex = this.parseIntArray(attribute);
    }

    attribute = this.node.attr('colorIndex');
    if (attribute) {
        indexedLineSet.colorIndex = this.parseIntArray(attribute);
    }

    this.node.children().each(function() {
        var childNode = $(this);

        try {
            child = X3d.Node.parse(childNode);
            switch (childNode.prop('tagName')) {
                case "Coordinate":
                    indexedLineSet.vertexCoordinates = child;
                    break;
                case "Color":
                    indexedLineSet.vertexColors = child;
                    break;
                default:
            }
        } catch (e) {
            throw e;
        }
    });

    return indexedLineSet;
};
