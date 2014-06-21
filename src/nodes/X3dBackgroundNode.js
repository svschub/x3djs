X3d.BackgroundNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.BackgroundNode.prototype = Object.create(X3d.Node.prototype);

X3d.BackgroundNode.prototype.parse = function() {
    // @todo to be implemented
    console.log('parsing X3D background');

    return null;
};
