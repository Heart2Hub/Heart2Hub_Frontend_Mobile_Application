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
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonCard,
  IonCardContent,
  IonThumbnail,
} from "@ionic/react";
import Navbar from "../navbar/index";
import { personCircle, logOut, repeat } from "ionicons/icons";
import { Route, Redirect, useHistory } from "react-router";
import { patientApi } from "../../api/Api";
import { IMAGE_SERVER } from "../../constants/RestEndPoint";

type Props = {};

const ProfileTab: React.FC = () => (
  <IonContent>
    <h2>Profile Tab Content</h2>
  </IonContent>
);

const LogoutTab: React.FC = () => (
  <IonContent>
    <h2>Logout Tab Content</h2>
  </IonContent>
);

type Patient = {
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

const Settings = () => {
  const storedUsername = localStorage.getItem("username");
  const history = useHistory();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const getProfilePhoto = async () => {
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
    getProfilePhoto();
  }, []);

  const handleChangePassword = () => {
    history.push("/settings/change-password");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("storage"));
    history.replace("/");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard color="secondary">
          <IonCardContent>
            <IonItem lines="none" color="secondary">
              <IonThumbnail
                slot="start"
                style={{ width: "72px", height: "72px" }}
              >
                <img
                  src={IMAGE_SERVER + "/images/id/" + patient?.profilePicture}
                />
              </IonThumbnail>
              <IonLabel>{patient?.nric}</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
        <IonItem>
          <IonIcon
            aria-hidden="true"
            icon={personCircle}
            slot="start"
          ></IonIcon>
          <IonLabel>Profile</IonLabel>
        </IonItem>
        <IonItem onClick={handleChangePassword}>
          <IonIcon aria-hidden="true" icon={repeat} slot="start"></IonIcon>
          <IonLabel>Change password</IonLabel>
        </IonItem>
        <IonItem button onClick={handleLogout}>
          <IonIcon aria-hidden="true" icon={logOut} slot="start"></IonIcon>
          <IonLabel>Logout</IonLabel>
        </IonItem>
      </IonContent>
      <Navbar />
    </IonPage>
  );
};

export default Settings;
