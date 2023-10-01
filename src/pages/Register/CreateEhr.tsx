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
  IonPopover,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { ErrorMessage } from "@hookform/error-message";

type FormValues = {
  firstName: string;
  lastName: string;
  sex: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  race: string;
  address: string;
  contactNumber: string;
};

const CreateEhr: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const history = useHistory();
  const location: any = useLocation();

  //Date of Birth
  const [dateText, setDateText] = useState("");
  const [date, setDate] = useState(new Date().toISOString());

  const handleDateChange = (event: CustomEvent, field: any) => {
    const selectedDate = event.detail.value;
    setDateText(selectedDate.split("T")[0]);
    setDate(selectedDate);
    field.onChange(selectedDate);
    //console.log(field);
  };

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const ehr: any = { ...data };
    ehr.nric = location.state.nric;
    reset();
    history.push({ pathname: "/register/create-patient-account", state: ehr });
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Electronic Health Record</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h5>
          We could not find an existing record in NEHR. Please fill in the
          following details to create a new Electronic Health Record.
        </h5>
        <form onSubmit={onSubmit}>
          <IonItem>
            <IonInput
              label="First Name"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "First Name required",
                },
              })}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="firstName"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonInput
              label="Last Name"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Last Name required",
                },
              })}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="lastName"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonSelect
              label="Sex"
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
          <ErrorMessage
            errors={errors}
            name="sex"
            render={({ message }) => <div className="error">{message}</div>}
          />

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
              <IonItem>
                <IonInput
                  label="Date of Birth"
                  value={dateText}
                  id="date"
                  className="ion-text-end"
                  readonly
                ></IonInput>
                <IonPopover trigger="date" showBackdrop={false} event="click">
                  <IonDatetime
                    presentation="date"
                    max={new Date().toISOString()}
                    value={date}
                    onIonChange={(e) => handleDateChange(e, field)}
                  ></IonDatetime>
                </IonPopover>
              </IonItem>
            )}
          />
          <ErrorMessage
            errors={errors}
            name="dateOfBirth"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonInput
              label="Place of Birth"
              type="text"
              {...register("placeOfBirth", {
                required: {
                  value: true,
                  message: "Place of Birth required",
                },
              })}
            ></IonInput>
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="placeOfBirth"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonSelect
              label="Nationality"
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
          <ErrorMessage
            errors={errors}
            name="nationality"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonSelect
              label="Race"
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
          <ErrorMessage
            errors={errors}
            name="race"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonInput
              label="Address"
              type="text"
              {...register("address", {
                required: {
                  value: true,
                  message: "Address required",
                },
              })}
            ></IonInput>
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="address"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem>
            <IonInput
              label="Contact Number"
              type="number"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Contact number required",
                },
                min: {
                  value: 80000000,
                  message: "Invalid contact number",
                },
                max: {
                  value: 99999999,
                  message: "Invalid contact number",
                },
              })}
            ></IonInput>
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="contactNumber"
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

export default CreateEhr;
