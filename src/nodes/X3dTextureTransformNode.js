X3d.TextureTransformNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.TextureTransformNode.prototype = Object.create(X3d.Node.prototype);

X3d.TextureTransformNode.prototype.parse = function() {
    var textureTransform = {},
        attribute,
        values;

    console.log('parsing X3D texture transform');

    attribute = this.node.attr('translation');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        textureTransform.transform = new THREE.Vector2(values[0], values[1]);
    }

    attribute = this.node.attr('scale');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        textureTransform.scale = new THREE.Vector2(values[0], values[1]);
    }

    attribute = this.node.attr('rotation');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        textureTransform.rotation = values[0];
    }

    return textureTransform;
};
