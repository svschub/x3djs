X3d.SceneNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.SceneNode.prototype = Object.create(X3d.Node.prototype);

X3d.SceneNode.prototype.parse = function() {
    var scene = new THREE.Scene(),
        child;

    console.log('parsing X3D scene');

    this.node.children().each(function () {
        try {
            child = X3d.Node.parse($(this));
            if (child !== null) {
                scene.add(child);
            }
        } catch(e) {
            throw e;
        }
    });

    return scene;
};
