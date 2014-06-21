X3d.ImageTextureNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ImageTextureNode.prototype = Object.create(X3d.Node.prototype);

X3d.ImageTextureNode.prototype.parse = function() {
    var texture = {},
        attribute,
        values;

    console.log('parsing X3D image texture');

    attribute = this.node.attr('url');
    if (attribute) {
        texture.url = attribute;
    }

    return texture;
};
