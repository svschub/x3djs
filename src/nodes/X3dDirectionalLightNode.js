X3d.DirectionalLightNode = function(node) {
    X3d.LightNode.call(this, node);
};

X3d.DirectionalLightNode.prototype = Object.create(X3d.LightNode.prototype);

X3d.DirectionalLightNode.prototype.parse = function() {
    var attribute,
        values,
        light;

    console.log('parsing X3D directional light');

    this.parseBasicLightProperties();

    attribute = this.node.attr('direction');
    if (attribute) {
        this.direction = this.parseVector3(attribute);
    }

    light = new THREE.DirectionalLight(this.color.getHex(), this.intensity);
    light.position = this.direction;
    light.position.negate();

    return light;
};
