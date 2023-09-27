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
import { useState, useRef } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router";
import { RegisterStep2, FormValues, WizardStore } from "../store/store";
import "./Register2.css";

const Register2: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...WizardStore.useState((s) => s),
    },
  });

  const history = useHistory();

  const onSubmit: SubmitHandler<RegisterStep2> = (data: RegisterStep2) => {
    WizardStore.update((s) => {
      s.nric = data.nric as string;
    });
    history.push("/register/step-3");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Step Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="stacked">NRIC</IonLabel>
            <IonInput
              type="text"
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
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.nric && <span>{errors.nric.message}</span>}
          </div>
          {/* <IonItem>
            <IonLabel position="stacked">First Name</IonLabel>
            <IonInput
              type="text"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "First Name required",
                },
              })}
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.firstName && <span>{errors.firstName.message}</span>}
          </div>
          <IonItem>
            <IonLabel position="stacked">Last Name</IonLabel>
            <IonInput
              type="text"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Last Name required",
                },
              })}
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.lastName && <span>{errors.lastName.message}</span>}
          </div>
          <IonItem>
            <IonSelect
              label="Sex"
              labelPlacement="stacked"
              interface="popover"
              {...register("sex", {
                required: {
                  value: true,
                  message: "Sex required",
                },
              })}
            >
              <IonSelectOption value="M">Male</IonSelectOption>
              <IonSelectOption value="F">Female</IonSelectOption>
            </IonSelect>
            
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.sex && <span>{errors.sex.message}</span>}
          </div>
          <IonItem id="open-modal">
            <IonLabel position="stacked">Date of birth</IonLabel>
            <IonText>{DOBString}</IonText>
          </IonItem>

          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: "Date of birth required",
              },
            }}
            render={({ field }) => (
              <IonModal trigger="open-modal" id="example-modal">
                <IonDatetime
                  {...field}
                  presentation="date"
                  onIonChange={(e) => {
                    let selectedDate = e.detail.value;

                    // Handle the case where e.detail.value is an array of strings
                    if (Array.isArray(selectedDate)) {
                      // Join the array into a single string (you can adjust this based on your requirements)
                      selectedDate = selectedDate.join(", ");
                    }

                    // If it's still an empty array or undefined, set it to an empty string
                    if (!selectedDate) {
                      selectedDate = "";
                    }

                    field.onChange(selectedDate);
                    setDOBString(selectedDate);
                  }}
                />
              </IonModal>
            )}
          />
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
          </div> */}
          <IonButton onClick={() => history.goBack()}>BACK</IonButton>
          <IonButton type="submit">NEXT</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register2;
