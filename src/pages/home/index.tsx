import React from 'react'
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
            <IonText color="danger">we r logged in</IonText>
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default Home;