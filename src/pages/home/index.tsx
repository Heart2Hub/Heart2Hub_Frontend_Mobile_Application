import React, { useEffect } from 'react'
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
  } from "@ionic/react";
import Navbar from '../navbar/index';
import { personCircle } from 'ionicons/icons';
import { patientApi } from '../../api/Api';

type Props = {}

const Home = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
          <IonContent className="ion-padding">
            <IonText color="primary" style={{ fontSize: "1.7rem", fontWeight: "600"}}>Welcome, {localStorage.getItem('username')}!</IonText>
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default Home;