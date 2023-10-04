import React from "react";
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
} from "@ionic/react";
import Navbar from "../navbar/index";
import { personCircle, logOut, repeat } from "ionicons/icons";
import { Route, Redirect, useHistory } from "react-router";

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

const Settings = () => {
  const history = useHistory();

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
