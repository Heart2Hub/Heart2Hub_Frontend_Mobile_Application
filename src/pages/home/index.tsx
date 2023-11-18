import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonImg,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonBadge,
  IonLabel,
  AccordionGroupCustomEvent,
  IonButton,
  IonModal,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonCardTitle,
  IonCardSubtitle,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import {
  patientApi,
  appointmentApi,
  staffApi,
  patientRequestApi,
  admissionApi,
  medicationOrderApi,
  inpatientTreatmentApi,
} from "../../api/Api";
import {
  personCircle,
  logOut,
  repeat,
  arrowForward,
  heartOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";
import heartLogo from "../../assets/heartLogo.png";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import dayjs from "dayjs";
import { REST_ENDPOINT } from "../../constants/RestEndPoint";
import { OverlayEventDetail } from "@ionic/core";
import showerIcon from "../../assets/shower-solid.svg";
import waterIcon from "../../assets/glass-water-solid.svg";
import toiletIcon from "../../assets/toilet-solid.svg";
import moment, { Moment } from "moment";
import './index.css'

type Patient = {
  patientId: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

type Staff = {
  staffId: number;
  firstname: string;
  lastname: string;
  staffRoleEnum: string;
  location: string;
  name: string;
  unit: {
    listOfFacilities: Facility[]
  }
};

interface Appointment {
  appointmentId: number;
  description: string;
  comments: string;
  bookedDateTime: number[];
  departmentName: string;
  currentAssignedStaffId: number;
  arrived: boolean;
  swimlaneStatusEnum: string;
  listOfStaffsId: number[];
  dispensaryStatusEnum: string;
}

interface Facility {
  location: string;
  name: string;
}
interface Order {
  medications: string[];
  treatment: string;
  startDate: string;
  endDate: string;
  staff: string;
  location: string;
  comments: string;
}

//TODO: create a 'models' folder with our diff entities
interface Ehr {
  firstName: string;
  lastName: string;
}
const Home = () => {
  const storedUsername = localStorage.getItem("username") || "";
  const history = useHistory();
  const [patient, setPatient] = useState<Patient>();
  const [currAppointments, setCurrAppointments] = useState<Appointment[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);

  //for patient requests
  const [selectedCards, setSelectedCards] = useState<any>({
    WATER: false,
    TOILET: false,
    BATH: false,
  });
  const [requestCount, setRequestCount] = useState(0);
  const [currAdmission, setCurrAdmission] = useState<any>();
  const [admissionStaffs, setAdmissionStaffs] = useState<Staff[]>([]);

  const date = dayjs();

  const getAppointmentToday = async () => {
    try {
      const response = await appointmentApi.viewAllAppointmentsByDay(
        date.format("YYYY-MM-DD") + "T00:00:00"
      );
      const appts = response.data.filter(
        (appointment: any) => appointment.username === storedUsername
      );
      getAllStaff(appts[0]?.departmentName);
      setCurrAppointments(appts);
    } catch (error) {
      console.log(error);
    }
  };

  const getColor = (tab: string) => {
    if (tab === "REGISTRATION") {
      return "#666666";
    } else if (tab === "TRIAGE") {
      return "#ff85ff";
    } else if (tab === "CONSULTATION") {
      return "#2ecc71";
    } else if (tab === "TREATMENT") {
      return "#f1c40f";
    } else if (tab === "PHARMACY") {
      return "#9b59b6";
    } else if (tab === "ADMISSION") {
      return "#e67e22";
    } else if (tab === "DISCHARGE") {
      return "#34495e";
    } else {
      return "#ffb700";
    }
  };

  const getStaff = (staffsId: number[], swimlane: string) => {
    for (let i = 0; i < staffsId.length; i++) {
      for (let j = 0; j < staffs.length; j++) {
        if (swimlane === "REGISTRATION") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum === "ADMIN"
          ) {
            return staffs[j];
          }
        } else if (swimlane === "TRIAGE") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum === "NURSE"
          ) {
            return staffs[j];
          }
        } else if (swimlane === "CONSULTATION") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum === "DOCTOR"
          ) {
            return staffs[j];
          }
        } else if (swimlane === "PHARMACY") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum === "PHARMACIST"
          ) {
            return staffs[j];
          }
        } else if (swimlane === "ADMISSION") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum === "ADMIN"
          ) {
            return staffs[j];
          }
        } else if (swimlane === "TREATMENT") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum !== "ADMIN" &&
            staffs[j].staffRoleEnum !== "DOCTOR" &&
            staffs[j].staffRoleEnum !== "NURSE" &&
            staffs[j].staffRoleEnum !== "PHARMACIST"
          ) {
            return staffs[j];
          }
        } else if (swimlane === "DISCHARGE") {
          if (
            staffs[j].staffId === staffsId[i] &&
            staffs[j].staffRoleEnum === "ADMIN"
          ) {
            return staffs[j];
          }
        }
      }
    }
    for (let j = 0; j < staffs.length; j++) {
      if (staffs[j].staffId === 1) {
        return staffs[j];
      }
    }
    return staffs[0];
  };

  const getDateTime = (arr: number[]) => {
    const year = arr[0];
    const month = arr[1];
    const day = arr[2];
    const time = arr[3];
    let m = "pm";
    if (time >= 8 && time <= 12) m = "am";
    return day + "/" + month + "/" + year + " " + time + ":00" + m;
  };

  const getNumberOfRoles = (listOfStaffsId: number[]) => {
    let list: string[] = [];
    for (let i = 0; i < listOfStaffsId.length; i++) {
      for (let j = 0; j < staffs.length; j++) {
        if (listOfStaffsId[i] === staffs[j].staffId) {
          if (!list.includes(staffs[j].staffRoleEnum)) {
            list.push(staffs[j].staffRoleEnum);
          }
        }
      }
    }
    return list;
  };

  const getAllStaff = async (unit: string) => {
    try {
      let allStaffs = [];
      const response =
        await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(unit);
      const pharmacists = await staffApi.getStaffsInUnit("Pharmacy");
      allStaffs = response.data.concat(pharmacists.data);
      setStaffs(allStaffs);
    } catch (error) {
      console.log(error);
    }
  };

  const showTimelineCard = (
    appointment: any,
    swimlane: string,
    arrived: string,
    here: boolean
  ) => {
    return (
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentStyle={{ background: getColor(swimlane), color: "#fff" }}
        contentArrowStyle={{ borderRight: `7px solid  ${getColor(swimlane)}` }}
        date={
          (swimlane === "DISCHARGE") ? "" :
          (swimlane === "PHARMACY" &&
            getStaff(appointment.listOfStaffsId, swimlane)?.staffRoleEnum !==
              "PHARMACIST") ||
          (swimlane === "REGISTRATION" &&
            getStaff(appointment.listOfStaffsId, swimlane)?.staffRoleEnum !==
              "ADMIN") 
            ? "Staff: Unassigned"
            : `Staff: ${
                getStaff(appointment.listOfStaffsId, swimlane)?.staffRoleEnum
              } ` +
              getStaff(appointment.listOfStaffsId, swimlane)?.firstname +
              " " +
              getStaff(appointment.listOfStaffsId, swimlane)?.lastname
          
        }
        iconStyle={{ background: getColor(swimlane), color: "#fff" }}
      >
        <h5
          className="vertical-timeline-element-title"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <b>{here && (
            <>
            <span
            className="enlarge-contract"
            style={{
              height: "8px",
              width: "8px",
              marginBottom: "2px",
              backgroundColor: "red",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>&nbsp;&nbsp;
          </>
          )}{swimlane}</b>
        </h5>
        <h6 className="vertical-timeline-element-subtitle">
          {appointment.departmentName}
        </h6>
        <p style={{ fontSize: "15px" }}>
          {swimlane === "REGISTRATION" && (
            <>
              <b>Date/Time:</b> {getDateTime(appointment.bookedDateTime)}
              <br />
            </>
          )}
          <b>Location:</b>{" "}
          {appointment.listOfStaffsId.length === 0 ? "TBC" 
            : swimlane !== "PHARMACY"
            ? getStaff(appointment.listOfStaffsId, swimlane)?.location +
              " " +
              getStaff(appointment.listOfStaffsId, swimlane)?.name
            : appointment.dispensaryStatusEnum === "PREPARING" && appointment.currentAssignedStaffId === null ? 
              "Level 2" 
              : getStaff(appointment.listOfStaffsId, swimlane)?.unit.listOfFacilities[0].location + 
              " " + 
              getStaff(appointment.listOfStaffsId, swimlane)?.unit.listOfFacilities[0].name}
          <br />
          <b>Arrived:</b>{" "}
          <IonBadge
            style={{
              paddingTop: 3,
              paddingBottom: 5,
              marginBottom: -7,
              color: arrived === "Yes" ? "green" : "red",
              backgroundColor: "rgb(255,255,255,1)",
            }}
          >
            {arrived}
          </IonBadge>
          <br />
          {swimlane === "PHARMACY" && (
            <>
              <b>Medicine status:</b>{" "}
              <IonBadge
                style={{
                  paddingTop: 3,
                  paddingBottom: 5,
                  marginBottom: -7,
                  backgroundColor:
                    appointment.dispensaryStatusEnum === "PREPARING"
                      ? "orange"
                      : appointment.dispensaryStatusEnum === "READY_TO_COLLECT"
                      ? "green"
                      : "grey",
                  color: "rgb(255,255,255)",
                }}
              >
                {appointment.dispensaryStatusEnum}
              </IonBadge>
            </>
          )}
        </p>
      </VerticalTimelineElement>
    );
  };

  const showDoneCard = (appointment: any) => {
    return (
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentStyle={{ background: "#ffb700", color: "#000" }}
        contentArrowStyle={{ borderRight: `7px solid #ffb700` }}
        iconStyle={{ background: "#ffb700", color: "#000" }}
      >
        <h4
          className="vertical-timeline-element-title"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <b>
            <>
            <span
            className="enlarge-contract"
            style={{
              height: "8px",
              width: "8px",
              marginBottom: "2px",
              backgroundColor: "red",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>&nbsp;&nbsp;
          </>
          DONE</b>
        </h4>
        <h6 className="vertical-timeline-element-subtitle">
          {appointment.departmentName}
        </h6>
        <p style={{ fontSize: "15px" }}>
          <b>
            You have been discharged successfully! Thank you for choosing
            Heart2Hub.
          </b>
        </p>
      </VerticalTimelineElement>
    );
  };

  //START OF ADMISSION TIMELINE
  const [admissionDate, setAdmissionDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [orders, setOrders] = useState<Moment[]>([]);
  const [orderMap, setOrderMap] = useState<any>();
  const [hasAdmission, setHasAdmission] = useState(false);

  const getAdmissionToday = async () => {
    try {
      const response = await admissionApi.getAllAdmissions();
      const admission = response.data.filter(
        (row: any) => row.username === storedUsername
      )[0];
      if (admission) {
        setHasAdmission(true);

        let admissionDateTime = admission.admissionDateTime;
        if (admissionDateTime.length > 6) {
          admissionDateTime.pop();
        }
        const admissionMoment = moment(admissionDateTime);
        admissionMoment.subtract(1, "months");
        setAdmissionDate(admissionMoment.format("DD/MM/YYYY HH:mmA"));

        const dischargeMoment = moment(admission.dischargeDateTime);
        dischargeMoment.subtract(1, "months");
        setDischargeDate(dischargeMoment.format("DD/MM/YYYY HH:mmA"));

        const startMoment = admissionMoment.startOf("day");
        const endMoment = dischargeMoment.endOf("day");

        if (moment().isBetween(startMoment, endMoment)) {
          //console.log(admission);
          setCurrAdmission(admission);

          const staffPromises = admission.listOfStaffsId.map((id: number) =>
            staffApi.getStaffById(id)
          );
          const staffResponse = await Promise.all(staffPromises);
          const listOfStaff = staffResponse.map((response) => response.data);

          setAdmissionStaffs(listOfStaff);

          const medicationOrders = await getMedicationOrders(
            admission.listOfMedicationOrderIds
          );

          const inpatientTreatments = await getInpatientTreatments(
            admission.listOfInpatientTreatmentIds
          );

          const dateToOrdersMap: any = {};

          for (const medicationOrder of medicationOrders) {
            const startDate = medicationOrder.startDate;

            if (!dateToOrdersMap.hasOwnProperty(startDate)) {
              dateToOrdersMap[startDate] = [medicationOrder];
            } else {
              dateToOrdersMap[startDate].push(medicationOrder);
            }
          }

          for (const inpatientTreatment of inpatientTreatments) {
            const startDate = inpatientTreatment.startDate;
            dateToOrdersMap[startDate] = inpatientTreatment;
          }

          setOrderMap(dateToOrdersMap);

          const timelineEventDates = Object.keys(dateToOrdersMap);
          //console.log(timelineEventDates);

          //TODO: conver to moments and sort timelineEventDates
          const timelineEventMoments = timelineEventDates.map((date) =>
            moment(date)
          );
          timelineEventMoments.sort((a, b) => (a.isBefore(b) ? -1 : 1));

          console.log(timelineEventMoments);
          setOrders(timelineEventMoments);
        } else {
          setCurrAdmission(null);
        }
      } else {
        setHasAdmission(false);
        setCurrAdmission(null);
      }
    } catch (error) {}
  };

  // interface Order {
  //   medications: string[];
  //   treatment: string;
  //   startDate: string;
  //   endDate: string;
  //   staff: string;
  //   location: string;
  //   comments: string;
  // }

  //helper method to get medication orders from medication order ids
  const getMedicationOrders = async (medicationOrderIds: number[]) => {
    const medicationOrderPromises = medicationOrderIds.map((id) =>
      medicationOrderApi.getMedicationOrderById(id)
    );
    const medicationOrderResponses = await Promise.all(medicationOrderPromises);
    const listOfMedicationOrders = medicationOrderResponses.map(
      (response) => response.data
    );

    return listOfMedicationOrders;
  };

  //helper method to get inpatient treatments from inpatient treatment ids
  const getInpatientTreatments = async (inpatientTreatmentIds: number[]) => {
    const inpatientTreatmentPromises = inpatientTreatmentIds.map((id) =>
      inpatientTreatmentApi.getInpatientTreatmentById(id)
    );
    const inpatientTreatmentResponses = await Promise.all(
      inpatientTreatmentPromises
    );
    const listOfInpatientTreatments = inpatientTreatmentResponses.map(
      (response) => response.data
    );
    //console.log(listOfMedicationOrders);
    return listOfInpatientTreatments;
  };

  const showAdmissionEventCard = (admission: any) => {
    if (admission) {
      //console.log(admission);
      //console.log(admissionStaffs);
      const admin = admissionStaffs.filter(
        (staff) => staff.staffRoleEnum === "ADMIN"
      );

      let adminName = "";
      if (admin.length > 0) {
        adminName =
          admin[0].staffRoleEnum +
          " " +
          admin[0].firstname +
          " " +
          admin[0].lastname;
      }
      return (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: getColor("REGISTRATION"),
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: `7px solid  ${getColor("REGISTRATION")}`,
          }}
          date={
            admin.length === 0 ? "Staff: Unassigned" : `Staff: ${adminName}`
          }
          iconStyle={{ background: getColor("REGISTRATION"), color: "#fff" }}
        >
          <h4
            className="vertical-timeline-element-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <b>REGISTRATION</b>
            {!admission.arrived && (
              <IonBadge
                style={{
                  paddingTop: 8,
                  fontSize: "9px",
                  backgroundColor: "yellow",
                  color: "black",
                }}
              >
                 <span
                  className="enlarge-contract"
                  style={{
                    height: "8px",
                    width: "8px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
              </IonBadge>
            )}
          </h4>
          <h6 className="vertical-timeline-element-subtitle">
            {`Ward ${admission.ward}`}
          </h6>
          <p style={{ fontSize: "15px" }}>
            <b>Date/Time:</b> {admissionDate}
            <br />
            <b>Location:</b> {admission.location}
            <br />
            <b>Arrived:</b>{" "}
            <IonBadge
              style={{
                paddingTop: 3,
                paddingBottom: 5,
                marginBottom: -7,
                color: admission.arrived ? "green" : "red",
                backgroundColor: "rgb(255,255,255,1)",
              }}
            >
              {admission.arrived ? "Yes" : "No"}
            </IonBadge>
          </p>
        </VerticalTimelineElement>
      );
    }
  };

  const showMedicationOrderEvent = (
    admission: any,
    medicationOrders: any[],
    startDate: Moment
  ) => {
    if (admission) {
      const nurse = admissionStaffs.filter(
        (staff) => staff.staffRoleEnum === "NURSE"
      );
      let nurseName = "";
      if (nurse.length > 0) {
        nurseName =
          nurse[0].staffRoleEnum +
          " " +
          nurse[0].firstname +
          " " +
          nurse[0].lastname;
      }

      const endDate = moment(medicationOrders[0].endDate);
      const here = moment().isBetween(startDate, endDate);

      return (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: getColor("TRIAGE"),
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: `7px solid  ${getColor("TRIAGE")}`,
          }}
          date={
            nurse.length === 0 ? "Staff: Unassigned" : `Staff: ${nurseName}`
          }
          iconStyle={{ background: getColor("TRIAGE"), color: "#fff" }}
        >
          <h4
            className="vertical-timeline-element-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <b>{here && (
            <>
            <span
            className="enlarge-contract"
            style={{
              height: "8px",
              width: "8px",
              marginBottom: "2px",
              backgroundColor: "red",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>&nbsp;&nbsp;
          </>
          )}MEDICATION</b>
          </h4>
          <h6 className="vertical-timeline-element-subtitle">
            {`Ward ${admission.ward}`}
          </h6>
          <p style={{ fontSize: "15px" }}>
            <b>Date/Time:</b> {startDate.format("DD/MM/YYYY HH:mmA")}
            <br />
            {medicationOrders.map((medicationOrder: any, index) => {
              console.log(medicationOrder);
              return (
                <>
                  <b>Medication {index + 1}:</b>{" "}
                  {medicationOrder.medication.inventoryItemName}
                  <br />
                  <b>Taken:</b>{" "}
                  <IonBadge
                    style={{
                      paddingTop: 3,
                      paddingBottom: 5,
                      marginBottom: -7,
                      color: medicationOrder.isCompleted ? "green" : "red",
                      backgroundColor: "rgb(255,255,255,1)",
                    }}
                  >
                    {medicationOrder.isCompleted ? "Yes" : "No"}
                  </IonBadge>
                  <br />
                </>
              );
            })}
          </p>
        </VerticalTimelineElement>
      );
    }
  };

  const showInpatientTreatmentEvent = (
    admission: any,
    inpatientTreatment: any,
    startDate: Moment
  ) => {
    if (admission) {
      const staffName = inpatientTreatment.createdBy.split("(")[0];
      const staffRole = inpatientTreatment.createdBy.split("(")[1].slice(0, -1);

      const endDate = moment(inpatientTreatment.endDate);
      const here = moment().isBetween(startDate, endDate);

      return (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: getColor("CONSULTATION"),
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: `7px solid  ${getColor("CONSULTATION")}`,
          }}
          date={`Staff: ${staffRole} ${staffName}`}
          iconStyle={{ background: getColor("CONSULTATION"), color: "#fff" }}
        >
          <h4
            className="vertical-timeline-element-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <b>{here && (
            <>
            <span
            className="enlarge-contract"
            style={{
              height: "8px",
              width: "8px",
              marginBottom: "2px",
              backgroundColor: "red",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>&nbsp;&nbsp;
          </>
          )}TREATMENT</b>
          </h4>
          <h6 className="vertical-timeline-element-subtitle">
            {`Ward ${admission.ward}`}
          </h6>
          <p style={{ fontSize: "15px" }}>
            <b>Date/Time:</b> {startDate.format("DD/MM/YYYY HH:mmA")}
            <br />
            <b>Treatment:</b> {inpatientTreatment.serviceItem.inventoryItemName}
            <br />
            <b>Location:</b> {inpatientTreatment.location}
            <br />
            <b>Arrived:</b>{" "}
            <IonBadge
              style={{
                paddingTop: 3,
                paddingBottom: 5,
                marginBottom: -7,
                color: inpatientTreatment.arrived ? "green" : "red",
                backgroundColor: "rgb(255,255,255,1)",
              }}
            >
              {inpatientTreatment.arrived ? "Yes" : "No"}
            </IonBadge>
            <br />
            <b>Completed:</b>{" "}
            <IonBadge
              style={{
                paddingTop: 3,
                paddingBottom: 5,
                marginBottom: -7,
                color: inpatientTreatment.isCompleted ? "green" : "red",
                backgroundColor: "rgb(255,255,255,1)",
              }}
            >
              {inpatientTreatment.isCompleted ? "Yes" : "No"}
            </IonBadge>
          </p>
        </VerticalTimelineElement>
      );
    }
  };

  const showAdmissionDoneCard = (admission: any) => {
    if (admission) {
      const dischargeMoment = moment(admission.dischargeDateTime);
      dischargeMoment.subtract(1, "months");
      const here = moment().isSameOrAfter(dischargeMoment);

      return (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: getColor("DONE"),
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: `7px solid  ${getColor("DONE")}`,
          }}
          date={""}
          iconStyle={{ background: getColor("DONE"), color: "#fff" }}
        >
          <h4
            className="vertical-timeline-element-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <b>{here && (
            <>
            <span
            className="enlarge-contract"
            style={{
              height: "8px",
              width: "8px",
              marginBottom: "2px",
              backgroundColor: "red",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>&nbsp;&nbsp;
          </>
          )}DISCHARGE</b>
          </h4>
          <h6 className="vertical-timeline-element-subtitle">
            {`Ward ${admission.ward}`}
          </h6>
          <p style={{ fontSize: "15px" }}>
            <b>Date/Time:</b> {dischargeDate}
          </p>
        </VerticalTimelineElement>
      );
    }
  };

  //END OF ADMISSION TIMELINE

  const getApptData = useCallback(async () => {
    try {
      getAppointmentToday();
    } catch (error) {
      console.log(error);
    }
  }, []);

  function isFunction(functionToCheck: any) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]"
    );
  }

  function debounce(func: any, wait: any) {
    var timeout: any;
    var waitFunc;

    return () => {
      if (isFunction(wait)) {
        waitFunc = wait;
      } else {
        waitFunc = function () {
          return wait;
        };
      }

      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, waitFunc());
    };
  }

  // reconnectFrequencySeconds doubles every retry
  var reconnectFrequencySeconds = 1;
  var eventSource: EventSource;

  var reconnectFunc = debounce(
    function () {
      setupSSEListener();
      // Double every attempt to avoid overwhelming server
      reconnectFrequencySeconds *= 2;
      // Max out at ~1 minute as a compromise between user experience and server load
      if (reconnectFrequencySeconds >= 64) {
        reconnectFrequencySeconds = 64;
      }
    },
    function () {
      return reconnectFrequencySeconds * 1000;
    }
  );

  const setupSSEListener = () => {
    eventSource = new EventSource(`${REST_ENDPOINT}/appointment/sse`);

    eventSource.onmessage = (event) => {
      // Handle the SSE update from the server
      if (
        event.data === "arrive" ||
        event.data === "swimlane" ||
        event.data === "dispensary" ||
        event.data === "assign"
      ) {
        getAppointmentToday();
        getAdmissionToday();
      }
    };

    eventSource.onopen = function (e) {
      // Reset reconnect frequency upon successful connection
      reconnectFrequencySeconds = 1;
    };

    eventSource.onerror = (error) => {
      // Handle errors, e.g., connection lost
      console.error("SSE Error:", error);
      eventSource.close();
      reconnectFunc();
    };
  };

  useEffect(() => {
    const getPatientDetails = async () => {
      try {
        const response = await patientApi.getAllPatients();
        const patients = response.data;
        const currPatient = patients.filter(
          (patient: any) => patient.username === storedUsername
        )[0];
        console.log(currPatient);
        setPatient(currPatient);
      } catch (error) {
        console.log(error);
      }
    };
    if (!patient) {
      getPatientDetails();
    } else {
      getAppointmentToday();
      getAdmissionToday();
      setupSSEListener();
    }
  }, [patient, getApptData]);

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  function confirm() {
    modal.current?.dismiss(input.current?.value, "confirm");
  }

  const handleGetPatientRequests = async () => {
    const response = await patientRequestApi.getPatientRequests(storedUsername);

    console.log(response.data);

    const updatedRequests = response.data.map(
      (request: any) => request.patientRequestEnum
    );

    setRequestCount(updatedRequests.length);

    const updatedSelectedCards = { ...selectedCards };

    // Iterate through the keys of the object
    for (const key in updatedSelectedCards) {
      // Check if the key is in the array
      if (updatedRequests.includes(key)) {
        // If it is, set the value to false
        updatedSelectedCards[key] = true;
      } else {
        // If it's not, set the value to true
        updatedSelectedCards[key] = false;
      }
    }

    setSelectedCards(updatedSelectedCards);
  };

  const onClickRequest = async (request: string) => {
    if (selectedCards[request]) {
      await patientRequestApi.deletePatientRequest(request, storedUsername);
      setRequestCount((requestCount) => requestCount - 1);
    } else {
      await patientRequestApi.createPatientRequest(request, storedUsername);
      setRequestCount((requestCount) => requestCount + 1);
    }

    setSelectedCards((prevSelectedCards: any) => ({
      ...prevSelectedCards,
      [request]: !prevSelectedCards[request],
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="end" className="ion-margin-end">
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
            </IonButton>
          </IonButtons> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IonImg
              src={heartLogo}
              style={{ width: "150px", height: "80px" }}
            ></IonImg>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <b style={{ fontSize: "20px" }}>
          Hi {patient?.firstName + " " + patient?.lastName}, welcome!{" "}
        </b>
        <p>
          You have{" "}
          {currAppointments?.length === 0 && !currAdmission && "nothing on "}
          {currAppointments?.length > 0 &&
            `${currAppointments.length} appointment(s) `}
          {currAppointments?.length > 0 && currAdmission && "and "}
          {currAdmission && `1 admission `}
          today.
        </p>
        {currAdmission && currAdmission.arrived && (
          <>
            <IonButton
              id="open-modal"
              expand="block"
              onClick={handleGetPatientRequests}
            >
              Make a Request
            </IonButton>

            <IonModal ref={modal} trigger="open-modal">
              <IonHeader>
                <IonToolbar>
                  <IonTitle slot="start">Patient Requests</IonTitle>
                  <IonButtons slot="end">
                    <IonButton
                      strong={true}
                      onClick={() => modal.current?.dismiss()}
                    >
                      Close
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonText>
                  <h4>
                    {requestCount === 0
                      ? "You currently have 0 request! Click the cards below to make a request."
                      : `You currently have ${requestCount} requests! A nurse will attend to you shortly.`}
                  </h4>
                </IonText>
                <IonRow>
                  <IonCol size="4">
                    <IonCard
                      onClick={() => onClickRequest("WATER")}
                      className={selectedCards["WATER"] ? "selected-card" : ""}
                    >
                      <IonCardHeader className="ion-align-items-center">
                        <IonIcon src={waterIcon} style={{ fontSize: "64px" }} />
                        <IonCardSubtitle className="ion-text-center">
                          I want some water
                        </IonCardSubtitle>
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                  <IonCol size="4">
                    <IonCard
                      onClick={() => onClickRequest("TOILET")}
                      className={selectedCards["TOILET"] ? "selected-card" : ""}
                    >
                      <IonCardHeader className="ion-align-items-center">
                        <IonIcon
                          src={toiletIcon}
                          style={{ fontSize: "64px" }}
                        />
                        <IonCardSubtitle className="ion-text-center">
                          I want to use the toilet
                        </IonCardSubtitle>
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                  <IonCol size="4">
                    <IonCard
                      onClick={() => onClickRequest("BATH")}
                      className={selectedCards["BATH"] ? "selected-card" : ""}
                    >
                      <IonCardHeader className="ion-align-items-center">
                        <IonIcon
                          src={showerIcon}
                          style={{ fontSize: "64px" }}
                        />
                        <IonCardSubtitle className="ion-text-center">
                          I want to take a bath
                        </IonCardSubtitle>
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonContent>
            </IonModal>
          </>
        )}
        <IonAccordionGroup expand="inset">
          {currAppointments.map((appointment, index) => (
            <IonAccordion value={appointment.appointmentId.toString()}>
              <IonItem slot="header" color="light">
                <IonLabel>Appointment {index + 1}</IonLabel>
              </IonItem>
              <div slot="content">
                <VerticalTimeline
                  lineColor={getColor(appointment.swimlaneStatusEnum)}
                >
                  {appointment.swimlaneStatusEnum === "CONSULTATION" ? (
                    // Triage -> Consultation
                    <>
                      {showTimelineCard(
                        appointment,
                        "REGISTRATION",
                        "Yes",
                        false
                      )}
                      {showTimelineCard(appointment, "TRIAGE", "Yes", false)}
                      {showTimelineCard(
                        appointment,
                        "CONSULTATION",
                        appointment.listOfStaffsId.length > 3 ||
                          appointment.arrived
                          ? "Yes"
                          : "No",
                        appointment.listOfStaffsId.length === 3 ? true : false
                      )}

                      {/* Consultation -> Treatment -> Consultation */}
                      {appointment.listOfStaffsId.length > 3 ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "TREATMENT",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      ) : null}
                    </>
                  ) : appointment.swimlaneStatusEnum === "TRIAGE" ? (
                    <>
                      {showTimelineCard(
                        appointment,
                        "REGISTRATION",
                        "Yes",
                        false
                      )}
                      {showTimelineCard(
                        appointment,
                        "TRIAGE",
                        appointment.arrived ? "Yes" : "No",
                        true
                      )}
                    </>
                  ) : appointment.swimlaneStatusEnum === "REGISTRATION" ? (
                    <>
                      {showTimelineCard(
                        appointment,
                        "REGISTRATION",
                        appointment.arrived ? "Yes" : "No",
                        true
                      )}
                    </>
                  ) : appointment.swimlaneStatusEnum === "TREATMENT" ? (
                    <>
                      {showTimelineCard(
                        appointment,
                        "REGISTRATION",
                        "Yes",
                        false
                      )}
                      {showTimelineCard(appointment, "TRIAGE", "Yes", false)}
                      {showTimelineCard(
                        appointment,
                        "CONSULTATION",
                        "Yes",
                        false
                      )}
                      {showTimelineCard(
                        appointment,
                        "TREATMENT",
                        appointment.arrived ? "Yes" : "No",
                        true
                      )}
                    </>
                  ) : appointment.swimlaneStatusEnum === "PHARMACY" ? (
                    <>
                      {/* // Consultation -> Pharmacy */}
                      {appointment.listOfStaffsId.length === 3 || (appointment.listOfStaffsId.length === 4 && appointment.currentAssignedStaffId != null)? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "PHARMACY",
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      ) : // Consultation -> Treatment -> Consultation -> Pharmacy
                      appointment.listOfStaffsId.length >= 4 ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TREATMENT",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "PHARMACY",
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      ) : (
                        // From Pharmacy directly
                        <>
                          {showTimelineCard(
                            appointment,
                            "PHARMACY",
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      )}
                    </>
                  ) : appointment.swimlaneStatusEnum === "DISCHARGE" ||
                    appointment.swimlaneStatusEnum === "DONE" ? (
                    <>
                      {/* Consultation -> Discharge */}
                      {getNumberOfRoles(appointment.listOfStaffsId).length ===
                        3 && !hasAdmission ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "DISCHARGE",
                            appointment.arrived ? "Yes" : "No",
                            appointment.swimlaneStatusEnum === "DISCHARGE"
                          )}
                        </>
                      ) : // Consultation -> Admission -> Discharge
                      getNumberOfRoles(appointment.listOfStaffsId).length ===
                          3 && hasAdmission ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "ADMISSION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "DISCHARGE",
                            appointment.arrived ? "Yes" : "No",
                            appointment.swimlaneStatusEnum === "DISCHARGE"
                          )}
                        </>
                      ) : // Consultation -> Pharmacy -> Discharge
                      getNumberOfRoles(appointment.listOfStaffsId).includes(
                          "PHARMACIST"
                        ) &&
                        getNumberOfRoles(appointment.listOfStaffsId).length ===
                          4 ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "PHARMACY",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "DISCHARGE",
                            appointment.arrived ? "Yes" : "No",
                            appointment.swimlaneStatusEnum === "DISCHARGE"
                          )}
                        </>
                      ) : // Consultation -> Treatment -> Consultation -> Pharmacy -> Discharge
                      getNumberOfRoles(appointment.listOfStaffsId).includes(
                          "PHARMACIST"
                        ) &&
                        getNumberOfRoles(appointment.listOfStaffsId).length >
                          4 ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TREATMENT",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "PHARMACY",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "DISCHARGE",
                            appointment.arrived ? "Yes" : "No",
                            appointment.swimlaneStatusEnum === "DISCHARGE"
                          )}
                        </>
                      ) : (
                        // Pharmacy -> Discharge
                        <>
                          {showTimelineCard(
                            appointment,
                            "PHARMACY",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "DISCHARGE",
                            appointment.arrived ? "Yes" : "No",
                            appointment.swimlaneStatusEnum === "DISCHARGE"
                          )}
                        </>
                      )}
                      {appointment.swimlaneStatusEnum === "DONE"
                        ? showDoneCard(appointment)
                        : null}
                    </>
                  ) : appointment.swimlaneStatusEnum === "ADMISSION" ? (
                    <>
                      {appointment.listOfStaffsId.length === 3 ? (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "ADMISSION",
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      ) : (
                        <>
                          {showTimelineCard(
                            appointment,
                            "REGISTRATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "TREATMENT",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "ADMISSION",
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      )}
                    </>
                  ) : null}
                </VerticalTimeline>
              </div>
            </IonAccordion>
          ))}

          {currAdmission && (
            <IonAccordion value="two">
              <IonItem slot="header" color="light">
                <IonLabel>Admission</IonLabel>
              </IonItem>
              <div slot="content">
                <VerticalTimeline lineColor={getColor("REGISTRATION")}>
                  <>
                    {showAdmissionEventCard(currAdmission)}

                    {orders.map((order) => {
                      const orderString = order.format("YYYY-MM-DD HH:mm:ss");
                      const orderDetails = orderMap[orderString];

                      // debugging
                      // console.log(orderDetails);
                      // if (!orderDetails) {
                      //   console.log(
                      //     "Order details not found for:",
                      //     orderString
                      //   );
                      // }

                      if (Array.isArray(orderDetails)) {
                        //console.log(currAdmission);
                        return showMedicationOrderEvent(
                          currAdmission,
                          orderDetails,
                          order
                        );
                      } else {
                        return showInpatientTreatmentEvent(
                          currAdmission,
                          orderDetails,
                          order
                        );
                      }
                    })}

                    {showAdmissionDoneCard(currAdmission)}
                  </>
                </VerticalTimeline>
              </div>
            </IonAccordion>
          )}
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Home;
