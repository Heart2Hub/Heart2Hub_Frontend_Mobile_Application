import React, { useEffect, useState } from "react";
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
import { electronicHealthRecordApi } from "../../api/Api";
import { useHistory } from "react-router";

type Props = {};

//TODO: create a 'models' folder with our diff entities
interface Ehr {
  firstName: string,
  lastName: string
}
const Home = () => {
  const history = useHistory();
  const [patient, setPatient] = useState<Ehr>();

  const getPatientDetails = async () => {
    try {
      const username = localStorage.getItem("username") ?? "";
      const response = await electronicHealthRecordApi.getElectronicHealthRecordByUsername(username);
      setPatient(response.data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPatientDetails();
  }, [])

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
          Welcome{patient ? ', ' + patient.firstName + ' ' + patient.lastName : null}!
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
