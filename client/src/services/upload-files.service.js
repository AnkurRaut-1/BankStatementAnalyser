import http from "../http-common";

class UploadFilesService {

  upload(file, onUploadProgress, password, name, email, accNum, custId) {
    let formData = new FormData();
    formData.append("file", file);
    return http.post("/upload/?password=" + password + "&custName=" + name + "&custEmail=" + email + "&custAccountNumber=" + accNum + "&custId=" + custId, formData, {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

  }

  async getFiles() {
    return await http.get("/upload");
  }
}
export default new UploadFilesService();