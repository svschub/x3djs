X3d.GeometryNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.GeometryNode.prototype = Object.create(X3d.Node.prototype);

X3d.GeometryNode.prototype.createMesh = function(appearance) {
};
