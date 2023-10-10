import React, { useEffect } from "react";
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
import Navbar from "../nav/index";
import { personCircle } from "ionicons/icons";
import { patientApi } from "../../api/Api";

type Props = {};

const Home = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Patient journey</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color="primary">Patient journey</IonText>
      </IonContent>
      <Navbar />
    </IonPage>
  );
};

export default Home;
