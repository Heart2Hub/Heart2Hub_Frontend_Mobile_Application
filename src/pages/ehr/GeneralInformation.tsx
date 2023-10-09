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
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { ErrorMessage } from "@hookform/error-message";
//import "../Register/styles.css";
import Navbar from "../navbar/index";
import { electronicHealthRecordApi } from "../../api/Api";

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

const GeneralInformation: React.FC = () => {
  const storedUsername = localStorage.getItem("username");
  const [editing, isEditing] = useState(false);
  const [ehrId, setEhrId] = useState(0);
  const [originalFormValues, setOriginalFormValues] = useState({});
  const [dateOfBirthText, setDateOfBirthText] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    const getElectronicHealthRecord = async (username: string) => {
      try {
        const response =
          await electronicHealthRecordApi.getElectronicHealthRecordByUsername(
            username
          );
        const ehr = response.data;
        setEhrId(ehr.electronicHealthRecordId);
        setOriginalFormValues({
          firstName: ehr.firstName,
          lastName: ehr.lastName,
          sex: ehr.sex,
          dateOfBirth: ehr.dateOfBirth.replace(" ", "T"),
          placeOfBirth: ehr.placeOfBirth,
          nationality: ehr.nationality,
          race: ehr.race,
          address: ehr.address,
          contactNumber: ehr.contactNumber,
        });
        setDateOfBirthText(ehr.dateOfBirth.split(" ")[0]);
      } catch (error) {
        console.log(error);
      }
    };

    if (storedUsername) {
      getElectronicHealthRecord(storedUsername);
    }
  }, []);

  useEffect(() => reset(originalFormValues), [originalFormValues]);

  const cancelEdit = () => {
    reset(originalFormValues);
    isEditing(false);
  };

  const handleSelectChange = (event: CustomEvent, field: any) => {
    field.onChange(event.detail.value);
  };

  const handleDateChange = (event: CustomEvent, field: any) => {
    const selectedDate = event.detail.value;
    setDateOfBirthText(selectedDate.split("T")[0]);
    field.onChange(selectedDate);
    //console.log(field);
  };

  const onSubmit = handleSubmit(async (data) => {
    const dateOfBirth = data.dateOfBirth;
    data.dateOfBirth = dateOfBirth.replace("T", " ");
    console.log(data);
    try {
      await electronicHealthRecordApi.updateElectronicHealthRecord(ehrId, data);
      isEditing(false);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ehr"></IonBackButton>
          </IonButtons>
          <IonTitle>General Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={onSubmit}>
          <IonItem lines="full">
            <IonInput
              label="First Name"
              labelPlacement="fixed"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "First Name required",
                },
              })}
              readonly={!editing}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="firstName"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem lines="full">
            <IonInput
              label="Last Name"
              labelPlacement="fixed"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Last Name required",
                },
              })}
              readonly={!editing}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="lastName"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <Controller
            name="sex"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Sex required",
              },
            }}
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
          />
          <ErrorMessage
            errors={errors}
            name="sex"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Date of Birth required",
              },
            }}
            render={({ field }) => {
              //console.log(field);

              // const dateValue = field.value
              //   ? field.value.replace(" ", "T")
              //   : "";
              //const dateText = field.value ? field.value.split("T")[0] : "";
              return (
                <IonItem lines="full">
                  <IonInput
                    label="Date of Birth"
                    labelPlacement="fixed"
                    id="date"
                    value={dateOfBirthText}
                    readonly
                  ></IonInput>
                  <IonPopover trigger="date" showBackdrop={false} event="click">
                    <IonDatetime
                      presentation="date"
                      max={new Date().toISOString()}
                      value={field.value}
                      onIonChange={(e) => handleDateChange(e, field)}
                    ></IonDatetime>
                  </IonPopover>
                </IonItem>
              );
            }}
          />
          <ErrorMessage
            errors={errors}
            name="dateOfBirth"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem lines="full">
            <IonInput
              label="Place of Birth"
              labelPlacement="fixed"
              {...register("placeOfBirth", {
                required: {
                  value: true,
                  message: "Place of Birth required",
                },
              })}
              readonly={!editing}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="placeOfBirth"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <Controller
            name="nationality"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Nationality required",
              },
            }}
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
          />
          <ErrorMessage
            errors={errors}
            name="nationality"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <Controller
            name="race"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Race required",
              },
            }}
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
          />
          <ErrorMessage
            errors={errors}
            name="race"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem lines="full">
            <IonInput
              label="Address"
              labelPlacement="fixed"
              {...register("address", {
                required: {
                  value: true,
                  message: "Address required",
                },
              })}
              readonly={!editing}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="address"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonItem lines="full">
            <IonInput
              label="Contact"
              labelPlacement="fixed"
              type="number"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Contact required",
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
              readonly={!editing}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="contactNumber"
            render={({ message }) => <div className="error">{message}</div>}
          />

          {editing ? (
            <>
              <IonButton type="submit" className="ion-margin-top">
                Save
              </IonButton>
              <IonButton onClick={cancelEdit} className="ion-margin-top">
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
