var fs = require('./core/file');
var f = require('fs');
var p = require("path");

var input_path = 'resource';
var out_path = 'resource/webp/';
var exec = require('child_process').exec;
var q = 75; // webp质量
var cacheList = [];
var count = 0;

function read(path, cb) {
    var files = f.readdirSync(path);
    for (let i = 0; i < files.length; ++i) {
        let file = files[i];
        if (file == '.DS_Store') continue
        var a = p.join(path, file);
        if (f.lstatSync(a).isDirectory()) {
            read(a, cb);
        }
        else {
            if (file.match('.png') || file.match('.jpg')) {
                execute(file, path, cb);
            }
        }
    }
}

// 递归创建目录  
function mkdirsSync(dirname) {
    //console.log(dirname);  
    if (f.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(p.dirname(dirname))) {
            f.mkdirSync(dirname);
            return true;
        }
    }
}

function execute(file, path, cb) {
    var t = path.replace('chaotic/resource', 'chaotic/resource/webp')
    if (mkdirsSync(t)) {
        var i = p.join(path, file); // png输入路径
        var o = p.join(t, file); // webp输出路径
        cacheList.push(i);
        o = o.replace('.png', '.webp');
        o = o.replace('.jpg', '.webp');
        cacheList.push(o);
        var cmd = `cwebp -q ${q} ${i} -o ${o}`;
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.log("fail !! fail file ------->", o);
            }
            else {
                console.log("success !! output file ------->", o);
                count++;
                if (count == cacheList.length) {
                    cb();
                }
            }
        });
    }
}
// read(input_path);

function start(input_path, out_path, cb) {
    fs.remove(out_path);
    fs.createDirectory(out_path);
    read(input_path, cb);
    // 输出缓存文件
    fs.save(input_path + '/cacheFile.json', JSON.stringify(cacheList));
}




module.exports = {
    start: start
}