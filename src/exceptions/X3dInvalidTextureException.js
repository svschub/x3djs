
X3d.InvalidTextureException = function(details) {
    X3d.Exception.call(this, details);

    this.name = "X3dInvalidTextureException";

    this.message = "Invalid texture";
    if (details) {
        this.message = this.message + ": " + details;
    }
}

X3d.InvalidTextureException.prototype = Object.create(X3d.Exception.prototype);
