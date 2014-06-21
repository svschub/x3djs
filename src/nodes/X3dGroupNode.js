X3d.GroupNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.GroupNode.prototype = Object.create(X3d.Node.prototype);

X3d.GroupNode.prototype.parse = function() {
    var object3d = new THREE.Object3D(),
        child;

    console.log('parsing X3D group ' + this.node.attr('DEF'));

    this.node.children().each(function() {
        try {
            child = X3d.Node.parse($(this));
            object3d.add(child);
        } catch (e) {
            throw e;
        }
    });

    return object3d;
};
