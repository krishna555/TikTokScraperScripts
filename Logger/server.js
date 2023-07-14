const http = require("http");
const fs = require("fs");
const path = require('path');
const urlSet = new Set();

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

var file_id = 0;

function getFileName() {
    let baseDir = "./extracted_data/";
    fname = "data_" + file_id + ".txt";
    var path = baseDir + fname;
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '');
    }
    if (getFilesizeInBytes(path) > 2000000) {
        file_id += 1;
        fname = "data_" + file_id + ".txt";
    }
    var path = baseDir + fname;
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '');
    }
    return path;
}


const server = http.createServer((request, response) => {
    try {
        current = decodeURI(request.url.substring(1));
    } catch (err) {
        console.log("Failed for URL: " + request.url);
        response.end();
    }
    if (urlSet.has(current)) {
        response.end();
        return;
    }

    if (urlSet.size >= 100000) {
        urlSet.clear();
    }

    urlSet.add(current);
    fname = getFileName();

    fs.appendFileSync(fname, current + "\n", (err) => {
        if (err) {
            console.log(err);
        }
    });
    response.end();
});

server.listen(9000);
