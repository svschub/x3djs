X3d.LinePropertiesNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.LinePropertiesNode.prototype = Object.create(X3d.Node.prototype);

X3d.LinePropertiesNode.prototype.parse = function(sceneLoader) {
    var self = this,
        attribute,
        values;

    console.log('parsing X3D line properties');

    attribute = this.node.attr('applied');
    if (attribute) {
        self.applied = (attribute == "TRUE");
    } else {
        self.applied = false;
    }

    attribute = this.node.attr('linetype');
    if (attribute) {
        values = this.parseIntArray(attribute);
        self.lineType = values[0];
    } else {
        self.lineType = 1;
    }

    attribute = this.node.attr('linewidthScaleFactor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        self.lineWidth = Math.max(1.0, values[0]);
    } else {
        self.lineWidth = 1.0;
    }

    return self;
};
