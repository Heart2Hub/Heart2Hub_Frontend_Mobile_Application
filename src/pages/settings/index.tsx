import React from 'react'
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
import Navbar from '../navbar/index';
import { personCircle, logOut } from 'ionicons/icons';
import { Route, Redirect, useHistory } from 'react-router';

type Props = {}

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

    const handleClick = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("storage"));
        history.push('/')
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
          <IonContent className="ion-padding">
            {/* <IonText color="danger">settings</IonText> */}
            <IonItem>
                <IonIcon aria-hidden="true" icon={personCircle} slot="start"></IonIcon>
                <IonLabel>
                Profile
                </IonLabel>
            </IonItem>
            <IonItem button onClick={handleClick}>
            <IonIcon aria-hidden="true" icon={logOut} slot="start"></IonIcon>
                <IonLabel>
                Logout
                </IonLabel>
            </IonItem>


          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default Settings;