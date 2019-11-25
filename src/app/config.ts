
let serverUrlEnv= ""

//localhost
if(window.location.hostname.indexOf("localhost") > -1){
  serverUrlEnv = "http://localhost:3000"
} else {  //dev server
  if(window.location.hostname.indexOf("sid") > -1){
    serverUrlEnv = "http://3.135.146.133:3000" //"https://sidapp.com"
  }
}

export const serverUrl = serverUrlEnv
