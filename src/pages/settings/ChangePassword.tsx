import React, { useState } from 'react'
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
  } from "@ionic/react";
import Navbar from '../navbar/index';
import { personCircle, logOut, repeat } from 'ionicons/icons';
import { Route, Redirect, useHistory } from 'react-router';
import { patientApi } from '../../api/Api';
import { useForm } from 'react-hook-form';

type Props = {}

interface PasswordForm {
  oldPassword: string,
  newPassword: string,
  cfmNewPassword: string
}

const Settings = () => {

    const [formErrors, setFormErrors] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const { register, control, handleSubmit, formState: { errors }} = useForm<PasswordForm>();

    const onSubmit = async (data: PasswordForm) => {
      try {
        setFormErrors("");
        const oldPassword = data.oldPassword;
        const newPassword = data.newPassword;
        const cfmNewPassword = data.cfmNewPassword;
        if (newPassword !== cfmNewPassword) {
          setFormErrors("New passwords do not match");
        } else if (newPassword === oldPassword) {
          setFormErrors("New password cannot be the same as old password!")
        }else {
          const username = localStorage.getItem('username') ?? '';
          const response = await patientApi.changePassword(username, oldPassword, newPassword);
          setFormErrors("");
          setSuccessMsg("Password changed successfully!");
        }
      } catch (error: any) {
        setFormErrors(error.response.data);
        setSuccessMsg("");
      }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                      <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Change Password</IonTitle>
                </IonToolbar>
            </IonHeader>
          <IonContent className="ion-padding">
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
            <IonLabel position="floating">Enter current password</IonLabel>
              <IonInput
                type="password"
                {...register("oldPassword", {
                  required: {
                    value: true,
                    message: "Old Password required",
                  },
                  minLength: {
                    value: 8,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </IonItem>
            {errors.oldPassword && (
              <IonText color="danger">{errors.oldPassword.message}</IonText>
            )}<br/>
            <IonItem>
            <IonLabel position="floating">Enter new password</IonLabel>
            <IonInput
                type="password"
                {...register("newPassword", {
                  required: {
                    value: true,
                    message: "New Password required",
                  },
                  minLength: {
                    value: 8,
                    message: "New password must be at least 6 characters",
                  },
                })}
              />
            </IonItem>
            {errors.newPassword && (
              <IonText color="danger">{errors.newPassword.message}</IonText>
            )}
            <IonItem>
            <IonLabel position="floating">Confirm new password</IonLabel>
              <IonInput
                type="password"
                {...register("cfmNewPassword", {
                  required: {
                    value: true,
                    message: "New Password confirmation required",
                  },
                  minLength: {
                    value: 8,
                    message: "New password must be at least 6 characters",
                  },
                })}
              />
            </IonItem><br/>
            {errors.cfmNewPassword && (
              <IonText color="danger">{errors.cfmNewPassword.message}</IonText>
            )}<br/>
            {formErrors && formErrors.length > 0 && (
              <IonText color="danger">{formErrors}</IonText>
            )}
            {successMsg && successMsg.length > 0 && (
              <IonText color="success">{successMsg}</IonText>
            )}
            <IonButton expand="block" type="submit">
              Change Password
            </IonButton>
            </form>
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default Settings;