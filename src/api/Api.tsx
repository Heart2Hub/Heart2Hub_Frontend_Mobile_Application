import axios from "axios";
import { REST_ENDPOINT } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosFetch.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

export const staffApi = {
  getStaffListByRole(role: string, unit: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffByRole?role=${role}&unit=${unit}`
    );
  },
  getStaffById(id: number) {
    return axiosFetch.get(`${REST_ENDPOINT}/staff/getStaffById?id=${id}`);
  },
};

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

export const departmentApi = {
  getAllDepartments(name: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/department/getAllDepartments?name=${name}`
    );
  },
};

export const shiftApi = {
  viewOverallRoster(username: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shift/viewOverallRoster/${username}`
    );
  },
};

export const appointmentApi = {
  createAppointment(
    description: string,
    actualDate: string,
    bookedDate: string,
    priority: string,
    patientUsername: string,
    department: string,
    staffUsername: string
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/createNewAppointmentWithStaff?description=${description}&actualDateTime=${actualDate}&bookedDateTime=${bookedDate}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${department}&staffUsername=${staffUsername}`
    );
  },
  viewPatientAppointments(username: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewPatientAppointments?patientUsername=${username}`
    );
  },
  viewAllAppointmentsByRange(
    startDay: number,
    startMonth: number,
    startYear: number,
    endDay: number,
    endMonth: number,
    endYear: number,
    departmentName: string
  ) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewAllAppointmentsByRange?startDay=${startDay}&startMonth=${startMonth}&startYear=${startYear}&endDay=${endDay}&endMonth=${endMonth}&endYear=${endYear}&departmentName=${departmentName}`
    );
  },
};

export const electronicHealthRecordApi = {
  getElectronicHealthRecordByUsername(username: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getElectronicHealthRecordByUsername?username=${username}`
    );
  },
  updateElectronicHealthRecord(ehrId: number, ehr: any) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/electronicHealthRecord/updateElectronicHealthRecord?electronicHealthRecordId=${ehrId}`,
      ehr
    );
  },
};

export const nextOfKinRecordApi = {
  createNextOfKinRecord(ehrId: number, newNextOfKinRecord: any) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/nextOfKinRecord/createNextOfKinRecord?ehrId=${ehrId}`,
      newNextOfKinRecord
    );
  },
};
