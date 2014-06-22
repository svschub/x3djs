X3d.PointLightNode = function(node) {
    X3d.LightNode.call(this, node);
};

X3d.PointLightNode.prototype = Object.create(X3d.LightNode.prototype);

X3d.PointLightNode.prototype.parse = function() {
    var attribute,
        values, 
        light;

    console.log('parsing X3D point light');

    this.parseBasicLightProperties();

    attribute = this.node.attr('radius');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        this.distance = values[0];
    } else {
        this.distance = 0;
    }

    light = new THREE.PointLight(this.color.getHex(), this.intensity, this.distance);

    return light;
};
