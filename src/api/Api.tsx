import axios from "axios";
import { REST_ENDPOINT } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosFetch.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

export const patientApi = {
  createPatient(requestBody: any) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/patient/createPatient`,
      requestBody
    );
  },
  login(username: string, password: string) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/patient/patientLogin?username=${username}&password=${password}`
    );
  },
  changePassword(username: string, oldPassword: string, newPassword: string) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/patient/changePassword?username=${username}&oldPassword=${oldPassword}&newPassword=${newPassword}`
    );
  },
};
