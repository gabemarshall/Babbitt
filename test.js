// var spawn = require('child_process').spawn,
//     grep  = spawn('git', ['status']);
    
var child = require('child_process');
var gitIt = child.spawn('git', ['status']);

process.stdin.pipe(gitIt.stdin);

gitIt.stdin.on("end", function() {
    process.exit(0);
});

gitIt.stdout.on('data', function (data) {
    console.log(data+'');
});

gitIt.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

