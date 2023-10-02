import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTab,
} from '@ionic/react';
import { home, settings, person, book } from 'ionicons/icons'; // Import Ionicons icons
import { Redirect, Route } from 'react-router-dom';

import Home from "../home/index";
import Settings from "../settings/index";

// const HomeTab: React.FC = () => (
//   <IonContent>
//     <h2>Home Tab Content</h2>
//   </IonContent>
// );

// const SettingsTab: React.FC = () => (
//   <IonContent>
//     <h2>Settings Tab Content</h2>
//   </IonContent>
// );

const ProfileTab: React.FC = () => (
  <IonContent>
    <h2>Profile Tab Content</h2>
  </IonContent>
);

const App: React.FC = () => (
    <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="patient-journey" href="/patient-journey">
            <IonIcon icon={person} />
            <IonLabel>Patient Journey</IonLabel>
        </IonTabButton>

        <IonTabButton tab="appointments" href="/appointments">
            <IonIcon icon={book} />
            <IonLabel>Appointments</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
        </IonTabButton>
        </IonTabBar>
);

export default App;
