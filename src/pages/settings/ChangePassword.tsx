import React, { useEffect, useState } from "react";
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
  IonToast,
} from "@ionic/react";
import { personCircle, logOut, repeat } from "ionicons/icons";
import { Route, Redirect, useHistory } from "react-router";
import { patientApi } from "../../api/Api";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type Props = {};

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  cfmNewPassword: string;
}

const ChangePassword = () => {
  const [formErrors, setFormErrors] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pwErrors, setPwErrors] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>();

  const onSubmit = async (data: PasswordForm) => {
    try {
      setFormErrors("");
      const oldPassword = data.oldPassword;
      const newPassword = data.newPassword;
      const cfmNewPassword = data.cfmNewPassword;
      if (newPassword !== cfmNewPassword) {
        setFormErrors("New passwords do not match");
      } else if (newPassword === oldPassword) {
        setFormErrors("New password cannot be the same as old password!");
      } else {
        const username = localStorage.getItem("username") ?? "";
        const response = await patientApi.changePassword(
          username,
          oldPassword,
          newPassword
        );
        setFormErrors("");
        setSuccessMsg("Password changed successfully!");
      }
    } catch (error: any) {
      setFormErrors(error.response.data);
      setSuccessMsg("");
    }
  };


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
      <IonText><b>Username:</b> {localStorage.getItem("username")}</IonText>
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
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="oldPassword"
            render={({ message }) => <div className="error">{message}</div>} />
          {formErrors === 'Old Password provided is Incorrect' ? 
          <IonText style={{ color:"#bf1650"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="#bf1650" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
            </svg>&nbsp;
            {formErrors}</IonText> : null}
          <br />
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
                  value: 6,
                  message: "New password must be at least 6 characters",
                },
              })}
            />
          </IonItem>
          <ErrorMessage
            errors={errors}
            name="newPassword"
            render={({ message }) => <div className="error">{message}</div>} />
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
                  value: 6,
                  message: "New password must be at least 6 characters",
                },
              })}
            />
          </IonItem>
          <br />
          {/* <IonToast 
                isOpen={formErrors.length > 0}
                message={formErrors} 
                onDidDismiss={() => setFormErrors('')}
                color="danger"
                duration={5000}></IonToast>
              <IonToast 
                isOpen={pwErrors}
                message={errors.cfmNewPassword.message ? errors.cfmNewPassword.message : 'hello'} // fck typescript
                onDidDismiss={() => setFormErrors('')}
                color="danger"
                duration={5000}></IonToast> */}
          <IonToast
            isOpen={successMsg.length > 0}
            message={successMsg}
            onDidDismiss={() => setSuccessMsg("")}
            color="success"
            duration={5000}
          ></IonToast>

          <ErrorMessage
            errors={errors}
            name="cfmNewPassword"
            render={({ message }) => <div className="error">{message}</div>} />
          {formErrors.length > 0 && formErrors !== 'Old Password provided is Incorrect' ? 
          <IonText style={{ color:"#bf1650"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="#bf1650" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
            </svg>&nbsp;
            {formErrors}</IonText> : null}
          <br />
          {/* {formErrors && formErrors.length > 0 && (
            <IonText color="danger">{formErrors}</IonText>
          )} */}
          {/* {successMsg && successMsg.length > 0 && (
              <IonText color="success">{successMsg}</IonText>
            )} */}
          <IonButton expand="block" type="submit">
            Change Password
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;
