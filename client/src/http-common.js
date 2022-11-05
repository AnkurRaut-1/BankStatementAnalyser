import axios from "axios";
export default axios.create({
   baseURL: "https://BSA.stackroute.io/api",
  //baseURL: "http://localhost:8081/api",
  headers: {
    "mode": "no-cors",
    "content-type": "application/json"
  }
});
