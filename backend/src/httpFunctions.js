const http = require("http");

module.exports.httpGet = (url) => {
    return new Promise((resolve, reject)=>{
        http.get(url, (resp) => {
            console.log(url);
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });        
          resp.on('end', () => {
            let conversationObject = JSON.parse(data);
            console.log(conversationObject);
            resolve(conversationObject);
          });
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
    })
    
}