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
  IonImg,
  IonThumbnail,
} from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { imageServerApi, patientApi } from "../../api/Api";
import { ErrorMessage } from "@hookform/error-message";
import "./styles.css";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import moment from "moment";

type FormValues = {
  username: string;
  password: string;
  confirmPassword: string;
};

interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const CreatePatientAccount: React.FC = () => {
  const [photo, setPhoto] = useState<UserPhoto>();
  const [photoFormData, setPhotoFormData] = useState<FormData | undefined>();
  const [photoError, setPhotoError] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const history = useHistory();

  const onSubmit = async (data: any) => {
    const { confirmPassword, ...patient } = data;

    try {
      const imageServerResponse = await imageServerApi.uploadProfilePhoto(
        "id",
        photoFormData
      );

      const imageDocument = {
        imageLink: imageServerResponse.data.filename,
        createdDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
      };

      try {
        const storedEhr = localStorage.getItem("ehr");
        if (storedEhr) {
          const requestBody = {
            newPatient: patient,
            newElectronicHealthRecord: JSON.parse(storedEhr),
            imageDocument: imageDocument,
          };
          await patientApi.createPatientWithoutNehr(requestBody);
        } else {
          const nric = localStorage.getItem("nric");
          if (nric) {
            const requestBody = {
              newPatient: patient,
              imageDocument: imageDocument,
            };
            await patientApi.createPatientWithNehr(requestBody, nric);
          }
        }

        history.push("/register/confirmation");
      } catch (error: any) {
        const cleanedError = error.response.data.replace(
          /^Error Encountered:\s*/,
          ""
        );
        setError("username", {
          type: "manual",
          message: cleanedError,
        });
      }
    } catch (error: any) {
      setPhotoError(error.response.data);
    }
  };

  useEffect(() => {
    setPhoto(undefined);
    setPhotoFormData(undefined);
    setPhotoError("");
    reset();
  }, [isSubmitSuccessful]);

  const uploadPhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      quality: 100,
    });

    console.log(photo);
    const fileName = Date.now() + ".jpeg";
    setPhoto({
      filepath: fileName,
      webviewPath: photo.dataUrl,
    });

    const formData = new FormData();

    if (photo.dataUrl) {
      const data = atob(photo.dataUrl.split(",")[1]);
      const arrayBuffer = new ArrayBuffer(data.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < data.length; i++) {
        uint8Array[i] = data.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: "image/png" });

      // Create a FormData object to send the image data
      const formData = new FormData();
      formData.append("image", blob, "image.png");
      setPhotoFormData(formData);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Patient Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div style={{ padding: "12px", textAlign: "justify" }}>
          <b>
            <p>
              Enter a username, password and upload a profile photo to create
              your patient account.
            </p>
            <p>
              Username should be at least 6 characters long. Password should be
              at least 8 characters long.
            </p>
          </b>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonInput
            className="ion-margin-top"
            type="text"
            fill="solid"
            label="Username"
            labelPlacement="floating"
            {...register("username", {
              required: {
                value: true,
                message: "Username required",
              },
              minLength: {
                value: 6,
                message: "Username must be at least 6 characters",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonInput
            className="ion-margin-top"
            type="password"
            fill="solid"
            label="Password"
            labelPlacement="floating"
            {...register("password", {
              required: {
                value: true,
                message: "Password required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <IonInput
            className="ion-margin-top"
            type="password"
            fill="solid"
            label="Confirm Password"
            labelPlacement="floating"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm Password required",
              },
              validate: (value) => {
                return value === watch("password") || "Passwords do not match";
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="confirmPassword"
            render={({ message }) => <div className="error">{message}</div>}
          />

          <div style={{ marginTop: "16px" }}>
            {photoError ? <div className="error">{photoError}</div> : null}
            <IonButton onClick={uploadPhoto}>Choose Image</IonButton>{" "}
          </div>

          {photo ? (
            <IonThumbnail className="profile-thumbnail ion-margin-top">
              <img src={photo.webviewPath} />{" "}
            </IonThumbnail>
          ) : null}

          <IonButton type="submit" className="ion-margin-top">
            Create Account
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default CreatePatientAccount;
