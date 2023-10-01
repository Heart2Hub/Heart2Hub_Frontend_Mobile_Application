import React, { useEffect, useState } from 'react'
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
  } from "@ionic/react";
import Navbar from '../navbar/index';
import { timerOutline } from 'ionicons/icons';
import { Route, Redirect, useHistory, useLocation } from 'react-router';
import { appointmentApi, patientApi, staffApi } from '../../api/Api';
import * as dayjs from 'dayjs'

type Props = {}

interface LocationState {
  successMessage?: string;
}

interface Appointment {
  appointmentId: number,
  description: string,
  comments: string,
  actualDateTime: string[],
  departmentName: string,
  currentAssignedStaffId: number,
  arrived: boolean,
  staffDetails: Staff
}

interface Staff {
  firstname: string,
  lastname: string,
  unit: {
    unitId: number,
    name: string
  }
}

const Appointments = () => {

    const history = useHistory();
    const location = useLocation();
    const { state } = useLocation<LocationState>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [appointments, setAppointments] = useState<Appointment[]>([])

    const handleClick = () => {
      history.push('/appointments/book-appointment')
    }

    const getAllAppointments = async () => {
      try {
        const username = localStorage.getItem('username') ?? '';
        const response = await appointmentApi.viewPatientAppointments(username);
        const a = response.data;
        for (let i=0; i<a.length; i++) {
          try {
            if (a[i].currentAssignedStaffId) {
              const response2 = await staffApi.getStaffById(a[i].currentAssignedStaffId);
              a[i].staffDetails = response2.data;
            }
          } catch (error) {
            console.log(error)
          } 
        }
        setAppointments(a);
      } catch (error) {
        console.log(error)
      }
    }

    const getDateTime = (dateTime: string[]) => {
      const d = dayjs()
      .year(Number(dateTime[0]))
      .month(Number(dateTime[1])-1)
      .date(Number(dateTime[2]))
      .hour(Number(dateTime[3]))
      .minute(Number(dateTime[4]))
      return dayjs(d).format('DD/MM/YYYY HH:mm')
    }

    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
      setTimeout(() => {
        // Any calls to load data go here
        event.detail.complete();
      }, 500);
    }

    const handleClickAppt = (appointment: Appointment) => {
      history.push(`/appointments/${appointment?.appointmentId}`, { appointmentId: appointment?.appointmentId, description: appointment?.description, actualDateTime: appointment?.actualDateTime, message: appointment.staffDetails ? `Appointment with Dr. ${appointment.staffDetails.firstname + " " + appointment.staffDetails.lastname}` : 'Appointment', department: appointment.departmentName, arrived: appointment.arrived })
    }

    useEffect(() => {
      if (state && state.successMessage) {
        setIsOpen(true);
      }
      // window.location.reload()

      getAllAppointments();
    }, [state])

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
          <IonButton expand="full" onClick={handleClick}>
            Make New Appointment
          </IonButton>
          {state && state.successMessage &&
            <IonToast 
              isOpen={isOpen}
              message={state.successMessage} 
              onDidDismiss={() => setIsOpen(false)}
              color="success"
              duration={5000}></IonToast>}
            {appointments.map((appointment) => 
            <IonCard onClick={() => handleClickAppt(appointment)}>
            <IonCardHeader>
              {appointment.staffDetails ? 
              <IonCardTitle style={{ fontSize: "20px"}}>Appointment with <br/>Dr. {appointment.staffDetails.firstname + " " + appointment.staffDetails.lastname}</IonCardTitle> :
              <IonCardTitle style={{ fontSize: "20px"}}>Appointment</IonCardTitle>}
            </IonCardHeader>
            <IonCardContent>
            <IonText style={{ fontSize: "16px"}}>{appointment.departmentName}</IonText>
              <IonList> 
                <IonItem>
                <IonIcon slot="start" icon={timerOutline} />
                  <IonLabel>{getDateTime(appointment.actualDateTime)}</IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
            )}
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default Appointments;