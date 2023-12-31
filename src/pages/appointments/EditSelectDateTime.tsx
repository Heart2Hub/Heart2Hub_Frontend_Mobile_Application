import React, { useEffect, useRef, useState } from "react";
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
  IonDatetime,
  IonGrid,
  IonCol,
  IonModal,
  IonAlert,
  IonToast,
} from "@ionic/react";
import {
  personCircle,
  logOut,
  repeat,
  checkmarkCircleOutline,
  time,
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
  shiftApi,
  staffApi,
} from "../../api/Api";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import dayjs from "dayjs";

type Props = {};

interface Staff {
  staffId: number;
  firstname: string;
  lastname: string;
  username: string;
  shifts: Shift[];
  listOfAssignedAppointments?: Appointment[];
}

interface Shift {
  startTime: string;
  endTime: string;
}

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
  listOfStaffsId: number[];
}

interface TimeSlotMap {
  timeslot: string;
  staffs: Staff[];
}
const EditSelectDateTime = () => {
  const history = useHistory();
  const location = useLocation();
  const today = dayjs();
  const { state } = useLocation<Appointment>();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    state?.department
  );
  const [staffList, setStaffList] = useState<Array<Staff>>([]);
  const [availableStaffList, setAvailableStaffList] = useState<Array<Staff>>(
    []
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().toISOString()
  );
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>("");
  const [selectedDoctorUsername, setSelectedDoctorUsername] =
    useState<string>("");
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [slotsMap, setSlotsMap] = useState<TimeSlotMap[]>([]);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleDateSelect = (event: CustomEvent) => {
    setSelectedDate(event.detail.value);
    getAvailabilities(event.detail.value);
  };

  const getAvailabilities = (dateStr: string) => {
    const date = new Date(dateStr);
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth();
    const selectedDay = date.getDate();
    const availableStaff = staffList.filter((staff) => {
      const staffShifts = staff.shifts.filter((shift) => {
        const shiftStartTime = new Date(shift.startTime);
        const shiftEndTime = new Date(shift.endTime);
        const shiftStartYear = shiftStartTime.getFullYear();
        const shiftStartMonth = shiftStartTime.getMonth();
        const shiftStartDay = shiftStartTime.getDate();

        const shiftEndYear = shiftEndTime.getFullYear();
        const shiftEndMonth = shiftEndTime.getMonth();
        const shiftEndDay = shiftEndTime.getDate();

        // Compare the extracted date components
        const isShiftOnSelectedDate =
          selectedYear === shiftStartYear &&
          selectedMonth === shiftStartMonth &&
          selectedDay === shiftStartDay &&
          selectedYear === shiftEndYear &&
          selectedMonth === shiftEndMonth &&
          selectedDay === shiftEndDay;

        const isShiftBetween8AMAnd4PM =
          shiftStartTime.getHours() >= 8 && shiftEndTime.getHours() <= 16;

        return isShiftOnSelectedDate && isShiftBetween8AMAnd4PM;
      });
      // Check if staff has shifts on the selected date
      return staffShifts.length > 0;
    });
    setAvailableStaffList(availableStaff);
  };

  const getStaffListByRole = async () => {
    try {
      const response = await staffApi.getStaffListByRole(
        "DOCTOR",
        selectedDepartment
      );
      const staffs = response.data;
      for (let i = 0; i < staffs.length; i++) {
        const rosterResponse = await shiftApi.viewOverallRoster(
          staffs[i].username
        );
        const shifts: Shift[] = rosterResponse.data;
        staffs[i].shifts = shifts;
      }
      setStaffList(staffs);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAppointments = async () => {
    try {
      const response = await appointmentApi.viewAllAppointmentsByRange(
        Number(today.format("D")),
        Number(today.format("M")),
        Number(today.format("YYYY")),
        31,
        12,
        2025,
        selectedDepartment
      );
      setAllAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  function generateAvailableTimeSlots(
    staff: Staff,
    selectedDate: string
  ): Shift[] {
    const selectedDateObj = new Date(selectedDate);
    const staffShifts = staff.shifts.filter((shift) => {
      const shiftStartTime = new Date(shift.startTime);
      const shiftEndTime = new Date(shift.endTime);

      // Extract the hours from the shift start and end times
      const shiftStartHours = shiftStartTime.getHours();
      const shiftEndHours = shiftEndTime.getHours();

      // Check if the shift falls on the selected date
      const isShiftOnSelectedDate =
        selectedDateObj.getDate() === shiftStartTime.getDate() &&
        selectedDateObj.getMonth() === shiftStartTime.getMonth() &&
        selectedDateObj.getFullYear() === shiftStartTime.getFullYear();

      // Check if the shift is between 8 AM and 4 PM
      const isShiftBetween8AMAnd4PM =
        shiftStartHours >= 8 && shiftEndHours <= 16;

      return isShiftOnSelectedDate && isShiftBetween8AMAnd4PM;
    });

    if (staffShifts.length === 0) {
      return []; // No available time slots if no shifts on the selected date
    }

    // Sort staff shifts by start time to determine the earliest and latest shift
    staffShifts.sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    const earliestShiftStartTime = new Date(staffShifts[0].startTime);
    const latestShiftEndTime = new Date(
      staffShifts[staffShifts.length - 1].endTime
    );

    const availableTimeSlots: Shift[] = [];
    const startTime = new Date(earliestShiftStartTime);
    const endTime = new Date(latestShiftEndTime);

    while (startTime < endTime) {
      let slotEndTime = new Date(startTime);
      slotEndTime.setHours(startTime.getHours() + 1);

      // Check if the time slot falls within any staff shift
      const slotWithinShift = staffShifts.some((shift) => {
        const shiftStartTime = new Date(shift.startTime);
        const shiftEndTime = new Date(shift.endTime);
        return startTime >= shiftStartTime && slotEndTime <= shiftEndTime;
      });

      // Check if staff has any existing appointments during this time
      const slotHasAppointment = allAppointments.some((appointment) => {
        const appointmentStartTime = new Date(
          Number(appointment.bookedDateTime[0]),
          Number(appointment.bookedDateTime[1]) - 1,
          Number(appointment.bookedDateTime[2]),
          Number(appointment.bookedDateTime[3]),
          Number(appointment.bookedDateTime[4])
        );
        const appointmentEndTime = new Date(appointmentStartTime);
        appointmentEndTime.setHours(appointmentEndTime.getHours() + 1);
        return (
          startTime >= appointmentStartTime &&
          slotEndTime <= appointmentEndTime &&
          appointment.listOfStaffsId &&
          appointment.listOfStaffsId.length > 0 &&
          appointment.listOfStaffsId[0] == staff.staffId
          // appointment.currentAssignedStaffId === staff.staffId
        );
      });

      if (
        startTime.getFullYear() == new Date().getFullYear() &&
        startTime.getMonth() == new Date().getMonth() &&
        startTime.getDate() == new Date().getDate()
      ) {
        console.log("same day so skip");
      } else if (slotWithinShift && !slotHasAppointment) {
        availableTimeSlots.push({
          startTime: startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: slotEndTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      startTime.setHours(startTime.getHours() + 1);
    }

    return availableTimeSlots;
  }

  function compareTimeslots(a: TimeSlotMap, b: TimeSlotMap) {
    if (a.timeslot.slice(-2) === "AM" || a.timeslot.slice(-2) === "PM") {
      // Extract start times and convert to 24-hour format for comparison
      const time1 = convertTo24Hour(a.timeslot.split(" - ")[0]);
      const time2 = convertTo24Hour(b.timeslot.split(" - ")[0]);

      // Compare the start times
      if (time1 < time2) {
        return -1;
      } else {
        return 1;
      }
    } else {
      const timeA = parseInt(a.timeslot.substring(0, 4), 10);
      const timeB = parseInt(b.timeslot.substring(0, 4), 10);

      return timeA - timeB; // Compare and sort by start time
    }
  }

  function convertTo24Hour(timeString: string) {
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  const getSlotsStaffMap = () => {
    let timeslotToStaff: TimeSlotMap[] = [];
    availableStaffList.map((staff) =>
      generateAvailableTimeSlots(staff, selectedDate).map((slot) => {
        const slotTime = slot.startTime + " - " + slot.endTime;
        const existingObj = timeslotToStaff.find(
          (obj: TimeSlotMap) => obj.timeslot === slotTime
        );
        if (existingObj) {
          existingObj.staffs.push(staff);
        } else {
          timeslotToStaff.push({ timeslot: slotTime, staffs: [staff] });
        }
      })
    );
    setSlotsMap(timeslotToStaff.sort(compareTimeslots));
  };

  const handleTimeSlotSelection = (staffs: Staff[], slot: string) => {
    const randomIndex = Math.floor(Math.random() * staffs.length);
    const staff = staffs[randomIndex];
    setSelectedTimeslot(slot);
    setSelectedDoctorUsername(staff.username);
    setShowConfirmationAlert(true);
  };

  const convertToDate = (dateString: string, timeString: string) => {
    let startTime = timeString.split("-")[0].trim();
    // need to convert to 24 hr
    if (startTime.slice(-2) === "PM") {
      let hr = Number(startTime.slice(0, 2));
      if (hr != 12) {
        hr += 12;
      }
      startTime = hr + ":00";
    } else if (startTime.slice(-2) === "AM") {
      let hr = startTime.slice(0, 2);
      startTime = hr + ":00";
    }
    const origDateTime = dayjs(dateString).format("YYYY-MM-DD");
    const newDateStr = `${origDateTime}T${startTime}:00`;
    return newDateStr;
  };

  const formatDate = (dateTime: string[]) => {
    if (!dateTime) return "";
    const d = dayjs()
      .year(Number(dateTime[0]))
      .month(Number(dateTime[1]) - 1)
      .date(Number(dateTime[2]))
      .hour(Number(dateTime[3]))
      .minute(Number(dateTime[4]));
    return d.format("DD/MM/YYYY HH:mm");
  };

  function checkApptTimeSlots(appts: Appointment[], startTime: Date) {
    for (let i = 0; i < appts.length; i++) {
      let appt = appts[i];
      let date = appt.bookedDateTime.toString();

      if (dayjs(date).toDate() === startTime) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (staffList.length === 0) getStaffListByRole();
    else getSlotsStaffMap();
    getAllAppointments();
    // getAvailabilities(new Date().toISOString());
  }, [location.key, selectedDate]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Update Appointment</IonTitle>
          <IonButtons slot="end"></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLabel style={{ fontSize: "20px" }}>
          <b>Current timeslot: {formatDate(state?.bookedDateTime)}</b>
        </IonLabel>
        <br />
        <IonLabel style={{ fontSize: "18px" }}>
          <u>Department: {selectedDepartment}</u>
        </IonLabel>
        <br />
        <br />
        <IonDatetime
          presentation="date"
          firstDayOfWeek={1}
          onIonChange={handleDateSelect}
          min={new Date().toISOString().split("T")[0]}
          value={selectedDate}
        >
          <span slot="title">Select an Appointment Date</span>
        </IonDatetime>
        <br />
        {slotsMap.map((slot, index) => (
          <IonCol key={index}>
            <IonButton
              fill="outline"
              style={{ width: "45%", fontSize: "12px" }}
              key={index}
              onClick={() =>
                handleTimeSlotSelection(slot.staffs, slot.timeslot)
              }
            >
              {slot.timeslot}
            </IonButton>
          </IonCol>
        ))}
        {availableStaffList.length === 0 ||
        selectedDate == dayjs().toISOString() ? (
          <IonText>No timeslots available today!</IonText>
        ) : null}
        <IonAlert
          isOpen={showConfirmationAlert}
          onDidDismiss={() => setShowConfirmationAlert(false)}
          header={`Update Timeslot`}
          subHeader={`${dayjs(selectedDate).format(
            "DD/MM/YYYY"
          )}, ${selectedTimeslot}`}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                setShowConfirmationAlert(false);
              },
            },
            {
              text: "Confirm",
              handler: async (data: any) => {
                try {
                  const username = localStorage.getItem("username") ?? "";
                  const response = await appointmentApi.updateAppointment(
                    state?.appointmentId,
                    data.reason,
                    convertToDate(selectedDate, selectedTimeslot),
                    username,
                    selectedDoctorUsername
                  );
                  if (response.status === 200) {
                    data.reason = "";
                    setConfirm(true);
                  }
                } catch (error: any) {
                  if (
                    error.response.data &&
                    error.response.data ===
                      "Unable to update appointment, overlapping appointment exists."
                  ) {
                    setError(error.response.data);
                  } else if (error.response.data) {
                    console.log(error);
                    data.reason = "";
                    setConfirm(true);
                  }
                }

                setShowConfirmationAlert(false);
              },
            },
          ]}
          inputs={[
            {
              name: "reason",
              type: "textarea",
              placeholder: "Reason for appointment (Max 200 words)",
              attributes: {
                maxlength: 200,
                rows: 5,
              },
            },
          ]}
        />
        <IonAlert
          isOpen={confirm}
          onDidDismiss={() => setConfirm(false)}
          header={"Appointment updated!"}
          buttons={[
            {
              text: "Ok",
              handler: () => {
                history.push("/tabs/services/appointments", { message: "" });
                setConfirm(false);
                setSelectedDate(dayjs().toISOString());
              },
            },
          ]}
        />
        <IonToast
          isOpen={error.length > 0}
          message={error}
          onDidDismiss={() => setError("")}
          color="danger"
          duration={3000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default EditSelectDateTime;
