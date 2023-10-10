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
  IonThumbnail,
} from "@ionic/react";
import { notificationsOutline, personCircle, settings } from "ionicons/icons";
import { patientApi } from "../../api/Api";
import { useHistory } from "react-router";
import heartLogo from "../../assets/heartLogo.png";

type Patient = {
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

const Home = () => {
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
          {/* <IonButtons slot="end" className="ion-margin-end">
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
            </IonButton>
          </IonButtons> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IonImg
              src={heartLogo}
              style={{ width: "150px", height: "80px" }}
            ></IonImg>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <b style={{ fontSize: "20px" }}>
          Hi {patient?.firstName + " " + patient?.lastName}, welcome!{" "}
        </b>
        <p>You have nothing on today &#x1F604;</p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
