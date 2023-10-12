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
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { useHistory } from "react-router";

type Props = {};

const Home = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Error</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText
          color="danger"
          style={{ fontSize: "1.3rem", fontWeight: "600" }}
        >
          You are logged out!
        </IonText>
        <br />
        <br />
        <IonButton onClick={() => history.push("/")}>
          Click here to login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
