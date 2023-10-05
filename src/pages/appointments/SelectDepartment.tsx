import React, { useEffect, useState } from 'react'
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonImg,
    IonButton,
    IonFooter,
    IonText,
    IonLabel,
    IonItem,
    IonIcon,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonBackButton,
    IonButtons,
    IonList,
  } from "@ionic/react";
import Navbar from '../navbar/index';
import { personCircle, logOut, repeat, checkmarkCircleOutline } from 'ionicons/icons';
import { Route, Redirect, useHistory } from 'react-router';
import { departmentApi } from '../../api/Api';

type Props = {}

interface Department {
  unitId: number,
  name: string
}
const SelectDepartment = () => {

    const history = useHistory();
    const [departments, setDepartments] = useState<Array<Department>>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    const handleDepartmentSelect = (department: string) => {
      setSelectedDepartment(department);
      history.replace(`/appointments/select-date-time/${department}`)
    };

    const getAllDepartments = async() => {
      try {
        const response = await departmentApi.getAllDepartments("");
        setDepartments(response.data);
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      getAllDepartments();
    }, [])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                      <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Make New Appointment</IonTitle>
                </IonToolbar>
            </IonHeader>
          <IonContent className="ion-padding">
            <IonLabel style={{ fontSize: "20px",}}><b>1. Select a department</b></IonLabel><br/><br/>
            <IonList>
              {departments.map(department => (
                <IonItem button onClick={() => handleDepartmentSelect(department.name)} detail={false} key={department.unitId}>
                  <IonLabel>{department.name}</IonLabel>
                  {selectedDepartment === department.name && (
                  <IonIcon slot="end" icon={checkmarkCircleOutline} color="success" />
                )}
                </IonItem>
              ))}
              <br/>

          </IonList>
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default SelectDepartment;