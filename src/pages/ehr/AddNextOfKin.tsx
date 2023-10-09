import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonText,
  InputCustomEvent,
  IonItemGroup,
  IonItemDivider,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from "@ionic/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useHistory, useLocation } from "react-router";
import {
  electronicHealthRecordApi,
  patientApi,
  nextOfKinRecordApi,
} from "../../api/Api";
import { InputChangeEventDetail } from "@ionic/core";
//import "./Register/styles.css";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  Controller,
} from "react-hook-form";
import { trash } from "ionicons/icons";
import { ErrorMessage } from "@hookform/error-message";

interface NextOfKinRecord {
  nextOfKinRecordId: number;
  relationship: string;
  nric: string;
}

type FormValues = {
  nextOfKin: {
    relationship: string;
    nric: string;
  }[];
};

const relationshipOptions = ["Father", "Mother", "Sibling", "Spouse", "Child"];

const AddNextOfKin: React.FC = () => {
  const history = useHistory();
  // const [inputFields, setInputFields] = useState<Array<NextOfKinRecord>>([]);
  // const [ehrId, setEhrId] = useState(0);
  // const [existingNextOfKinRecords, setExistingNextOfKinRecords] = useState([]);
  // const [isTouched, setIsTouched] = useState(false);
  // const [isValid, setIsValid] = useState<boolean>();

  //console.log(localStorage);
  const storedUsername = localStorage.getItem("username");
  const [ehrId, setEhrId] = useState(0);
  const [existingNextOfKinRecords, setExistingNextOfKinRecords] = useState<
    NextOfKinRecord[]
  >([]);
  const [existingRelationships, setExistingRelationships] = useState<string[]>(
    []
  );
  const [existingNrics, setExistingNrics] = useState<string[]>([]);
  const [alertOpen, setAlertOpen] = useState(-1);

  /* REACT HOOK FORM */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    watch,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      nextOfKin: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "nextOfKin",
    control,
  });

  useEffect(() => {
    const getElectronicHealthRecord = async (username: string) => {
      try {
        const response =
          await electronicHealthRecordApi.getElectronicHealthRecordByUsername(
            username
          );
        const ehr = response.data;
        setEhrId(ehr.electronicHealthRecordId);
        setExistingNextOfKinRecords(ehr.listOfNextOfKinRecords);

        const relationships: string[] = [];
        const nrics: string[] = [];
        ehr.listOfNextOfKinRecords.forEach((nextOfKinRecord: any) => {
          relationships.push(nextOfKinRecord.relationship);
          nrics.push(nextOfKinRecord.nric);
        });
        setExistingRelationships(relationships);
        setExistingNrics(nrics);
      } catch (error) {
        console.log(error);
      }
    };
    if (storedUsername) {
      getElectronicHealthRecord(storedUsername);
    }
  }, []);

  useEffect(() => {
    reset({
      nextOfKin: [],
    });
  }, [isSubmitSuccessful]);

  // const storedNextOfKinRecords = localStorage.getItem("nextOfKinRecords");
  // if (storedNextOfKinRecords) {
  //   console.log(JSON.parse(storedNextOfKinRecords));
  // }

  // const addRecord = () => {
  //   let newfield: any = { relationship: "", nric: "", valid: true };
  //   setInputFields([...inputFields, newfield]);
  // };

  // const removeRecord = (index: number) => {
  //   let data = [...inputFields];
  //   data.splice(index, 1);
  //   setInputFields(data);
  // };

  // const handleFormChange = (
  //   index: number,
  //   e: InputCustomEvent<InputChangeEventDetail>
  // ) => {
  //   let data: any = [...inputFields];
  //   //Validate NRIC
  //   const nric: string =
  //     typeof e.target.value === "string" ? e.target.value : "";
  //   if (e.target.name === "nric") {
  //     data[index]["valid"] = validateNric(nric);
  //   }
  //   data[index][e.target.name] = e.target.value;
  //   console.log(data);
  //   setInputFields(data);
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(inputFields);
  //   if (inputFields) {
  //     const checkAllNricValid = inputFields.filter((input) => !input.valid);

  //     if (checkAllNricValid.length === 0) {
  //       inputFields.forEach(async (nextOfKinRecord) => {
  //         try {
  //           await patientApi.createNextOfKinRecordDuringCreatePatient(
  //             ehrId,
  //             nextOfKinRecord
  //           );
  //         } catch (error: any) {
  //           console.log(error);
  //         }
  //       });
  //     } else {
  //       return;
  //     }
  //   }
  //   setInputFields([]);
  //   history.push("/register/confirmation");
  // };

  // const validateNric = (nric: string) => {
  //   return nric.match(/^[STFG]\d{7}[A-Z]$/);
  // };

  // const validate = (ev: Event) => {
  //   const value = (ev.target as HTMLInputElement).value;

  //   setIsValid(undefined);

  //   if (value === "") return;

  //   validateNric(value) !== null ? setIsValid(true) : setIsValid(false);
  // };

  // const markTouched = () => {
  //   setIsTouched(true);
  // };

  const onSubmit = handleSubmit((data) => {
    //console.log(data.nextOfKin);
    const nextOfKin = data.nextOfKin;

    const indicesOfDuplicates: number[] = [];

    nextOfKin.forEach((element, index, self) => {
      const duplicateIndex = self.findIndex(
        (otherElement, otherIndex) =>
          otherIndex !== index && otherElement.nric === element.nric
      );

      if (duplicateIndex !== -1 && !indicesOfDuplicates.includes(index)) {
        indicesOfDuplicates.push(index);

        setError(`nextOfKin.${index}.nric`, {
          type: "manual",
          message: "Duplicate NRIC",
        });
      }
    });

    //console.log(indicesOfDuplicates);

    if (indicesOfDuplicates.length === 0) {
      nextOfKin.forEach(async (nextOfKinRecord) => {
        try {
          const response = await nextOfKinRecordApi.createNextOfKinRecord(
            ehrId,
            nextOfKinRecord
          );
          const newNextOfKinRecord = response.data;
          setExistingNextOfKinRecords([
            ...existingNextOfKinRecords,
            newNextOfKinRecord,
          ]);
          setExistingRelationships([
            ...existingRelationships,
            newNextOfKinRecord.relationship,
          ]);
          setExistingNrics([...existingNrics, newNextOfKinRecord.nric]);
        } catch (error) {
          console.log(error);
        }
      });
    }
  });

  const handleDelete = async (nextOfKinRecordId: number, index: number) => {
    //console.log(nextOfKinRecordId);
    try {
      await nextOfKinRecordApi.deleteNextOfKinRecord(nextOfKinRecordId);

      existingNextOfKinRecords.splice(index, 1);
      existingRelationships.splice(index, 1);
      existingNrics.splice(index, 1);

      setExistingNextOfKinRecords(existingNextOfKinRecords);
      setExistingRelationships(existingRelationships);
      setExistingNrics(existingNrics);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ehr"></IonBackButton>
          </IonButtons>
          <IonTitle>Add Next of Kin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h5>
          Our system shows that you have {existingNextOfKinRecords.length} Next
          of Kin records. You may add a new Next of Kin record by clicking on
          "Add New Record". Finally, click on "Save" to save all newly add
          records.
        </h5>

        {existingNextOfKinRecords.map((nextOfKinRecord: any, index: number) => {
          return (
            <IonCard key={index} color="light">
              <IonCardHeader>
                <IonCardTitle>
                  Next Of Kin Record {index + 1}{" "}
                  <IonIcon
                    icon={trash}
                    className="ion-float-right"
                    onClick={() => setAlertOpen(index)}
                  ></IonIcon>
                  <IonAlert
                    isOpen={alertOpen === index}
                    subHeader={`Are you sure you want to delete Next of Kin Record ${
                      index + 1
                    }?`}
                    message="This action is irreversible"
                    buttons={[
                      {
                        text: "Cancel",
                        role: "cancel",
                        handler: () => {
                          console.log("Alert canceled");
                        },
                      },
                      {
                        text: "Confirm",
                        role: "confirm",
                        handler: () => {
                          handleDelete(
                            nextOfKinRecord.nextOfKinRecordId,
                            index
                          );
                        },
                      },
                    ]}
                    onDidDismiss={() => setAlertOpen(-1)}
                  ></IonAlert>
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonList className="ion-no-padding">
                  <IonItem lines="full" color="light">
                    <IonInput
                      label="Relationship"
                      labelPlacement="fixed"
                      value={nextOfKinRecord.relationship}
                      readonly={true}
                    ></IonInput>
                  </IonItem>
                  <IonItem lines="full" color="light">
                    <IonInput
                      label="NRIC"
                      labelPlacement="fixed"
                      value={nextOfKinRecord.nric}
                      readonly={true}
                    ></IonInput>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          );
        })}

        <form onSubmit={onSubmit}>
          {fields.map((field, index) => {
            return (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardTitle>
                    Next Of Kin Record{" "}
                    {existingNextOfKinRecords.length + index + 1}{" "}
                    <IonIcon
                      icon={trash}
                      className="ion-float-right"
                      onClick={() => remove(index)}
                    ></IonIcon>
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonList>
                    <IonItem lines="full">
                      <IonSelect
                        label="Relationship"
                        labelPlacement="fixed"
                        slot="start"
                        {...register(`nextOfKin.${index}.relationship`, {
                          required: {
                            value: true,
                            message: "Relationship required",
                          },
                        })}
                      >
                        {relationshipOptions.map((option: string) => (
                          <IonSelectOption
                            key={option}
                            value={option}
                            disabled={
                              (option === "Father" ||
                                option === "Mother" ||
                                option === "Spouse") &&
                              existingRelationships.includes(option)
                            }
                          >
                            {option}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                    <ErrorMessage
                      errors={errors}
                      name={`nextOfKin.${index}.relationship`}
                      render={({ message }) => (
                        <div className="error">{message}</div>
                      )}
                    />

                    <IonItem lines="full">
                      <IonInput
                        label="NRIC"
                        labelPlacement="fixed"
                        {...register(`nextOfKin.${index}.nric`, {
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
                          validate: (value) => {
                            if (
                              existingNrics &&
                              existingNrics.includes(value)
                            ) {
                              return "Duplicate NRIC";
                            }
                            return true;
                          },
                        })}
                      ></IonInput>
                    </IonItem>
                    <ErrorMessage
                      errors={errors}
                      name={`nextOfKin.${index}.nric`}
                      render={({ message }) => (
                        <div className="error">{message}</div>
                      )}
                    />
                  </IonList>
                </IonCardContent>
              </IonCard>
            );
          })}
          <IonButton onClick={() => append({ relationship: "", nric: "" })}>
            Add New Record
          </IonButton>
          <IonButton type="submit">Save</IonButton>

          {/* {inputFields.map((input, index) => {
            return (
              <IonList key={index}>
                <IonItem>
                  <IonText>
                    Next Of Kin Record{" "}
                    {index + existingNextOfKinRecords.length + 1}
                  </IonText>
                  <IonButton slot="end" onClick={() => removeRecord(index)}>
                    Remove
                  </IonButton>
                </IonItem>
                <IonItem>
                  <IonInput
                    name="relationship"
                    label="Relationship"
                    onIonChange={(
                      e: InputCustomEvent<InputChangeEventDetail>
                    ) => handleFormChange(index, e)}
                    required
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    name="nric"
                    label="NRIC"
                    value={input.nric}
                    onIonChange={(
                      e: InputCustomEvent<InputChangeEventDetail>
                    ) => handleFormChange(index, e)}
                    required
                  ></IonInput>
                </IonItem>
                {input.valid ? null : <div className="error">Invalid Nric</div>}
              </IonList>
            );
          })}

          <div className="flex-buttons">
            <IonButton onClick={addRecord} className="ion-margin-top">
              Add new record
            </IonButton>

            <IonButton type="submit" className="ion-margin-top">
              Save
            </IonButton>
          </div> */}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddNextOfKin;
