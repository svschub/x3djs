X3d.CoordinateNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.CoordinateNode.prototype = Object.create(X3d.Node.prototype);

X3d.CoordinateNode.prototype.parse = function() {
    var vertices,
        attribute;

    console.log('parsing X3D coordinate');

    attribute = this.node.attr('point');
    if (attribute) {
        vertices = this.parseVector3Array(attribute);
    } else {
        vertices = [];
    }

    return vertices;
};
