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
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonItem,
  IonLabel,
} from "@ionic/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { WizardStore, RegisterStep1, FormValues } from "../store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username required")
    .min(6, "Username too short"),
  password: yup
    .string()
    .required("Password required")
    .min(8, "Password too short"),
});

const Register1: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: WizardStore.useState((s) => s),
  });

  const history = useHistory();

  const onSubmit: SubmitHandler<RegisterStep1> = (data) => {
    WizardStore.update((s) => {
      s.username = data.username as string;
      s.password = data.password as string;
    });
    history.push("/register/step-2");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step One</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
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
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.username && <span>{errors.username.message}</span>}
          </div>
          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="text"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password required",
                },
                minLength: {
                  value: 8,
                  message: "Username must be at least 8 characters",
                },
              })}
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <IonButton type="submit">NEXT</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register1;
