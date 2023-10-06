import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonText,
} from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { patientApi } from "../../api/Api";
import { ErrorMessage } from "@hookform/error-message";
import "./styles.css";

type FormValues = {
  username: string;
  password: string;
};

const CreatePatientAccount: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const history = useHistory();
  // const storedEhr = localStorage.getItem("ehr");
  // if (storedEhr !== null) {
  //   console.log(JSON.parse(storedEhr));
  // }

  const onSubmit = handleSubmit(async (data) => {
    //console.log(data);
    try {
      const storedEhr = localStorage.getItem("ehr");
      if (storedEhr) {
        const requestBody = {
          newPatient: data,
          newElectronicHealthRecord: JSON.parse(storedEhr),
        };
        await patientApi.createPatientWithoutNehr(requestBody);
      } else {
        const nric = localStorage.getItem("nric");
        if (nric) {
          await patientApi.createPatientWithNehr(data, nric);
        }
      }
      history.push("/register/confirmation");
    } catch (error: any) {
      const cleanedError = error.response.data.replace(
        /^Error Encountered:\s*/,
        ""
      );
      setError("username", {
        type: "manual",
        message: cleanedError,
      });
    }
  });

  useEffect(() => reset, [isSubmitSuccessful]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Patient Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h5>Enter a username and password to create your patient account.</h5>
        <form onSubmit={onSubmit}>
          <IonInput
            className="ion-margin-top"
            type="text"
            fill="solid"
            label="Username"
            labelPlacement="floating"
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
          />
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonInput
            className="ion-margin-top"
            type="password"
            fill="solid"
            label="Password"
            labelPlacement="floating"
            {...register("password", {
              required: {
                value: true,
                message: "Password required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonButton type="submit" className="ion-margin-top">
            Create Account
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default CreatePatientAccount;
