import React, { useEffect, useState } from "react";
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
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
  IonThumbnail,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { timerOutline } from "ionicons/icons";
import { Route, Redirect, useHistory, useLocation } from "react-router";
import { appointmentApi, patientApi, staffApi } from "../../api/Api";
import dayjs from "dayjs";

type Props = {};

interface LocationState {
  successMessage?: string;
}

interface Appointment {
  appointmentId: number;
  description: string;
  comments: string;
  actualDateTime: string[];
  departmentName: string;
  currentAssignedStaffId: number;
  arrived: boolean;
  staffDetails: Staff;
}

interface Staff {
  firstname: string;
  lastname: string;
  unit: {
    unitId: number;
    name: string;
  };
}

const Appointments = () => {
  const history = useHistory();
  const { state } = useLocation<LocationState>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pastAppts, setPastAppts] = useState<Appointment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<"upcoming" | "past">(
    "upcoming"
  );

  const handleClick = () => {
    history.push("/tabs/appointments/select-department");
  };

  const getAllAppointments = async () => {
    try {
      const username = localStorage.getItem("username") ?? "";
      const response = await appointmentApi.viewPatientAppointments(username);
      const a = response.data;
      for (let i = 0; i < a.length; i++) {
        try {
          if (a[i].currentAssignedStaffId) {
            const response2 = await staffApi.getStaffById(
              a[i].currentAssignedStaffId
            );
            a[i].staffDetails = response2.data;
          }
        } catch (error) {
          console.log(error);
        }
      }
      a.sort(compareByActualDateTime);
      const pastAppts = a.filter((appointment: Appointment) =>
        isAppointmentPast(appointment)
      );
      const upcomingAppts = a.filter(
        (appointment: Appointment) => !isAppointmentPast(appointment)
      );
      setAppointments(upcomingAppts);
      setPastAppts(pastAppts);
    } catch (error) {
      console.log(error);
    }
  };

  const getDateTime = (dateTime: string[]) => {
    const d = dayjs()
      .year(Number(dateTime[0]))
      .month(Number(dateTime[1]) - 1)
      .date(Number(dateTime[2]))
      .hour(Number(dateTime[3]))
      .minute(Number(dateTime[4]));
    let day = dayjs(d).get("day");
    let strDay;
    switch (day) {
      case 0:
        strDay = "Monday";
        break;
      case 1:
        strDay = "Tuesday";
        break;
      case 2:
        strDay = "Wednesday";
        break;
      case 3:
        strDay = "Thursday";
        break;
      case 4:
        strDay = "Friday";
        break;
      case 5:
        strDay = "Saturday";
        break;
      case 6:
        strDay = "Sunday";
        break;
      default:
        strDay = "";
        break;
    }
    return strDay + ", " + dayjs(d).format("DD/MM/YYYY HH:mm");
  };

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      event.detail.complete();
    }, 500);
  }

  const handleClickAppt = (appointment: Appointment) => {
    history.push(`/tabs/appointments/view/${appointment?.appointmentId}`, {
      appointmentId: appointment?.appointmentId,
      description: appointment?.description,
      actualDateTime: appointment?.actualDateTime,
      staffDetails: appointment.staffDetails ? appointment.staffDetails : "",
      department: appointment.departmentName,
      arrived: appointment.arrived,
    });
  };

  function compareByActualDateTime(a: Appointment, b: Appointment): number {
    const aDT = a.actualDateTime;
    const bDT = b.actualDateTime;

    // Compare years first
    if (Number(aDT[0]) !== Number(bDT[0])) {
      return Number(aDT[0]) - Number(bDT[0]);
    }

    // Compare months
    if (Number(aDT[1]) !== Number(bDT[1])) {
      return Number(aDT[1]) - Number(bDT[1]);
    }

    // Compare days
    if (Number(aDT[2]) !== Number(bDT[2])) {
      return Number(aDT[2]) - Number(bDT[2]);
    }

    // Compare hours
    if (Number(aDT[3]) !== Number(bDT[3])) {
      return Number(aDT[3]) - Number(bDT[3]);
    }

    // Compare minutes
    return Number(aDT[4]) - Number(bDT[4]);
  }

  const isAppointmentPast = (appointment: Appointment) => {
    const dt = appointment.actualDateTime;
    const [year, month, day, hour, minute] = dt.map(Number);

    const targetDate = dayjs()
      .set("year", year)
      .set("month", month - 1)
      .set("day", day - 1)
      .set("hour", hour)
      .set("minute", minute);
    const currentDate = dayjs();
    if (currentDate.isAfter(targetDate)) {
      return true;
    }
    return false;
  };

  const handleSegmentChange = (event: CustomEvent) => {
    setSelectedSegment(event.detail.value);
  };

  useEffect(() => {
    // window.location.reload()
    getAllAppointments();
  }, [state]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Appointments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonButton expand="full" shape="round" onClick={handleClick}>
          Make New Appointment
        </IonButton>
        <br />
        <IonSegment
          color="secondary"
          value={selectedSegment}
          onIonChange={handleSegmentChange}
        >
          <IonSegmentButton value="upcoming">
            <IonLabel>Upcoming</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="past">
            <IonLabel>Past</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {selectedSegment === "upcoming" ? (
          <>
            {appointments.map((appointment) => (
              <IonCard
                onClick={() => handleClickAppt(appointment)}
                key={appointment.appointmentId}
                style={{ borderRadius: "15px" }}
              >
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: "20px" }}>
                    Appointment
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText style={{ fontSize: "16px" }}>
                    {appointment.departmentName}
                  </IonText>
                  <IonList>
                    <IonItem>
                      <IonIcon slot="start" icon={timerOutline} />
                      <IonLabel>
                        {getDateTime(appointment.actualDateTime).split(" ")[0] +
                          " " +
                          getDateTime(appointment.actualDateTime).split(" ")[1]}
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon slot="start" />
                      <IonLabel>
                        {getDateTime(appointment.actualDateTime).split(" ")[2]}
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            ))}{" "}
          </>
        ) : (
          <>
            {pastAppts.map((appointment) => (
              <IonCard
                onClick={() => handleClickAppt(appointment)}
                key={appointment.appointmentId}
              >
                <IonCardHeader>
                  {appointment.staffDetails ? (
                    <IonCardTitle style={{ fontSize: "20px" }}>
                      Appointment with <br />
                      Dr.{" "}
                      {appointment.staffDetails.firstname +
                        " " +
                        appointment.staffDetails.lastname}
                    </IonCardTitle>
                  ) : (
                    <IonCardTitle style={{ fontSize: "20px" }}>
                      Appointment
                    </IonCardTitle>
                  )}
                </IonCardHeader>
                <IonCardContent>
                  <IonText style={{ fontSize: "16px" }}>
                    {appointment.departmentName}
                  </IonText>
                  <IonList>
                    <IonItem>
                      <IonIcon slot="start" icon={timerOutline} />
                      <IonLabel>
                        {getDateTime(appointment.actualDateTime).split(" ")[0] +
                          " " +
                          getDateTime(appointment.actualDateTime).split(" ")[1]}
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon slot="start" />
                      <IonLabel>
                        {getDateTime(appointment.actualDateTime).split(" ")[2]}
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Appointments;
