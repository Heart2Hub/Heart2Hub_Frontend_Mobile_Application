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
} from "@ionic/react";
import React from "react";
import heartLogo from "../assets/heartLogo.png";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonImg
          src={heartLogo}
          alt="The Wisconsin State Capitol building in Madison, WI at night"
        ></IonImg>
        <IonInput
          label="Username"
          labelPlacement="floating"
          fill="solid"
          placeholder="Enter text"
        ></IonInput>
        <IonInput
          className="ion-margin-top"
          label="Password"
          labelPlacement="floating"
          fill="solid"
          placeholder="Enter text"
        ></IonInput>
        <br />
        <IonButton expand="block" size="large">
          Login
        </IonButton>
        <IonButton
          expand="block"
          size="large"
          routerLink="/register/enter-nric"
        >
          Create Account
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
