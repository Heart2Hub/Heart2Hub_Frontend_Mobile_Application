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
      return "#e67e22"
    } else if (tab === "DISCHARGE") {
      return "#34495e"
    } else {
      return "#ffb700"
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
          (swimlane === "PHARMACY" &&
            getStaff(appointment.listOfStaffsId, swimlane)?.staffRoleEnum !==
              "PHARMACIST") ||
          (swimlane === "REGISTRATION" &&
            getStaff(appointment.listOfStaffsId, swimlane)?.staffRoleEnum !==
              "ADMIN") ||
          (swimlane === "DISCHARGE" &&
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
          <b>{swimlane}</b>
          {here && (
            <IonBadge
              style={{
                paddingTop: 7,
                fontSize: "7px",
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
          {swimlane !== "PHARMACY"
            ? getStaff(appointment.listOfStaffsId, swimlane)?.location +
              " " +
              getStaff(appointment.listOfStaffsId, swimlane)?.name
            : "Level 1 Entrance"}
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
        contentStyle={{ background: '#ffb700', color: '#000' }}
        contentArrowStyle={{ borderRight: `7px solid #ffb700` }}
        iconStyle={{ background: '#ffb700', color: '#000' }}
      >
        <h4 className="vertical-timeline-element-title" style={{ display: "flex", justifyContent: "space-between"}}>
          <b>DONE</b>
          <IonBadge style={{ paddingTop: 8, fontSize: '9px', backgroundColor: 'yellow', color: 'black'}}>
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
        </h4>
        <h6 className="vertical-timeline-element-subtitle">{appointment.departmentName}</h6>
        <p style={{ fontSize: "15px"}}>
          <b>You have been discharged successfully! Thank you for choosing Heart2Hub.</b>
        </p>
      </VerticalTimelineElement>)
  }

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
        setPatient(currPatient);
      } catch (error) {
        console.log(error);
      }
    };
    if (!patient) {
      getPatientDetails();
    } else {
      getAppointmentToday();
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
        {currAppointments?.length > 0 ? (
          <>
            <p>
              You have {currAppointments.length}{" "}
              {currAppointments.length === 1
                ? " appointment "
                : " appointments "}{" "}
              today:
            </p>
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
                          {showTimelineCard(
                            appointment,
                            "TRIAGE",
                            "Yes",
                            false
                          )}
                          {showTimelineCard(
                            appointment,
                            "CONSULTATION",
                            appointment.listOfStaffsId.length > 3 ||
                              appointment.arrived
                              ? "Yes"
                              : "No",
                            appointment.listOfStaffsId.length === 3
                              ? true
                              : false
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
                            appointment.arrived ? "Yes" : "No",
                            true
                          )}
                        </>
                      ) : appointment.swimlaneStatusEnum === "PHARMACY" ? (
                        <>
                          {/* // Consultation -> Pharmacy */}
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
                          {getNumberOfRoles(appointment.listOfStaffsId)
                            .length === 3 ? (
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
                                true
                              )}
                            </>
                          ) : // Consultation -> Pharmacy -> Discharge
                          getNumberOfRoles(appointment.listOfStaffsId).includes(
                              "PHARMACIST"
                            ) &&
                            getNumberOfRoles(appointment.listOfStaffsId)
                              .length === 4 ? (
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
                                true
                              )}
                            </>
                          ) : // Consultation -> Treatment -> Consultation -> Pharmacy -> Discharge
                          getNumberOfRoles(appointment.listOfStaffsId).includes(
                              "PHARMACIST"
                            ) &&
                            getNumberOfRoles(appointment.listOfStaffsId)
                              .length > 4 ? (
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
                                true
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
                                true
                              )}
                            </>
                          )}
                          {appointment.swimlaneStatusEnum === "DONE" ? 
                            showDoneCard(
                              appointment
                            ) : null
                        }
                        </>
                      ) : appointment.swimlaneStatusEnum === "ADMISSION" ?
                      <>
                        {appointment.listOfStaffsId.length === 3 ? 
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
                        </> : 
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
                        </>}
                      </> : null}
                    </VerticalTimeline>
                  </div>
                </IonAccordion>
              ))}
            </IonAccordionGroup>
          </>
        ) : (
          <p>You have nothing on today &#x1F604;</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
