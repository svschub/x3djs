
X3d.Exception = function(details) {
    this.name = "Exception";
    this.message = "";
}

X3d.Exception.prototype.getMessage = function () {
    return this.message;
};

