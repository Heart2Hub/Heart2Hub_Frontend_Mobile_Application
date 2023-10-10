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

const UseNehr: React.FC = () => {
  const storedNric = localStorage.getItem("nric") || "";
  const [originalFormValues, setOriginalFormValues] = useState({});
  const [dateOfBirthText, setDateOfBirthText] = useState("");
  const history = useHistory();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => reset(originalFormValues), [originalFormValues]);
  useEffect(() => {
    const getElectronicHealthRecord = async (nric: string) => {
      try {
        const response = await electronicHealthRecordApi.getNehrRecord(nric);
        const ehr = response.data;
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

    getElectronicHealthRecord(storedNric);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/ehr"></IonBackButton>
          </IonButtons>
          <IonTitle>Verify NEHR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ padding: "16px", textAlign: "justify" }}>
          <b>
            We found an existing NEHR for {storedNric}. Please verify the
            following details and click 'Agree' to proceed.
          </b>
        </div>
        <form>
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
              readonly
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
              readonly
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
              readonly
            />
          </IonItem>

          <IonItem lines="full">
            <IonInput
              label="Date of Birth"
              labelPlacement="fixed"
              value={dateOfBirthText}
              readonly
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
              readonly
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
              readonly
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
              readonly
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
              readonly
            />
          </IonItem>

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
              readonly
            />
          </IonItem>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <IonButton color="danger" onClick={() => history.replace("/")}>
              Cancel
            </IonButton>
            <IonButton
              color="success"
              onClick={() =>
                history.replace("/register/create-patient-account")
              }
            >
              Agree
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default UseNehr;
