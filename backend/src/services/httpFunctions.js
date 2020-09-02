const http = require("http");

exports.httpGet = (url) => {
    return new Promise((resolve, reject)=>{
      http.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });        
        resp.on('end', () => {
          resolve(JSON.parse(data)[0]);
    })
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
    resolve();
  })
})
}