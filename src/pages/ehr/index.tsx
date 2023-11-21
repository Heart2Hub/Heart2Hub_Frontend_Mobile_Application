import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { patientApi } from "../../api/Api";
import { IMAGE_SERVER } from "../../constants/RestEndPoint";
import { arrowForward, informationCircleOutline, people } from "ionicons/icons";

type Patient = {
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

const EHR: React.FC = () => {
  const storedUsername = localStorage.getItem("username") || "";
  const history = useHistory();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const getPatientDetails = async () => {
      try {
        const response = await patientApi.getAllPatients();
        const patients = response.data;
        const currPatient = patients.filter(
          (patient: any) => patient.username === storedUsername
        )[0];
        //console.log(currPatient);
        setPatient(currPatient);
      } catch (error) {
        console.log(error);
      }
    };
    getPatientDetails();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <b>My EHR</b>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonCard
            onClick={() => history.push("/tabs/ehr/general-information")}
          >
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>General Information</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard onClick={() => history.push("/tabs/ehr/next-of-kin")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>Next of Kin</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>Prescription</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard onClick={() => history.push("/tabs/ehr/problems")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>Problems</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard onClick={() => history.push("/tabs/ehr/medical-history")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>Medical History</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard onClick={() => history.push("/tabs/ehr/subsidies")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>Subsidies</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EHR;
