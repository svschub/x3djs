
X3d.Exception = function(details) {
    this.name = "Exception";
    this.message = details;
}

X3d.Exception.prototype.getMessage = function () {
    return this.message;
};

