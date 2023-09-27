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
import React, { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router";
import {
  RegisterStep2,
  FormValues,
  WizardStore,
  RegisterStep3,
} from "../store/store";
import { patientApi } from "../api/Api";

const Register3: React.FC = () => {
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
  const [DOBString, setDOBString] = useState("");

  const createRequestBody = (formData: any) => {
    const patient: any = {};
    const ehr: any = {};

    for (const key in formData) {
      if (key === "username" || key === "password") {
        patient[key] = formData[key];
      } else {
        ehr[key] = formData[key];
      }
    }

    const requestBody: any = {
      patient: patient,
      ehr: ehr,
    };

    return requestBody;
  };

  const postPatient = async (requestBody: any) => {
    try {
      const response = await patientApi.createPatient(requestBody);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<RegisterStep3> = (data: RegisterStep3) => {
    WizardStore.update((s) => {
      s.firstName = data.firstName as string;
      s.lastName = data.lastName as string;
      s.sex = data.sex as string;
      s.dateOfBirth = data.dateOfBirth as string;
      s.placeOfBirth = data.placeOfBirth as string;
      s.nationality = data.nationality as string;
      s.race = data.race as string;
      s.address = data.address as string;
      s.contactNumber = data.contactNumber as string;
    });
    console.log(data);
    postPatient(createRequestBody(data));
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
          </div>
          <IonItem>
            <IonLabel position="stacked">Place of Birth</IonLabel>
            <IonInput
              type="text"
              {...register("placeOfBirth", {
                required: {
                  value: true,
                  message: "Place of Birth required",
                },
              })}
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.placeOfBirth && <span>{errors.placeOfBirth.message}</span>}
          </div>
          <IonItem>
            <IonSelect
              label="Nationality"
              labelPlacement="stacked"
              interface="popover"
              {...register("nationality", {
                required: {
                  value: true,
                  message: "Nationality required",
                },
              })}
            >
              <IonSelectOption value="Singapore Citizen">
                Singapore Citizen
              </IonSelectOption>
              <IonSelectOption value="Permanent Resident">
                Permanent Resident
              </IonSelectOption>
              <IonSelectOption value="Foreigner">Foreigner</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.nationality && <span>{errors.nationality.message}</span>}
          </div>
          <IonItem>
            <IonSelect
              label="Race"
              labelPlacement="stacked"
              interface="popover"
              {...register("race", {
                required: {
                  value: true,
                  message: "Race required",
                },
              })}
            >
              <IonSelectOption value="Chinese">Chinese</IonSelectOption>
              <IonSelectOption value="Malay">Malay</IonSelectOption>
              <IonSelectOption value="Indian">Indian</IonSelectOption>
              <IonSelectOption value="Chinese">Chinese</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.race && <span>{errors.race.message}</span>}
          </div>
          <IonItem>
            <IonLabel position="stacked">Address</IonLabel>
            <IonInput
              type="text"
              {...register("address", {
                required: {
                  value: true,
                  message: "Address required",
                },
              })}
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.address && <span>{errors.address.message}</span>}
          </div>
          <IonItem>
            <IonLabel position="stacked">Contact Number</IonLabel>
            <IonInput
              type="text"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Contact number required",
                },
              })}
            ></IonInput>
          </IonItem>
          <div style={{ margin: 8, marginLeft: 20, color: "red" }}>
            {errors.contactNumber && (
              <span>{errors.contactNumber.message}</span>
            )}
          </div>
          <IonButton onClick={() => history.goBack()}>BACK</IonButton>
          <IonButton type="submit">NEXT</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register3;
