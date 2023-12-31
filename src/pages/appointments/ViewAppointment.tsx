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
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonThumbnail,
  IonAlert,
  IonToast,
  IonAvatar,
} from "@ionic/react";
import {
  pencil,
  pencilOutline,
  pencilSharp,
  personCircleOutline,
  trashBin,
  trashBinOutline,
} from "ionicons/icons";
import {
  Route,
  Redirect,
  useHistory,
  useParams,
  useLocation,
} from "react-router";
import {
  appointmentApi,
  departmentApi,
  imageServerApi,
  staffApi,
} from "../../api/Api";
import dayjs from "dayjs";
import heartLogo from "../../assets/heartLogo.png";
import SelectDateTime from "./SelectDateTime";

type Props = {};

interface Appointment {
  appointmentId: number;
  description: string;
  comments: string;
  bookedDateTime: string[];
  department: string;
  currentAssignedStaffId: number;
  message: string;
  arrived: boolean;
  staffDetails: Staff;
  swimlaneStatusEnum: string;
}

interface Staff {
  firstname: string;
  lastname: string;
  unit: {
    unitId: number;
    name: string;
  };
  profilePicture: FormData;
  image: any;
  staffRoleEnum: string;
}

const ViewAppointment = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation<Appointment>();

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [appointmentDTO, setAppointmentDTO] = useState(null);
  const [attendedStaff, setAttendedStaff] = useState<Staff[]>([]);

  const handleEdit = () => {
    history.push(`/tabs/services/appointments/edit/${id}`, {
      department: state?.department,
      bookedDateTime: state?.bookedDateTime,
      appointmentId: id,
    });
  };
  const getDateTime = (dateTime: string[]) => {
    const d = dayjs()
      .year(Number(dateTime[0]))
      .month(Number(dateTime[1]) - 1)
      .date(Number(dateTime[2]))
      .hour(Number(dateTime[3]))
      .minute(Number(dateTime[4]));
    return dayjs(d).format("DD/MM/YYYY HH:mm");
  };

  const handleDelete = async () => {
    try {
      const response = await appointmentApi.deleteAppointment(Number(id));
      if (response.status === 200) {
        setConfirm(true);
        setErrorMsg("");
      }
    } catch (error: any) {
      setErrorMsg(error.response.data);
    }
  };

  const handleGetProfileImage = async (profilePicture: any) => {
    if (profilePicture) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        profilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      // setProfileImage(imageURL);
    }
  };

  const isAppointmentPast = (dt: string[], swimlaneStatusEnum: string) => {
    if (swimlaneStatusEnum == "DONE") {
      return true;
    }

    if (!dt) return false;
    const [year, month, day, hour, minute] = dt.map(Number);

    const targetDate = dayjs()
      .set("year", year)
      .set("month", month - 1)
      .set("day", day - 1)
      .set("hour", hour)
      .set("minute", minute);
    const currentDate = dayjs();
    if (currentDate.isAfter(targetDate)) {
      return true;
    }
    return false;
  };

  function createBlobUrl(blob: Blob) {
    return URL.createObjectURL(blob);
  }

  const fetchPastData = async (appointmentId: number) => {
    try {
      const response = await appointmentApi.getAppointmentDTOById(
        appointmentId
      );
      setAppointmentDTO(response.data);

      let list = [];
      const attendingStaffList = response.data.listOfStaffsId;

      for (let i = 0; i < attendingStaffList.length; i++) {
        const staffResponse = await staffApi.getStaffById(
          attendingStaffList[i]
        );
        list.push(staffResponse.data);

        const imageResponse = await imageServerApi.getImageFromImageServer(
          "id",
          staffResponse.data.profilePicture.imageLink
        );
        // Ensure the image data is treated as Blob
        const imageBlob = new Blob([imageResponse.data], {
          type: imageResponse.headers["content-type"],
        });
        list[i].image = imageBlob;
      }
      console.log(list);
      setAttendedStaff(list);

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(state);
    if (state) {
      fetchPastData(state.appointmentId);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs/services/appointments"></IonBackButton>
          </IonButtons>
          <IonTitle>View Appointment</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <IonText style={{ fontSize: "20px" }}>
            <b>Appointment</b>
          </IonText>
          <IonText>
            {!isAppointmentPast(
              state?.bookedDateTime,
              state?.swimlaneStatusEnum
            ) ? (
              <>
                <IonText
                  style={{ fontSize: "15px", color: "blue" }}
                  onClick={handleEdit}
                >
                  <IonIcon
                    style={{ fontSize: "18px", marginLeft: "10px" }}
                    icon={pencilOutline}
                    color="primary"
                  />
                </IonText>
                <IonText
                  style={{ fontSize: "15px", color: "blue" }}
                  onClick={() => setOpen(true)}
                >
                  <IonIcon
                    style={{ fontSize: "18px", marginLeft: "10px" }}
                    icon={trashBinOutline}
                    color="danger"
                  />
                </IonText>
              </>
            ) : null}
          </IonText>
        </div>
        <IonText>Appointment ID: {state?.appointmentId}</IonText>
        <br />
        <br />
        <IonImg src={heartLogo} alt="Heart2Hub"></IonImg>
        {state && state.bookedDateTime && (
          <>
            <IonText style={{ fontSize: "18px" }}>
              <b>
                <u>{state?.department} Department</u>
              </b>
            </IonText>
            {/* {state?.staffDetails ? <IonText style={{ fontSize: "16px"}}><b>Assigned doctor: </b>Dr {state?.staffDetails.firstname + ' ' + state?.staffDetails.lastname}</IonText> : */}
            {/* null} */}
            <br />
            <br />

            <IonText style={{ fontSize: "16px" }}>
              <b>Date: </b>
              {getDateTime(state?.bookedDateTime).split(" ")[0]}
            </IonText>
            <br />
            <IonText style={{ fontSize: "16px" }}>
              <b>Time: </b>
              {getDateTime(state?.bookedDateTime).split(" ")[1]}
            </IonText>
          </>
        )}
        <br />
        <br />
        {!isAppointmentPast(
          state?.bookedDateTime,
          state?.swimlaneStatusEnum
        ) && (
          <>
            <IonText style={{ fontSize: "16px" }}>
              <b>Arrived: </b>
              {state?.arrived ? "Yes" : "No"}
            </IonText>
            <br />
            <br />
          </>
        )}

        <IonText style={{ fontSize: "16px" }}>
          <b>Description:</b> {state?.description ? state?.description : "-"}
        </IonText>
        <br />
        <br />
        {!isAppointmentPast(
          state?.bookedDateTime,
          state?.swimlaneStatusEnum
        ) ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Pre-appointment instructions</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent style={{ fontSize: "14px" }}>
                <li>
                  Ensure you bring along your insurance card, ID, referral, and
                  any other required documents ready for your appointment.
                </li>
                <li>
                  Ensure you have 7 hours of uninterrupted rest before your
                  appointment.
                </li>
                <li>
                  If this is your first visit, please bring along the items
                  listed above and:
                  <ul>
                    <li>
                      Referral letter from your polyclinic / other healthcare
                      institutions/ private doctor
                    </li>
                    <li>Medication, if any</li>
                    <li>
                      X-ray and investigation records (within the last 6
                      months), if any
                    </li>
                  </ul>
                </li>
              </IonCardContent>
            </IonCard>
          </>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Attended Staff</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent style={{ fontSize: "14px" }}>
                <IonList>
                  {attendedStaff.map((staff, index) => (
                    <IonItem key={index}>
                      <IonAvatar slot="start">
                        <img src={createBlobUrl(staff.image)} alt="Staff" />
                      </IonAvatar>
                      <IonLabel>
                        <IonCardTitle style={{ fontSize: "14px"}}>
                          {staff.firstname} {staff.lastname}
                          {" (" + staff.staffRoleEnum + ")"}
                        </IonCardTitle>
                        <IonCardSubtitle style={{ fontSize: "13px"}} >{staff.unit.name}</IonCardSubtitle>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </>
        )}

        <IonText style={{ fontSize: "16px", marginTop: "10px" }}>
          <b>Address:</b> <br /> 21 Lower Kent Ridge Rd, Blk H2 #02-05,
          Singapore 119077
        </IonText>
        <br />
        <br />
        <IonAlert
          isOpen={open}
          onDidDismiss={() => setOpen(false)}
          header={"Are you sure you want to cancel this appointment?"}
          buttons={[
            {
              text: "No",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                setOpen(false);
                setConfirm(true);
              },
            },
            {
              text: "Yes",
              handler: () => {
                setOpen(false);
                handleDelete();
              },
            },
          ]}
        />
        <IonAlert
          isOpen={confirm}
          onDidDismiss={() => setConfirm(false)}
          header={"Appointment deleted!"}
          buttons={[
            {
              text: "Ok",
              handler: () => {
                setConfirm(false);
                history.goBack();
              },
            },
          ]}
        />
        <IonToast
          isOpen={errorMsg.length > 0}
          message={errorMsg}
          onDidDismiss={() => setErrorMsg("")}
          color="danger"
          duration={2000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default ViewAppointment;
