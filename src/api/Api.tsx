import axios from "axios";
import { REST_ENDPOINT } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

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
};
