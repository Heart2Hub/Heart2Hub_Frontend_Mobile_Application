import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import React from "react";
import { useHistory, useLocation } from "react-router";

const Confirmation: React.FC = () => {
  const history = useHistory();

  const confirm = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Success!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h5>
          Your Heart2Hub Patient Account has been created. Please head back to
          the login page.
        </h5>
        <IonButton onClick={confirm}>Back to Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Confirmation;
