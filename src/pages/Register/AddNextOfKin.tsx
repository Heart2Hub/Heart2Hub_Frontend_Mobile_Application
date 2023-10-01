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
} from "@ionic/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useHistory, useLocation } from "react-router";
import { patientApi } from "../../api/Api";
import { InputChangeEventDetail } from "@ionic/core";

interface NextOfKinRecord {
  relationship: string;
  nric: string;
  valid: boolean;
}

const AddNextOfKin: React.FC = () => {
  const history = useHistory();
  const location: any = useLocation();
  console.log(location.state);
  const [inputFields, setInputFields] = useState<Array<NextOfKinRecord>>([]);
  const [ehrId, setEhrId] = useState(0);
  const [existingNextOfKinRecords, setExistingNextOfKinRecords] = useState([]);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();

  useEffect(() => {
    console.log("USE EFFECT");
    if (location.state) {
      if (location.state.electronicHealthRecord) {
        setEhrId(
          location.state.electronicHealthRecord.electronicHealthRecordId
        );
        setExistingNextOfKinRecords(
          location.state.electronicHealthRecord.listOfNextOfKinRecords
        );
      }
    }
  }, [location.state]);

  const addRecord = () => {
    let newfield: any = { relationship: "", nric: "", valid: true };
    setInputFields([...inputFields, newfield]);
  };

  const removeRecord = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  };

  const handleFormChange = (
    index: number,
    e: InputCustomEvent<InputChangeEventDetail>
  ) => {
    let data: any = [...inputFields];
    //Validate NRIC
    const nric: string =
      typeof e.target.value === "string" ? e.target.value : "";
    if (e.target.name === "nric") {
      data[index]["valid"] = validateNric(nric);
    }
    data[index][e.target.name] = e.target.value;
    console.log(data);
    setInputFields(data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputFields);
    if (inputFields) {
      const checkAllNricValid = inputFields.filter((input) => !input.valid);

      if (checkAllNricValid.length === 0) {
        inputFields.forEach(async (nextOfKinRecord) => {
          try {
            await patientApi.createNextOfKinRecordDuringCreatePatient(
              ehrId,
              nextOfKinRecord
            );
          } catch (error: any) {
            console.log(error);
          }
        });
      } else {
        return;
      }
    }
    setInputFields([]);
    history.push("/register/confirmation");
  };

  const validateNric = (nric: string) => {
    return nric.match(/^[STFG]\d{7}[A-Z]$/);
  };

  const validate = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

    setIsValid(undefined);

    if (value === "") return;

    validateNric(value) !== null ? setIsValid(true) : setIsValid(false);
  };

  const markTouched = () => {
    setIsTouched(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
                  value={nextOfKinRecord.relationship}
                  readonly={true}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="NRIC"
                  value={nextOfKinRecord.nric}
                  readonly={true}
                ></IonInput>
              </IonItem>
            </IonList>
          );
        })}

        <form onSubmit={handleSubmit}>
          {inputFields.map((input, index) => {
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
                    value={input.relationship}
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
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddNextOfKin;
