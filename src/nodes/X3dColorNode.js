X3d.ColorNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ColorNode.prototype = Object.create(X3d.Node.prototype);

X3d.ColorNode.prototype.parse = function(sceneLoader) {
    var self = this,
        attribute,
        vectors,
        color;

    self.colors = [];

    console.log('parsing X3D color');

    attribute = this.node.attr('color');
    if (attribute) {
        vectors = this.parseVector3Array(attribute);
        vectors.forEach(function(vector) {
            color = new THREE.Color();
            color.setRGB(vector.x, vector.y, vector.z);
            self.colors.push(color);
        });
    }

    return self;
};
