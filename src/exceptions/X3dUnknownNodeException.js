
X3d.UnknownNodeException = function(details) {
    X3d.Exception.call(this, details);

    this.name = "X3dUnknownNodeException";

    this.message = "Unknown X3D node";
    if (details) {
        this.message = this.message + ": " + details;
    }
}

X3d.UnknownNodeException.prototype = Object.create(X3d.Exception.prototype);
