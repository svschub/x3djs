X3d.TransformNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.TransformNode.prototype = Object.create(X3d.Node.prototype);

X3d.TransformNode.prototype.parse = function() {
    var self = this,
        object3d = new THREE.Object3D(),
        attribute,
        result,
        position,
        scale,
        quaternion,
        transformationMatrix;

    console.log('parsing X3D transform ' + self.node.attr('DEF'));

    transformationMatrix = new THREE.Matrix4();

    attribute = self.node.attr('rotation');
    if (attribute) {
        result = this.parseFloatArray(attribute);
        quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(
            new THREE.Vector3(result[0], result[1], result[2]),
            result[3]
        );
        transformationMatrix.makeRotationFromQuaternion(quaternion);

        console.log('rotation: ' + JSON.stringify(quaternion) + ', raw=' + JSON.stringify(result));
    } else {
        transformationMatrix.identity();
    }

    attribute = self.node.attr('scale');
    if (attribute) {
        scale = self.parseVector3(attribute);
        transformationMatrix.scale(scale);
        console.log('scale: ' + JSON.stringify(scale));
    }

    attribute = self.node.attr('translation');
    if (attribute) {
        position = self.parseVector3(attribute);
        transformationMatrix.setPosition(position);
        console.log('translation: ' + JSON.stringify(position));
    }

    this.node.children().each(function() {
        var child;

        try {
            child = X3d.Node.parse($(this));

            if (child instanceof THREE.Camera) {
                X3d.transformObjectByMatrix(child, transformationMatrix);
                X3d.sceneCamera = child;
            } else if (child instanceof THREE.Light) {
                X3d.transformObjectByMatrix(child, transformationMatrix);
                X3d.lights.push(child);
            } else {
                object3d.add(child);
            }
        } catch (e) {
            throw e;
        }
    });

    if (object3d.children.length > 0) {
        object3d.applyMatrix(transformationMatrix);
    } else {
        object3d = null;
    }

    return object3d;
};
