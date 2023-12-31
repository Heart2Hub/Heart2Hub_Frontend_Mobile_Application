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
  IonToast,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { ErrorMessage } from "@hookform/error-message";
//import "../Register/styles.css";
import { electronicHealthRecordApi } from "../../api/Api";
import dayjs from "dayjs";

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
  const [editToast, setEditToast] = useState(false);

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

        setDateOfBirthText(dayjs(ehr.dateOfBirth).format("DD MMM YYYY"));
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

  const onSubmit = handleSubmit(async (data) => {
    const dateOfBirth = data.dateOfBirth;
    data.dateOfBirth = dateOfBirth.replace("T", " ");
    console.log(data);
    try {
      await electronicHealthRecordApi.updateElectronicHealthRecord(ehrId, data);
      setEditToast(true);
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
            <IonBackButton defaultHref="/tabs/ehr"></IonBackButton>
          </IonButtons>
          <IonTitle>General Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div style={{ padding: "16px", textAlign: "justify" }}>
          <b>
            Please view your EHR details below. Click on 'Edit' to change you
            Address and Contact only.
          </b>
        </div>
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
              disabled
            />
          </IonItem>

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
              disabled
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Sex"
              labelPlacement="fixed"
              {...register("sex", {
                required: {
                  value: true,
                  message: "Last Name required",
                },
              })}
              disabled
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Date of Birth"
              labelPlacement="fixed"
              value={dateOfBirthText}
              disabled
            />
          </IonItem>

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
              disabled
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Nationality"
              labelPlacement="fixed"
              {...register("nationality", {
                required: {
                  value: true,
                  message: "Place of Birth required",
                },
              })}
              disabled
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Race"
              labelPlacement="fixed"
              {...register("race", {
                required: {
                  value: true,
                  message: "Place of Birth required",
                },
              })}
              disabled
            />
          </IonItem>

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
              disabled={!editing}
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
              disabled={!editing}
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
        <IonToast
          isOpen={editToast}
          color="success"
          message={"Address and Contact updated"}
          onDidDismiss={() => setEditToast(false)}
          duration={3000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default GeneralInformation;
