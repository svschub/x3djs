X3d.ViewpointNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ViewpointNode.prototype = Object.create(X3d.Node.prototype);

X3d.ViewpointNode.prototype.parse = function(node) {
    var camera,
        attribute,
        values,
        fieldOfView;

    console.log('parsing X3D viewpoint (camera)');

    attribute = this.node.attr('fieldOfView');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        fieldOfView = 180.0 * values[0] / Math.PI;
    } else {
        fieldOfView = 45.0;
    }

    camera = new THREE.PerspectiveCamera(fieldOfView, 4 / 3, 0.1, 1000);

    return camera;
};
