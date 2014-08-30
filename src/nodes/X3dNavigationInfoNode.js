X3d.NavigationInfoNode = function(node) {
    X3d.Node.call(this, node);
};

X3d.NavigationInfoNode.prototype = Object.create(X3d.Node.prototype);

X3d.NavigationInfoNode.prototype.parse = function(sceneLoader) {
    // @todo to be implemented
    console.log('parsing X3D navigation info');

    return null;
};
