import axios from "axios";
import { REST_ENDPOINT, IMAGE_SERVER } from "../constants/RestEndPoint";

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
      `${REST_ENDPOINT}/staff/getStaffByRole?role=${role}&unit=${unit}`
    );
  },
  getStaffById(id: number) {
    return axiosFetch.get(`${REST_ENDPOINT}/staff/getStaffById?id=${id}`);
  },
  getAllStaff() {
    return axiosFetch.get(`${REST_ENDPOINT}/staff/getAllStaffs`);
  },
  getStaffsWorkingInCurrentShiftAndDepartment(unit: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffsWorkingInCurrentShiftAndDepartment?departmentName=${unit}`
    );
  },
  getStaffsInUnit(unit: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffsInUnit?&unit=${unit}`
    );
  },
};

export const patientApi = {
  getAllPatients() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/patient/getAllPatientsWithElectronicHealthRecordSummaryByName?name`
    );
  },
  validateNric(nric: string) {
    return axiosFetch.get(`${REST_ENDPOINT}/patient/validateNric?nric=${nric}`);
  },
  createPatientWithNehr(requestBody: any, nric: string) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/patient/createPatientWithNehr?nric=${nric}`,
      requestBody
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
    bookedDate: string,
    priority: string,
    patientUsername: string,
    department: string,
    staffUsername: string
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/createNewAppointmentWithStaff?description=${description}&bookedDateTime=${bookedDate}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${department}&staffUsername=${staffUsername}`
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
      `${REST_ENDPOINT}/appointment/updateAppointment?appointmentId=${id}&description=${description}&bookedDateTime=${bookedDate}&patientUsername=${patientUsername}&staffUsername=${staffUsername}`
    );
  },
  deleteAppointment(id: number) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/appointment/cancelAppointment?appointmentId=${id}`
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
      `${REST_ENDPOINT}/appointment/viewAllAppointmentsByRange?startDay=${startDay}&startMonth=${startMonth}&startYear=${startYear}&endDay=${endDay}&endMonth=${endMonth}&endYear=${endYear}&departmentName=${departmentName}&selectStaffId=0`
    );
  },
  viewAllAppointmentsByDay(
    date: string
  ) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewAllAppointmentsByDay?date=${date}`
    );
  },
  update() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/update`
    );
  },
};

export const electronicHealthRecordApi = {
  getElectronicHealthRecordByUsername(username: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getElectronicHealthRecordByUsername?username=${username}`
    );
  },
  getNehrRecord(nric: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getNehrRecord?nric=${nric}`
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
  deleteNextOfKinRecord(nextOfKinRecordId: number) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/nextOfKinRecord/deleteNextOfKinRecord?nextOfKinRecordId=${nextOfKinRecordId}`
    );
  },
};

export const invoiceApi = {
  getAllInvoices() {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/getAllInvoices`);
  },
  findInvoice(id: number) {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/findInvoice/${id}`);
  },
  findInvoicesOfAPatient(username: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findInvoicesOfAPatient/${username}`
    );
  },
  findInvoicesOfAPatientEarliest(username: string) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findInvoicesOfAPatientEarliest/${username}`
    );
  },
  findPatientOfInvoice(id: number) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findPatientOfInvoice/${id}`
    );
  },
  findMedishieldClaimOfInvoice(id: number) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findMedishieldClaimOfInvoice/${id}`
    );
  },
  findInsuranceClaimOfInvoice(id: number) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findInsuranceClaimOfInvoice/${id}`
    );
  },
  findTransactionItemOfInvoice(id: number) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findTransactionItemOfInvoice/${id}`
    );
  },
}

  export const transactionApi = {
    getAllTransactionsOfPatientMobile(username: string) {
      return axiosFetch.get(`${REST_ENDPOINT}/transaction/getAllTransactionsOfPatientMobile/${username}`);
    },
    getAllTransactionsOfPatientMobileEarliest(username: string) {
      return axiosFetch.get(`${REST_ENDPOINT}/transaction/getAllTransactionsOfPatientMobileEarliest/${username}`);
    },
    createTransaction(id: number, amount: number) {
      return axiosFetch.post(`${REST_ENDPOINT}/transaction/createTransaction/${id}/${amount}`);
    },
    findTransactionWithInvoice(id: number) {
      return axiosFetch.get(`${REST_ENDPOINT}/transaction/findTransactionWithInvoice/${id}`);
    },
    findInvoiceUsingTransaction(id: number) {
      return axiosFetch.get(
        `${REST_ENDPOINT}/invoice/findInvoiceUsingTransaction/${id}`
      );
    },
  }

  export const subsidyApi = {
    findAllSubsidiesOfPatient(username: string) {
      return axiosFetch.get(`${REST_ENDPOINT}/subsidy/findAllSubsidiesOfPatient/${username}`);
    },
  }


