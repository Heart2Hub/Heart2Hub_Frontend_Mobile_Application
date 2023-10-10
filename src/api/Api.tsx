import axios from "axios";
import { ELGIN_IP, IMAGE_SERVER } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosFetch.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

export const imageServerApi = {
  uploadProfilePhoto(type: string, image: FormData | undefined) {
    return axiosFetch.post(`${IMAGE_SERVER}/upload/${type}`, image);
  },
};

export const staffApi = {
  getStaffListByRole(role: string, unit: string) {
    return axiosFetch.get(
      `${ELGIN_IP}/staff/getStaffByRole?role=${role}&unit=${unit}`
    );
  },
  getStaffById(id: number) {
    return axiosFetch.get(`${ELGIN_IP}/staff/getStaffById?id=${id}`);
  },
};

export const patientApi = {
  getAllPatients() {
    return axiosFetch.get(
      `${ELGIN_IP}/patient/getAllPatientsWithElectronicHealthRecordSummaryByName?name`
    );
  },
  validateNric(nric: string) {
    return axiosFetch.get(`${ELGIN_IP}/patient/validateNric?nric=${nric}`);
  },
  createPatientWithNehr(requestBody: any, nric: string) {
    return axiosFetch.post(
      `${ELGIN_IP}/patient/createPatientWithNehr?nric=${nric}`,
      requestBody
    );
  },
  createPatientWithoutNehr(requestBody: any) {
    return axiosFetch.post(
      `${ELGIN_IP}/patient/createPatientWithoutNehr`,
      requestBody
    );
  },
  login(username: string, password: string) {
    return axiosFetch.post(
      `${ELGIN_IP}/patient/patientLogin?username=${username}&password=${password}`
    );
  },
  changePassword(username: string, oldPassword: string, newPassword: string) {
    return axiosFetch.put(
      `${ELGIN_IP}/patient/changePassword?username=${username}&oldPassword=${oldPassword}&newPassword=${newPassword}`
    );
  }
};

export const departmentApi = {
  getAllDepartments(name: string) {
    return axiosFetch.get(
      `${ELGIN_IP}/department/getAllDepartments?name=${name}`
    );
  },
};

export const shiftApi = {
  viewOverallRoster(username: string) {
    return axiosFetch.get(`${ELGIN_IP}/shift/viewOverallRoster/${username}`);
  },
};

export const appointmentApi = {
  createAppointment(
    description: string,
    bookedDate: string,
    priority: string,
    patientUsername: string,
    department: string,
    staffUsername: string
  ) {
    return axiosFetch.post(
      `${ELGIN_IP}/appointment/createNewAppointmentWithStaff?description=${description}&bookedDateTime=${bookedDate}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${department}&staffUsername=${staffUsername}`
    );
  },
  updateAppointment(
    id: number,
    description: string,
    bookedDate: string,
    patientUsername: string,
    staffUsername: string
  ) {
    return axiosFetch.put(
      `${ELGIN_IP}/appointment/updateAppointment?appointmentId=${id}&description=${description}&bookedDateTime=${bookedDate}&patientUsername=${patientUsername}&staffUsername=${staffUsername}`
    );
  },
  deleteAppointment(id: number) {
    return axiosFetch.delete(
      `${ELGIN_IP}/appointment/cancelAppointment?appointmentId=${id}`
    );
  },
  viewPatientAppointments(username: string) {
    return axiosFetch.get(
      `${ELGIN_IP}/appointment/viewPatientAppointments?patientUsername=${username}`
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
      `${ELGIN_IP}/appointment/viewAllAppointmentsByRange?startDay=${startDay}&startMonth=${startMonth}&startYear=${startYear}&endDay=${endDay}&endMonth=${endMonth}&endYear=${endYear}&departmentName=${departmentName}&selectStaffId=0`
    );
  },
};

export const electronicHealthRecordApi = {
  getElectronicHealthRecordByUsername(username: string) {
    return axiosFetch.get(
      `${ELGIN_IP}/electronicHealthRecord/getElectronicHealthRecordByUsername?username=${username}`
    );
  },
  getNehrRecord(nric: string) {
    return axiosFetch.get(
      `${ELGIN_IP}/electronicHealthRecord/getNehrRecord?nric=${nric}`
    );
  },
  updateElectronicHealthRecord(ehrId: number, ehr: any) {
    return axiosFetch.put(
      `${ELGIN_IP}/electronicHealthRecord/updateElectronicHealthRecord?electronicHealthRecordId=${ehrId}`,
      ehr
    );
  },
};

export const nextOfKinRecordApi = {
  createNextOfKinRecord(ehrId: number, newNextOfKinRecord: any) {
    return axiosFetch.post(
      `${ELGIN_IP}/nextOfKinRecord/createNextOfKinRecord?ehrId=${ehrId}`,
      newNextOfKinRecord
    );
  },
  deleteNextOfKinRecord(nextOfKinRecordId: number) {
    return axiosFetch.delete(
      `${ELGIN_IP}/nextOfKinRecord/deleteNextOfKinRecord?nextOfKinRecordId=${nextOfKinRecordId}`
    );
  },
};
