import {
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Redirect, Route } from "react-router";
import Register1 from "./Register1";
import Register2 from "./Register2";

const Register: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route exact path="/register/step-1">
        <Register1 />
      </Route>
      <Route exact path="/register/step-2">
        <Register2 />
      </Route>
    </IonRouterOutlet>
  );
};

export default Register;
