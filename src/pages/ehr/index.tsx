import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import Navbar from "../navbar/index";
import { useHistory } from "react-router";

const EHR: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Electronic Health Record</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard onClick={() => history.push("/ehr/general-information")}>
          <IonCardContent>General information</IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>Next of Kin</IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>Prescriptions</IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>Problems</IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>Medical History</IonCardContent>
        </IonCard>
      </IonContent>
      <Navbar />
    </IonPage>
  );
};

export default EHR;
