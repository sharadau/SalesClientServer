
var getUniqueTime = function() {
    var time = new Date().getTime();
    while (time == new Date().getTime());
    return new Date().getTime();
};
