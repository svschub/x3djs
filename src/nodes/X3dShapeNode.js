X3d.ShapeNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ShapeNode.prototype = Object.create(X3d.Node.prototype);

X3d.ShapeNode.prototype.parse = function() {
    var child,
        appearance = {},
        geometryNodes = [],
        mesh = null;
        

    console.log('parsing X3D shape');

    this.node.children().each(function() {
        try {
            child = X3d.Node.parse($(this));

            if (child instanceof X3d.AppearanceNode) {
                appearance = child;
//                console.log('appearance: ' + JSON.stringify(appearance));
            } else if (child instanceof X3d.GeometryNode) {
                geometryNodes.push(child);
//                console.log('geometry node: ' + JSON.stringify(child));
            }
        } catch (e) {
            throw e;
        }
    });

    geometryNodes.forEach(function(geometryNode) {
        mesh = geometryNode.createMesh(appearance);
    });

    return mesh;
};
