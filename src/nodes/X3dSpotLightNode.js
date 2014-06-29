X3d.SpotLightNode = function(node) {
    X3d.LightNode.call(this, node);
};

X3d.SpotLightNode.prototype = Object.create(X3d.LightNode.prototype);

X3d.SpotLightNode.prototype.parse = function() {
    var attribute,
        values,
        light;

    console.log('parsing X3D spot light');

    this.parseBasicLightProperties();

    attribute = this.node.attr('location');
    if (attribute) {
        this.location = this.parseVector3(attribute);
    }

    attribute = this.node.attr('direction');
    if (attribute) {
        this.direction = this.parseVector3(attribute);
    }

    attribute = this.node.attr('radius');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        this.distance = values[0];
    }

    attribute = this.node.attr('beamWidth');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        this.beamWidth = values[0];
    }

    attribute = this.node.attr('cutOffAngle');
    if (attribute) {
        values = this.parseFloatArray(attribute);
        this.angle = values[0];
    }

    attribute = this.node.attr('attenuation');
    if (attribute) {
        this.attenuation = this.parseFloatArray(attribute);
    }

    this.exponent = 1.0;

    light = new THREE.SpotLight(
        this.color.getHex(), 
        this.intensity, 
        this.distance,
        this.angle,
        this.exponent
    );

    light.position.copy(this.location);

    light.target.position.copy(this.location);
    light.target.position.add(this.direction);

    console.log('spotlight node: ' + JSON.stringify(this));
    console.log('spotlight target: ' + JSON.stringify(light.target.position));

    return light;
};
