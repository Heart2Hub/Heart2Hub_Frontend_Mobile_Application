import axios from "axios";
import { REST_ENDPOINT, NEHR_SERVER } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

export const patientApi = {
  validateNric(nric: string) {
    return axiosFetch.get(`${REST_ENDPOINT}/patient/validateNric?nric=${nric}`);
  },
  createPatientWithNehr(newPatient: any, nric: string) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/patient/createPatientWithNehr?nric=${nric}`,
      newPatient
    );
  },
  createPatientWithoutNehr(requestBody: any) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/patient/createPatientWithoutNehr`,
      requestBody
    );
  },
  createNextOfKinRecordDuringCreatePatient(
    ehrId: number,
    newNextOfKinRecord: any
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/patient/createNextOfKinRecordDuringCreatePatient?ehrId=${ehrId}`,
      newNextOfKinRecord
    );
  },
};
