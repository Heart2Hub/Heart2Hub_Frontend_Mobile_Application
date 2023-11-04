import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";

const Services: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Services</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid fixed={true}>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => history.push("/tabs/services/appointments")}
              >
                Appointments
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton onClick={() => history.push("/tabs/services/finance")}>
                Finance
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Services;
