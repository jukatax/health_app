var express = require('express');
var fs = require('fs');
var app = express();
var opener = require('open');
var sass = require('node-sass');
var ip = '';
var port = Math.floor(1000*Math.random())+3000;
var ni = require('os').networkInterfaces();
for(var i in ni){
    ni[i].forEach(function(val,ind,c){
        if(c[ind].family=='IPv4' && c[ind].internal==false && (i=='en0'||i=='lo0')){
            ip=c[ind].address;
        }else if(c[ind].family=='IPv4' && c[ind].internal==true){
            ip=c[ind].address;
        }
    });
}

app.use('/',express.static(__dirname + '/public/'));
//app.use('/*',express.static(__dirname + '/public/404.html'));

//###### render sass files ########
function renderScss(){
    var inputFile = './public/css/styles.scss',
        outputFile = './public/css/styles.css',
        outputFile2 = './public/css/styles.min.css';
    //UNCOMPRESSED FILE
    var result = sass.renderSync({
      file: inputFile ,
      outputStyle: 'expanded',
      outFile: outputFile
    }); 
    fs.open(outputFile , "w" , function(err,fd){ //create the uncompressed file
        fs.writeFile(outputFile , result.css);
        fs.close(fd);
    });
    //COMPRESSED FILE
    var result2 = sass.renderSync({
      file: inputFile ,
      outputStyle: 'compressed',
      outFile: outputFile2,
      sourceMap: undefined // or an absolute or relative (to outFile) path
    });
    fs.open(outputFile2 , "w" , function(err,fd){ //create the compressed file
        fs.writeFile(outputFile2 , result2.css);
        fs.close(fd);
    });
    
}
renderScss();
//########### END render sass files ###########

var server = app.listen(port , ip , function(){
    console.log('### System ### - Server running on '+ip+':'+port);
    console.log('### System ### - Opening default browser... ');
    opener('http://'+ip+':'+port);
});

var io = require('socket.io')(server);

fs.watch('./public' ,{ persistent: true, recursive: true } , function(event,filename){
    console.log('### Dev ### - '+event+' in '+filename+'\n...RELOADING...');
    if(filename.match(/\.(scss|html|css|js|jpe?g|gif|png)/)){
        if(filename.match(/\.(scss)/)){
           renderScss();
        }
        io.emit('doRefresh'); 
    }
    
});
//fs.watch('./public/css/styles.scss' ,{ persistent: true, recursive: true } , function(event,filename){
//    console.log('### Dev ### - '+event+' in '+filename+'\n...RELOADING...');
//    renderScss();
//    io.emit('doRefresh'); 
//});
/*io.on('connection',function(client){
        client.on('chat',function(data){
             io.emit('notify' , data);
        });
});*/
