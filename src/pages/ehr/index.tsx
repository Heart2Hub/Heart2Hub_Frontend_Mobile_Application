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
        <IonCard onClick={() => history.push("/tabs/ehr/general-information")}>
          <IonCardContent>General information</IonCardContent>
        </IonCard>
        <IonCard onClick={() => history.push("/tabs/ehr/next-of-kin")}>
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
    </IonPage>
  );
};

export default EHR;
