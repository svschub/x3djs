X3d.LinePropertiesNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.LinePropertiesNode.prototype = Object.create(X3d.Node.prototype);

X3d.LinePropertiesNode.prototype.parse = function() {
    var lineProperties = {},
        attribute,
        values;

    console.log('parsing X3D line properties');

    attribute = this.node.attr('applied');
    if (attribute) {
        lineProperties.applied = (attribute == "TRUE");
    } else {
        lineProperties.applied = false;
    }

    attribute = this.node.attr('linetype');
    if (attribute) {
        values = this.parseIntArray(attribute);
        lineProperties.lineType = values[0];
    } else {
        lineProperties.lineType = 1;
    }

    attribute = this.node.attr('linewidthScaleFactor');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        lineProperties.lineWidth = Math.max(1.0, values[0]);
    } else {
        lineProperties.lineWidth = 1.0;
    }

    return lineProperties;
};
