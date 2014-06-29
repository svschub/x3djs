X3d.AppearanceNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.AppearanceNode.prototype = Object.create(X3d.Node.prototype);

X3d.AppearanceNode.prototype.parse = function() {
    var self = this;

    console.log('parsing X3D appearance');

    self.node.children().each(function() {
        var child, childNode = $(this);

        try {
            child = X3d.Node.parse(childNode);

            if (child instanceof X3d.MaterialNode) {
                self.material = child;
            } else if (child instanceof X3d.LinePropertiesNode) {
                self.lineProperties = child;
            } else if (child instanceof X3d.ImageTextureNode) {
                self.texture = child;
            } else if (child instanceof X3d.TextureTransformNode) {
                self.textureTransform = child;
            }
        } catch (e) {
            throw e;
        }
    });

    return self;
};
