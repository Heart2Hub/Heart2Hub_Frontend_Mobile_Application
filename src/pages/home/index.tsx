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
  IonButtons,
} from "@ionic/react";
import { personCircle, settings } from "ionicons/icons";
import { patientApi } from "../../api/Api";
import { useHistory } from "react-router";

type Props = {};

const Home = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText
          color="primary"
          style={{ fontSize: "1.7rem", fontWeight: "600" }}
        >
          Welcome, {localStorage.getItem("username")}!
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
