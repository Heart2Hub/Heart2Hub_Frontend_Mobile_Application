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
} from "@ionic/react";
import React, { useState } from "react";
import heartLogo from "../assets/heartLogo.png";
import { patientApi } from "../api/Api";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";

interface DecodedToken {
  sub: string; 
  exp: number; 
  iat: number; 
  roles: []
}

interface RegisterStep1 {
  username: string;
  password: string;
}

const Login: React.FC = () => {

  const [loginErrors, setLoginErrors] = useState();
  const { register, control, handleSubmit, formState: { errors }} = useForm<RegisterStep1>();
  const history = useHistory();

  const onSubmit = (data: RegisterStep1) => {
    loginPatient(data.username, data.password);
  };

  const loginPatient = async (username: string, password: string) => {
    try {
      const response = await patientApi.login(username, password);
      setLoginErrors(undefined);
      const decodedAccessToken: DecodedToken = jwt_decode(response.data);
      localStorage.setItem("accessToken", response.data);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", decodedAccessToken.sub);
      window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
      console.log(error);
      setLoginErrors(error.response.data);
    }
  };


  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonImg
          src={heartLogo}
          alt="Heart2Hub"
        ></IonImg>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
              <IonInput
                type="text"
                {...register("username", {
                  required: {
                    value: true,
                    message: "Username required",
                  },
                  minLength: {
                    value: 6,
                    message: "Username must be at least 6 characters",
                  },
                })}
              ></IonInput>
            </IonItem>
            {errors.username && (
              <IonText color="danger">{errors.username.message}</IonText>
            )}
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password required",
                },
                minLength: {
                  value: 8,
                  message: "Password must be at least 6 characters",
                },
              })}
            ></IonInput>
          </IonItem>
          <br/>
          {errors.password && (
            <IonText color="danger">{errors.password.message}</IonText>
          )}
        <br />
        {loginErrors && (
            <IonText color="danger">{loginErrors}</IonText>
          )}
        <IonButton expand="block" size="large" type="submit">
          Login
        </IonButton>
        </form>
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
