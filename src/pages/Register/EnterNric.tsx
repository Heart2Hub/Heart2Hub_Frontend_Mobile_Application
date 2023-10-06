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
import React, { useEffect, useState } from "react";
import { SubmitHandler, set, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { patientApi } from "../../api/Api";
import { ErrorMessage } from "@hookform/error-message";
import "./styles.css";

type FormValues = {
  nric: string;
};

const EnterNric: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<FormValues>({ defaultValues: { nric: "" } });

  const history = useHistory();
  console.log(localStorage);

  const doValidateNric = async (data: any) => {
    const nric = data.nric;
    try {
      //No existing EHR but existing NEHR
      await patientApi.validateNric(nric);
      localStorage.setItem("nric", nric);

      history.push("/register/create-patient-account");
    } catch (error: any) {
      //1. Existing EHR associated with NRIC
      //2. No existing EHR and No existing NEHR
      if (
        error.response.data ===
        "Error Encountered: NEHR Record is not found. Please provide NEHR details."
      ) {
        localStorage.setItem("nric", nric);

        history.push("/register/create-ehr");
      } else {
        const cleanedError = error.response.data.replace(
          /^Error Encountered:\s*/,
          ""
        );
        setError("nric", {
          type: "manual",
          message: cleanedError,
        });
      }
    }
  };

  const onSubmit = handleSubmit((data) => doValidateNric(data));

  useEffect(() => reset(), [isSubmitSuccessful]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Enter NRIC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h5>
          Our system checks if you have an existing NEHR. Otherwise, you will be
          required to create a new EHR in the following step.
        </h5>

        <form onSubmit={onSubmit}>
          <IonInput
            className="ion-margin-top"
            type="text"
            fill="solid"
            label="NRIC"
            labelPlacement="floating"
            {...register("nric", {
              required: {
                value: true,
                message: "NRIC required",
              },
              minLength: {
                value: 9,
                message: "NRIC too short",
              },
              maxLength: {
                value: 9,
                message: "NRIC too long",
              },
              pattern: {
                value: /^[STFG]\d{7}[A-Z]$/,
                message: "Invalid NRIC",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="nric"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonButton type="submit" className="ion-margin-top">
            NEXT
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default EnterNric;
