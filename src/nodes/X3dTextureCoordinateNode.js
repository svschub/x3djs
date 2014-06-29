X3d.TextureCoordinateNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.TextureCoordinateNode.prototype = Object.create(X3d.Node.prototype);

X3d.TextureCoordinateNode.prototype.parse = function() {
    var self = this,
        attribute;

    console.log('parsing X3D texture coordinates');

    attribute = this.node.attr('point');
    if (attribute) {
        self.coordinates = this.parseVector2Array(attribute);
    } else {
        self.coordinates = [];
    }

    return self;
};
