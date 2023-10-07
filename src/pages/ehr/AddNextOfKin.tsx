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
} from "@ionic/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useHistory, useLocation } from "react-router";
import {
  electronicHealthRecordApi,
  patientApi,
  nextOfKinRecordApi,
} from "../../api/Api";
import { InputChangeEventDetail } from "@ionic/core";
import "../Register/styles.css";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";

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
      } catch (error) {
        console.log(error);
      }
    };
    if (storedUsername) {
      getElectronicHealthRecord(storedUsername);
    }
  }, []);

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

  /* REACT HOOK FORM */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      nextOfKin: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "nextOfKin",
    control,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data.nextOfKin);
    data.nextOfKin.forEach(async (nextOfKinRecord) => {
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
      } catch (error) {
        console.log(error);
      }
    });
  });

  useEffect(() => {
    reset({
      nextOfKin: [],
    });
  }, [isSubmitSuccessful]);

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
        {/* <h5>
          Our system shows that you have {existingNextOfKinRecords.length} Next
          of Kin records.
          <br />
          You may add a new Next of Kin record by clicking on "Add New Record"
          <br />
          Click on "Confirm" to save all newly add records.
        </h5> */}

        {existingNextOfKinRecords.map((nextOfKinRecord: any, index: number) => {
          return (
            <IonList key={index}>
              <IonItem>Next Of Kin Record {index + 1}</IonItem>
              <IonItem>
                <IonInput
                  label="Relationship"
                  labelPlacement="fixed"
                  value={nextOfKinRecord.relationship}
                  readonly={true}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="NRIC"
                  labelPlacement="fixed"
                  value={nextOfKinRecord.nric}
                  readonly={true}
                ></IonInput>
              </IonItem>
            </IonList>
          );
        })}

        <form onSubmit={onSubmit}>
          {fields.map((field, index) => {
            return (
              <IonList key={field.id}>
                <IonItem>
                  Next Of Kin Record
                  <IonButton slot="end" onClick={() => remove(index)}>
                    Remove
                  </IonButton>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Relationship"
                    labelPlacement="fixed"
                    {...register(`nextOfKin.${index}.relationship`)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="NRIC"
                    labelPlacement="fixed"
                    {...register(`nextOfKin.${index}.nric`)}
                  ></IonInput>
                </IonItem>
              </IonList>
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
