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
  IonAvatar,
  IonList,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { personCircle, logOut, repeat, arrowForward } from "ionicons/icons";
import { Route, Redirect, useHistory } from "react-router";
import { patientApi, imageServerApi } from "../../api/Api";
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
  const [profilePicture, setProfilePicture] = useState<Blob>();

  function createBlobUrl(blob: Blob) {
    return URL.createObjectURL(blob);
  }

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

        console.log(currPatient);

        const formData = new FormData();
        formData.append("image", currPatient?.profilePicture);

        const imageResponse = await imageServerApi.getImageFromImageServer(
          "id",
          currPatient?.profilePicture
        );

        console.log(imageResponse.data);

        const imageBlob = new Blob([imageResponse.data], {
          type: imageResponse.headers["content-type"],
        });
        setProfilePicture(imageBlob);
      } catch (error) {
        console.log(error);
      }
    };
    getPatientDetails();
  }, []);

  const handleChangePassword = () => {
    history.push("/tabs/settings/change-password");
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
          <IonItem className="ion-padding" lines="none">
            <IonAvatar
              style={{ width: "80px", height: "80px" }}
              className="ion-margin-end"
            >
              <img
                alt="Silhouette of a person's head"
                src={profilePicture && URL.createObjectURL(profilePicture)}
              />
            </IonAvatar>
            <IonLabel>
              <b style={{ fontSize: "20px" }}>
                {patient?.firstName + " " + patient?.lastName}
              </b>
              <p style={{ fontSize: "16px" }}>{patient?.nric}</p>
            </IonLabel>
          </IonItem>

          {/* <IonTitle className="ion-text-center" style={{ height: "80px" }}>
            <b>Account & Settings</b>
          </IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" className="ion-padding">
        {/* <IonItem>
          <IonIcon
            aria-hidden="true"
            icon={personCircle}
            slot="start"
          ></IonIcon>
          <IonLabel>Profile</IonLabel>
        </IonItem> */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <b>Settings</b>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <IonList>
              <IonItem onClick={handleChangePassword}>
                <IonIcon
                  aria-hidden="true"
                  icon={repeat}
                  slot="start"
                ></IonIcon>
                <IonLabel>Change password</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
              <IonItem onClick={handleLogout} lines="none">
                <IonIcon
                  aria-hidden="true"
                  icon={logOut}
                  slot="start"
                ></IonIcon>
                <IonLabel>Logout</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
