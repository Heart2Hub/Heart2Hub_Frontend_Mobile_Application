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
import "./styles.css";

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
  const [dateOfBirthText, setDateOfBirthText] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      sex: "Male",
      dateOfBirth: new Date().toISOString(),
      placeOfBirth: "",
      nationality: "Singapore Citizen",
      race: "Chinese",
      address: "",
      contactNumber: "",
    },
  });

  const history = useHistory();

  const handleSelectChange = (event: CustomEvent, field: any) => {
    field.onChange(event.detail.value);
  };

  const handleDateChange = (event: CustomEvent, field: any) => {
    const selectedDate = event.detail.value;
    setDateOfBirthText(selectedDate.split("T")[0]);
    field.onChange(selectedDate);
    //console.log(field);
  };

  const onSubmit = handleSubmit((data) => {
    const dateOfBirth = data.dateOfBirth;
    data.dateOfBirth = dateOfBirth.replace("T", " ");
    //console.log(data);
    const ehr: any = { ...data };
    ehr.nric = localStorage.getItem("nric");
    localStorage.setItem("ehr", JSON.stringify(ehr));
    // const storedEhr = localStorage.getItem("ehr");
    // if (storedEhr !== null) {
    //   console.log(JSON.parse(storedEhr));
    // }
    history.push("/register/create-patient-account");
  });

  useEffect(() => reset(), [isSubmitSuccessful]);

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
                  <IonSelectOption value="Foreigner">Foreigner</IonSelectOption>
                </IonSelect>
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
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="contactNumber"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonButton type="submit" className="ion-margin-top">
            Save
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
    // <IonPage>
    //   <IonHeader>
    //     <IonToolbar>
    //       <IonTitle>Create Electronic Health Record</IonTitle>
    //     </IonToolbar>
    //   </IonHeader>
    //   <IonContent fullscreen className="ion-padding">
    //     <h5>
    //       We could not find an existing record in NEHR. Please fill in the
    //       following details to create a new Electronic Health Record.
    //     </h5>
    //     <form onSubmit={onSubmit}>
    //       <IonItem>
    //         <IonInput
    //           label="First Name"
    //           {...register("firstName", {
    //             required: {
    //               value: true,
    //               message: "First Name required",
    //             },
    //           })}
    //         />
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="firstName"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonInput
    //           label="Last Name"
    //           {...register("lastName", {
    //             required: {
    //               value: true,
    //               message: "Last Name required",
    //             },
    //           })}
    //         />
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="lastName"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonSelect
    //           label="Sex"
    //           interface="popover"
    //           {...register("sex", {
    //             required: {
    //               value: true,
    //               message: "Sex required",
    //             },
    //           })}
    //         >
    //           <IonSelectOption value="M">Male</IonSelectOption>
    //           <IonSelectOption value="F">Female</IonSelectOption>
    //         </IonSelect>
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="sex"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <Controller
    //         name="dateOfBirth"
    //         control={control}
    //         defaultValue=""
    //         rules={{
    //           required: {
    //             value: true,
    //             message: "Date of birth required",
    //           },
    //         }}
    //         render={({ field }) => (
    //           <IonItem>
    //             <IonInput
    //               label="Date of Birth"
    //               value={dateText}
    //               id="date"
    //               className="ion-text-end"
    //               readonly
    //             ></IonInput>
    //             <IonPopover trigger="date" showBackdrop={false} event="click">
    //               <IonDatetime
    //                 presentation="date"
    //                 max={new Date().toISOString()}
    //                 value={date}
    //                 onIonChange={(e) => handleDateChange(e, field)}
    //               ></IonDatetime>
    //             </IonPopover>
    //           </IonItem>
    //         )}
    //       />
    //       <ErrorMessage
    //         errors={errors}
    //         name="dateOfBirth"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonInput
    //           label="Place of Birth"
    //           type="text"
    //           {...register("placeOfBirth", {
    //             required: {
    //               value: true,
    //               message: "Place of Birth required",
    //             },
    //           })}
    //         ></IonInput>
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="placeOfBirth"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonSelect
    //           label="Nationality"
    //           interface="popover"
    //           {...register("nationality", {
    //             required: {
    //               value: true,
    //               message: "Nationality required",
    //             },
    //           })}
    //         >
    //           <IonSelectOption value="Singapore Citizen">
    //             Singapore Citizen
    //           </IonSelectOption>
    //           <IonSelectOption value="Permanent Resident">
    //             Permanent Resident
    //           </IonSelectOption>
    //           <IonSelectOption value="Foreigner">Foreigner</IonSelectOption>
    //         </IonSelect>
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="nationality"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonSelect
    //           label="Race"
    //           interface="popover"
    //           {...register("race", {
    //             required: {
    //               value: true,
    //               message: "Race required",
    //             },
    //           })}
    //         >
    //           <IonSelectOption value="Chinese">Chinese</IonSelectOption>
    //           <IonSelectOption value="Malay">Malay</IonSelectOption>
    //           <IonSelectOption value="Indian">Indian</IonSelectOption>
    //           <IonSelectOption value="Chinese">Chinese</IonSelectOption>
    //         </IonSelect>
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="race"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonInput
    //           label="Address"
    //           type="text"
    //           {...register("address", {
    //             required: {
    //               value: true,
    //               message: "Address required",
    //             },
    //           })}
    //         ></IonInput>
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="address"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />

    //       <IonItem>
    //         <IonInput
    //           label="Contact Number"
    //           type="number"
    //           {...register("contactNumber", {
    //             required: {
    //               value: true,
    //               message: "Contact number required",
    //             },
    //             min: {
    //               value: 80000000,
    //               message: "Invalid contact number",
    //             },
    //             max: {
    //               value: 99999999,
    //               message: "Invalid contact number",
    //             },
    //           })}
    //         ></IonInput>
    //       </IonItem>
    //       <ErrorMessage
    //         errors={errors}
    //         name="contactNumber"
    //         render={({ message }) => <div className="error">{message}</div>}
    //       />
    //       <IonButton type="submit" className="ion-margin-top">
    //         NEXT
    //       </IonButton>
    //     </form>
    //   </IonContent>
    // </IonPage>
  );
};

export default CreateEhr;
