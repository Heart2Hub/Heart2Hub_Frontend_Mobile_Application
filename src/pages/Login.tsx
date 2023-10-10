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
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import heartLogo from "../assets/heartLogo.png";
import { patientApi } from "../api/Api";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { App } from "@capacitor/app";

interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  roles: [];
}

interface RegisterStep1 {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginErrors, setLoginErrors] = useState<string>("");
  const [usernameErrors, setUsernameErrors] = useState<string>("");
  const [pwErrors, setPwErrors] = useState<string>("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStep1>();
  const history = useHistory();

  const onSubmit = (data: RegisterStep1) => {
    loginPatient(data.username, data.password);
  };

  const loginPatient = async (username: string, password: string) => {
    try {
      const response = await patientApi.login(username, password);
      setLoginErrors("");
      const decodedAccessToken: DecodedToken = jwt_decode(response.data);
      localStorage.setItem("accessToken", response.data);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", decodedAccessToken.sub);
      window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
      setLoginErrors(error.response.data);
    }
  };

  useEffect(() => {
    if (
      errors.username &&
      errors.username.message &&
      errors.username.message.length > 0
    ) {
      setUsernameErrors(errors.username.message);
    } else if (
      errors.password &&
      errors.password.message &&
      errors.password.message.length > 0
    ) {
      setPwErrors(errors.password.message);
    }

    const backButtonListener = App.addListener("backButton", () => {
      App.exitApp();
    });

    return () => {
      backButtonListener.remove();
    };
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonImg src={heartLogo} alt="Heart2Hub"></IonImg>
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
          <IonToast
            isOpen={usernameErrors.length > 0}
            message={usernameErrors}
            onDidDismiss={() => setUsernameErrors("")}
            color="danger"
            duration={5000}
          ></IonToast>
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
          <br />
          <IonToast
            isOpen={pwErrors.length > 0}
            message={pwErrors}
            onDidDismiss={() => setPwErrors("")}
            color="danger"
            duration={5000}
          ></IonToast>
          <br />
          <IonToast
            isOpen={loginErrors.length > 0}
            message={loginErrors}
            onDidDismiss={() => setLoginErrors("")}
            color="danger"
            duration={5000}
          ></IonToast>
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
