X3d.ImageTextureNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.ImageTextureNode.prototype = Object.create(X3d.Node.prototype);

X3d.ImageTextureNode.prototype.parse = function(sceneLoader) {
    var self = this,
        attribute,
        matches;

    console.log('parsing X3D image texture');

    attribute = this.node.attr('url');
    if (attribute) {
        matches = /(\"|\')([^\s]+)(?:\1)\s+(\"|\')([^\s]+)(?:\3)/.exec(attribute);
        self.url = matches[2];
        self.name = matches[4];
    }

    return self;
};
