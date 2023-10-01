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
    IonBackButton,
    IonButtons,
    IonList,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonThumbnail,
  } from "@ionic/react";
import Navbar from '../navbar/index';
import { personCircle, logOut, repeat, checkmarkCircleOutline } from 'ionicons/icons';
import { Route, Redirect, useHistory, useParams, useLocation } from 'react-router';
import { departmentApi } from '../../api/Api';
import dayjs from 'dayjs';
import heartLogo from "../../assets/heartLogo.png";

type Props = {}

interface Appointment {
  appointmentId: number,
  description: string,
  comments: string,
  actualDateTime: string[],
  department: string,
  currentAssignedStaffId: number,
  message: string,
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
const ViewAppointment = () => {

    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation<Appointment>();

    const getDateTime = (dateTime: string[]) => {
      const d = dayjs()
      .year(Number(dateTime[0]))
      .month(Number(dateTime[1])-1)
      .date(Number(dateTime[2]))
      .hour(Number(dateTime[3]))
      .minute(Number(dateTime[4]))
      return dayjs(d).format('DD/MM/YYYY HH:mm')
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                      <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>View Appointment</IonTitle>
                </IonToolbar>
            </IonHeader>
          <IonContent className="ion-padding">
          
           <IonText style={{ fontSize: "20px"}}><b>{state?.message}</b></IonText><br/>
           <IonText>Appointment ID: {state?.appointmentId}</IonText><br/><br/>
           <IonImg
            src={heartLogo}
            alt="Heart2Hub"
          ></IonImg>
           {state && state.actualDateTime && <>
           <IonText style={{ fontSize: "16px"}}><b>Date: </b>{getDateTime(state?.actualDateTime).split(' ')[0]}</IonText><br/>
           <IonText style={{ fontSize: "16px"}}><b>Time: </b>{getDateTime(state?.actualDateTime).split(' ')[1]}</IonText></>}<br/><br/>
           <IonText style={{ fontSize: "18px"}}><b>{state?.department}</b></IonText><br/>
           <IonText style={{ fontSize: "16px"}}><b>Arrived: </b>{state?.arrived ? "Yes" : "No"}</IonText><br/><br/>
           <IonText style={{ fontSize: "16px"}}>Notes: {state?.description ? state?.description : '-'}</IonText><br/><br/>
           <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Pre-appointment instructions</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent style={{ fontSize: "14px"}}>
              <li>
              Ensure you bring along your insurance card, ID, referral, and any other required documents ready for your appointment.
              </li>
              <li>
              Ensure you have 7 hours of uninterrupted rest before your appointment.
              </li>
            </IonCardContent>
          </IonCard>
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default ViewAppointment;