import http from "../http-common";

class BSA_API_Service {
    searchByAccountNumber(acc_num) {
        return http.get("/searchByAccountNumber/" + acc_num.toString());
    }
    searchByEmailAddress(email) {
        return http.get("/searchByEmail/" + email);
    }
    searchByCustomerId(cust_id) {
        return http.get("/searchById/" + cust_id.toString());
    }
}
export default new BSA_API_Service();
