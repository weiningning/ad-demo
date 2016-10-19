var fs = require('fs'),
    ary = [];
fs.readdir('.', function (error, fileAry) {
    fileAry.forEach(function (item, index) {
        var reg = /\.([a-zA-Z0-9]+)/i,
            suffix = reg.exec(item)[1].toUpperCase();
        if (suffix === 'JS') {
            return;
        }
        ary.push('img/' + item);
    });
    console.log(JSON.stringify(ary));
});

