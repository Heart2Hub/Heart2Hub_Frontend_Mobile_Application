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

type ProblemRecord = {
  problemRecordId: number;
  description: string;
  createdBy: string;
  createdDate: string;
  priorityEnum: string;
  problemTypeEnum: string;
};

const priorityColor: any = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

const Problems: React.FC = () => {
  const storedUsername = localStorage.getItem("username") || "";
  const [problemRecords, setProblemRecords] = useState<ProblemRecord[]>([]);

  useEffect(() => {
    const getElectronicHealthRecord = async (username: string) => {
      try {
        const response =
          await electronicHealthRecordApi.getElectronicHealthRecordByUsername(
            username
          );
        const ehr = response.data;
        const listOfProblemRecords = ehr.listOfProblemRecords;
        listOfProblemRecords.sort((a: any, b: any) => {
          const dateA = dayjs(a.createdDate);
          const dateB = dayjs(b.createdDate);

          if (dateA.isBefore(dateB)) {
            return 1;
          } else if (dateA.isAfter(dateB)) {
            return -1;
          } else {
            return 0; // Dates are equal
          }
        });
        setProblemRecords(listOfProblemRecords);
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
          <IonTitle>Problems</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonList>
              {problemRecords.map((problemRecord, index) => {
                return (
                  <IonItem key={index}>
                    <IonLabel>
                      <b>
                        {dayjs(problemRecord.createdDate).format("DD MMM YYYY")}
                      </b>
                      <p>Description: {problemRecord.description}</p>
                      <p>Created by: {problemRecord.createdBy}</p>
                      <p>
                        Priority:{" "}
                        <IonBadge
                          color={priorityColor[problemRecord.priorityEnum]}
                        >
                          {problemRecord.priorityEnum}
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

export default Problems;
