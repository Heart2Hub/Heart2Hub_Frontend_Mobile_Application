import React, { useEffect, useState, useCallback } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonImg,
  IonButton,
  IonFooter,
  IonText,
  IonLabel,
  IonItem,
  IonIcon,
  IonButtons,
  IonThumbnail,
} from "@ionic/react";
import { patientApi, appointmentApi, staffApi } from "../../api/Api";
import { personCircle, logOut, repeat, arrowForward } from "ionicons/icons";
import { useHistory } from "react-router";
import heartLogo from "../../assets/heartLogo.png";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import dayjs from "dayjs";

type Patient = {
  patientId: number,
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

type Staff = {
  staffId: number,
  firstname: string;
  lastname: string;
  staffRoleEnum: string;
  location: string,
  name: string
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
  const date = dayjs();

  const getAppointmentToday = async () => {
    try {
      const response = await appointmentApi.viewAllAppointmentsByDay(date.format('YYYY-MM-DD') + "T00:00:00");
      const appts = response.data.filter((appointment: any) => appointment.nric === patient?.nric);
      getAllStaff(appts[0].departmentName)
      setCurrAppointments(appts);
    } catch (error) {
      console.log(error);
    }
  }

  const getColor = (tab: string) => {
    if (tab === "REGISTRATION") {
      return "#666666";
    } else if (tab === "TRIAGE") {
      return "#ff85ff"
    } else if (tab === "CONSULTATION") {
      return "#2ecc71"
    } else if (tab === "TREATMENT") {
      return "#f1c40f"
    } else if (tab === "PHARMACY") {
      return "#9b59b6"
    } else if (tab === "ADMISSION") {
      return "#e67e22"
    } else {
      return "#34495e"
    }
  }

  const getStaff = (id: number) => {
    for (let i=0; i<staffs.length; i++) {
      if (staffs[i].staffId === id) {
        return staffs[i].firstname + " " + staffs[i].lastname;
      }
    }
    return "NA"
  }

  const getStaffLocation = (id: number) => {
    for (let i=0; i<staffs.length; i++) {
      if (staffs[i].staffId === id) {
        return staffs[i].location + ", " + staffs[i].name
      }
    }
    return "NA"
  }

  const getStaffRole = (id: number) => {
    for (let i=0; i<staffs.length; i++) {
      if (staffs[i].staffId === id) {
        return staffs[i].staffRoleEnum;
      }
    }
    return "NA"
  }

  const getDateTime = (arr: number[]) => {
    const year = arr[0];
    const month = arr[1];
    const day = arr[2];
    const time = arr[3];
    let m = "pm";
    if (time >= 8 && time <= 12) m = "am";
    return day + "/" + month + "/" + year + " " + time + ":00" + m;
  }

  const getAllStaff = async (unit: string) => {
    try {
      const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(unit);
      setStaffs(response.data);
    } catch(error) {
      console.log(error);
    }
  }

  const showTimelineCard = (appointment: any, swimlane: string, index: number, arrived: string) => {
    return (
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentStyle={{ background: getColor(swimlane), color: '#fff' }}
        contentArrowStyle={{ borderRight: `7px solid  ${getColor(swimlane)}` }}
        date={`Staff: ${getStaffRole(appointment.listOfStaffsId[appointment.listOfStaffsId?.length-index])} ` + getStaff(appointment.listOfStaffsId[appointment.listOfStaffsId?.length-index])}
        iconStyle={{ background: getColor(swimlane), color: '#fff' }}
      >
        <h3 className="vertical-timeline-element-title"><b>{swimlane}</b></h3>
        <h5 className="vertical-timeline-element-subtitle">{appointment.departmentName}</h5>
        <p style={{ fontSize: "15px"}}>
          {swimlane === "REGISTRATION" && <><b>Date/Time:</b> {getDateTime(appointment.bookedDateTime)}<br/></>}
          <b>Location:</b> {getStaffLocation(appointment.listOfStaffsId[appointment.listOfStaffsId?.length-index])}<br/>
          <b>Arrived:</b> {arrived}
        </p>
        
      </VerticalTimelineElement>
    )
  }

  const getApptData = useCallback(async () => {
      try {
        getAppointmentToday();
      } catch (error) {
        console.log(error)
      }
    }, []
  )
  

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
    if (!patient) getPatientDetails()
    else {
      getAppointmentToday();
      const interval = setInterval(() => {
        getApptData()
      }, 5000);
      return () => clearInterval(interval)
    }
  }, [patient, getApptData]);

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
        {currAppointments?.length > 0 ? 
        <>
          <p>You have {currAppointments.length} {currAppointments.length === 1 ? " appointment " : " appointments "} today:</p>
          {currAppointments.map(appointment => 
          <VerticalTimeline lineColor={getColor(appointment.swimlaneStatusEnum)}>
            {appointment.swimlaneStatusEnum === "CONSULTATION" ?

            // Triage -> Consultation
            <>
              {showTimelineCard(appointment, "REGISTRATION", 1, "Yes")}
              {showTimelineCard(appointment, "TRIAGE", 2, "Yes")}
              {showTimelineCard(appointment, "CONSULTATION", appointment.listOfStaffsId.length, appointment.listOfStaffsId.length > 3 || appointment.arrived ? "Yes" : "No")}

              {/* Consultation -> Treatment -> Consultation */}
              {appointment.listOfStaffsId.length > 3 ? 
              <>
              {showTimelineCard(appointment, "TREATMENT", 4, "Yes")}
              {showTimelineCard(appointment, "CONSULTATION", 3, appointment.arrived ? "Yes" : "No")}
              </> : null}
            </> : 
            
            appointment.swimlaneStatusEnum === "TRIAGE" ?
            <>
              {showTimelineCard(appointment, "REGISTRATION", 1, "Yes")}
              {showTimelineCard(appointment, "TRIAGE", 2, appointment.arrived ? "Yes" : "No")}
            </> : 
            
            appointment.swimlaneStatusEnum === "REGISTRATION" ?
            <>
              {showTimelineCard(appointment, "REGISTRATION", 1, appointment.arrived ? "Yes" : "No")}
            </> :
            
            appointment.swimlaneStatusEnum === "TREATMENT" ?
            <>
              {showTimelineCard(appointment, "REGISTRATION", 1, "Yes")}
              {showTimelineCard(appointment, "TRIAGE", 2, "Yes")}
              {showTimelineCard(appointment, "CONSULTATION", 3, "Yes")}
              {showTimelineCard(appointment, "TREATMENT", 4, appointment.arrived ? "Yes" : "No")}
            </> : 
            
            appointment.swimlaneStatusEnum === "PHARMACY" ?
              <>
                {/* // Consultation -> Pharmacy */}
                {appointment.listOfStaffsId.length === 3 ?
                <>
                
                </> :
                // Consultation -> Treatment -> Consultation -> Pharmacy
                appointment.listOfStaffsId.length === 4 ?
                <>
                </> : <></>}
              </> : null}
          </VerticalTimeline>)}
        </>:
        <p>You have nothing on today &#x1F604;</p>}
      </IonContent>
    </IonPage>
  );
};

export default Home;

