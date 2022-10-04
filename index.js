const fs = require("fs");
const http = require("http");
const requests = require("requests");

const Indexfile = fs.readFileSync("index.html", "utf-8");

const replaceval = (tempval, orgVal) => {
    let temperature = tempval.replace("{%tempval%}", orgVal.main.temp);
         temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
         temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
         temperature = temperature.replace("{%location%}", orgVal.name);
         temperature = temperature.replace("{%country%}", orgVal.sys.country);
         temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main)
        
        return temperature 
} 

const server = http.createServer((req,res) => {
    if(req.url == "/"){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=cambridge,uk&appid=301b651c2de00b029b2af83b04bc0573`)
        .on("data", (chunk) => {
            const orgData = JSON.parse(chunk);
            const Arrayform = [orgData];
            const realTimeData = Arrayform.map((val) => replaceval(Indexfile, val) )
            .join("");
            res.write(realTimeData) 

        })
        .on("end", (err) => {
            if(err) console.log("Sorry! Page is not responding due to errors ", err);
            // console.log("end");
            res.end();           
        })
    }
})

server.listen(8000, "127.0.0.1");