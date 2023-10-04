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
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { ErrorMessage } from "@hookform/error-message";
//import "./styles.css";
import Navbar from "../navbar/index";
import { electronicHealthRecordApi } from "../../api/Api";

const GeneralInformation: React.FC = () => {
  const [editing, isEditing] = useState(false);
  const [EHR, setEHR] = useState({});
  const [date, setDate] = useState(new Date().toISOString());
  const [dateText, setDateText] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
    reset,
  } = useForm<any>();

  useEffect(() => {
    const getDefaultValues = async (username: string) => {
      try {
        const response =
          await electronicHealthRecordApi.getElectronicHealthRecordByUsername(
            username
          );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
    getDefaultValues(localStorage.username).then((data) =>
      reset(data, { keepDirtyValues: true })
    );
  }, []);

  console.log("dirtFields", dirtyFields);
  console.log("isDirty", isDirty);

  const handleSelectChange = (event: CustomEvent, field: any) => {
    field.onChange(event.detail.value);
  };

  const handleDateChange = (event: CustomEvent, field: any) => {
    const selectedDate = event.detail.value;
    setDate(selectedDate);
    field.onChange(selectedDate);
    //console.log(field);
  };

  const onSubmit = handleSubmit(async (data) => {
    const dateOfBirth = data.dateOfBirth;
    data.dateOfBirth = dateOfBirth.replace("T", " ");
    console.log(data);
    try {
      await electronicHealthRecordApi.updateElectronicHealthRecord(data);
      console.log("Submitted");
      reset(data);
      isEditing(false);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Electronic Health Record</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={onSubmit}>
          <IonItem lines="full">
            <IonInput
              label="First Name"
              labelPlacement="fixed"
              {...register("firstName")}
              readonly={!editing}
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Last Name"
              labelPlacement="fixed"
              {...register("lastName")}
              readonly={!editing}
            />
          </IonItem>

          <Controller
            render={({ field }) => (
              <IonItem lines="full">
                {editing ? (
                  <IonSelect
                    label="Sex"
                    labelPlacement="fixed"
                    interface="popover"
                    slot="start"
                    value={field.value}
                    onIonChange={(e) => handleSelectChange(e, field)}
                  >
                    <IonSelectOption value="Male">Male</IonSelectOption>
                    <IonSelectOption value="Female">Female</IonSelectOption>
                  </IonSelect>
                ) : (
                  <IonInput
                    label="Sex"
                    labelPlacement="fixed"
                    {...register("sex")}
                    readonly={!editing}
                  />
                )}
              </IonItem>
            )}
            name="sex"
            control={control}
          />

          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => {
              //console.log(field);

              const dateValue = field.value
                ? field.value.replace(" ", "T")
                : "";
              //const dateText = field.value ? field.value.split("T")[0] : "";
              return (
                <IonItem lines="full">
                  <IonInput
                    label="Date of Birth"
                    labelPlacement="fixed"
                    id="date"
                    value={dateValue}
                    readonly
                  ></IonInput>
                  <IonPopover trigger="date" showBackdrop={false} event="click">
                    <IonDatetime
                      presentation="date"
                      max={new Date().toISOString()}
                      value={dateValue}
                      onIonChange={(e) => handleDateChange(e, field)}
                    ></IonDatetime>
                  </IonPopover>
                </IonItem>
              );
            }}
          />

          <IonItem lines="full">
            <IonInput
              label="Place of Birth"
              labelPlacement="fixed"
              {...register("placeOfBirth")}
              readonly={!editing}
            />
          </IonItem>

          <Controller
            render={({ field }) => (
              <IonItem lines="full">
                {editing ? (
                  <IonSelect
                    label="Nationality"
                    labelPlacement="fixed"
                    interface="popover"
                    slot="start"
                    value={field.value}
                    onIonChange={(e) => handleSelectChange(e, field)}
                  >
                    <IonSelectOption value="Singapore Citizen">
                      Singapore Citizen
                    </IonSelectOption>
                    <IonSelectOption value="Permanent Resident">
                      Permanent Resident
                    </IonSelectOption>
                    <IonSelectOption value="Foreigner">
                      Foreigner
                    </IonSelectOption>
                  </IonSelect>
                ) : (
                  <IonInput
                    label="Nationality"
                    labelPlacement="fixed"
                    {...register("nationality")}
                    readonly={!editing}
                  />
                )}
              </IonItem>
            )}
            name="nationality"
            control={control}
          />

          <Controller
            render={({ field }) => (
              <IonItem lines="full">
                {editing ? (
                  <IonSelect
                    label="Race"
                    labelPlacement="fixed"
                    interface="popover"
                    slot="start"
                    value={field.value}
                    onIonChange={(e) => handleSelectChange(e, field)}
                  >
                    <IonSelectOption value="Chinese">Chinese</IonSelectOption>
                    <IonSelectOption value="Malay">Malay</IonSelectOption>
                    <IonSelectOption value="Indian">Indian</IonSelectOption>
                    <IonSelectOption value="Others">Others</IonSelectOption>
                  </IonSelect>
                ) : (
                  <IonInput
                    label="Race"
                    labelPlacement="fixed"
                    {...register("race")}
                    readonly={!editing}
                  />
                )}
              </IonItem>
            )}
            name="race"
            control={control}
          />

          <IonItem lines="full">
            <IonInput
              label="Address"
              labelPlacement="fixed"
              {...register("address")}
              readonly={!editing}
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Contact"
              labelPlacement="fixed"
              type="number"
              {...register("contactNumber")}
              readonly={!editing}
            />
          </IonItem>

          {editing ? (
            <>
              <IonButton type="submit" className="ion-margin-top">
                Save
              </IonButton>
              <IonButton onClick={() => reset()} className="ion-margin-top">
                Cancel
              </IonButton>
            </>
          ) : (
            <IonButton
              onClick={() => isEditing(true)}
              className="ion-margin-top"
            >
              Edit
            </IonButton>
          )}
        </form>
      </IonContent>
      <Navbar />
    </IonPage>
  );
};

export default GeneralInformation;
