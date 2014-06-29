X3d.TextureTransformNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.TextureTransformNode.prototype = Object.create(X3d.Node.prototype);

X3d.TextureTransformNode.prototype.parse = function() {
    var self = this,
        attribute,
        values;

    console.log('parsing X3D texture transform');

    attribute = this.node.attr('translation');
    if (attribute) {
        self.transform = this.parseVector2(attribute);
    }

    attribute = this.node.attr('scale');
    if (attribute) {
        self.scale = this.parseVector2(attribute);
    }

    attribute = this.node.attr('rotation');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.rotation = values[0];
    }

    return self;
};
