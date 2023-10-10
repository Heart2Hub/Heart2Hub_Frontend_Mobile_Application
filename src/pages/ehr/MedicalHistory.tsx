import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { electronicHealthRecordApi } from "../../api/Api";
import dayjs from "dayjs";

type MedicalHistory = {
  medicalRecordId: number;
  description: string;
  createdBy: string;
  createdDate: string;
  resolvedDate: string;
  priorityEnum: string;
  problemTypeEnum: string;
};

const priorityColor: any = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

const MedicalHistory: React.FC = () => {
  const storedUsername = localStorage.getItem("username") || "";
  const [medicalHistoryRecords, setMedicalHistoryRecords] = useState<
    MedicalHistory[]
  >([]);

  useEffect(() => {
    const getElectronicHealthRecord = async (username: string) => {
      try {
        const response =
          await electronicHealthRecordApi.getElectronicHealthRecordByUsername(
            username
          );
        const ehr = response.data;
        const listOfMedicalHistoryRecords = ehr.listOfMedicalHistoryRecords;
        listOfMedicalHistoryRecords.sort((a: any, b: any) => {
          const dateA = dayjs(a.resolvedDate);
          const dateB = dayjs(b.resolvedDate);

          if (dateA.isBefore(dateB)) {
            return 1;
          } else if (dateA.isAfter(dateB)) {
            return -1;
          } else {
            return 0; // Dates are equal
          }
        });
        setMedicalHistoryRecords(listOfMedicalHistoryRecords);
      } catch (error) {
        console.log(error);
      }
    };
    getElectronicHealthRecord(storedUsername);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/ehr"></IonBackButton>
          </IonButtons>
          <IonTitle>Medical History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonList>
              {medicalHistoryRecords.map((medicalHistoryRecord, index) => {
                return (
                  <IonItem key={index}>
                    <IonLabel>
                      <b>
                        {dayjs(medicalHistoryRecord.createdDate).format(
                          "DD MMM YYYY"
                        ) +
                          " - " +
                          dayjs(medicalHistoryRecord.resolvedDate).format(
                            "DD MMM YYYY"
                          )}
                      </b>
                      <p>Description: {medicalHistoryRecord.description}</p>
                      <p>Created by: {medicalHistoryRecord.createdBy}</p>
                      <p>
                        Priority:{" "}
                        <IonBadge
                          color={
                            priorityColor[medicalHistoryRecord.priorityEnum]
                          }
                        >
                          {medicalHistoryRecord.priorityEnum}
                        </IonBadge>
                      </p>
                    </IonLabel>
                  </IonItem>
                );
              })}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MedicalHistory;
