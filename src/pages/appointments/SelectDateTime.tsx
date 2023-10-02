import React, { useEffect, useRef, useState } from 'react'
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
  } from "@ionic/react";
import Navbar from '../navbar/index';
import { personCircle, logOut, repeat, checkmarkCircleOutline } from 'ionicons/icons';
import { Route, Redirect, useHistory, useParams } from 'react-router';
import { appointmentApi, departmentApi, shiftApi, staffApi } from '../../api/Api';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import * as dayjs from 'dayjs'

type Props = {}

interface Staff {
  staffId: number,
  firstname: string,
  lastname: string,
  username: string,
  shifts: Shift[]
}

interface Shift {
  startTime: string,
  endTime: string
}

interface Appointment {
  description: string,
  comments: string,
  actualDateTime: string[],
  currentAssignedStaffId: number,
  staffDetails: Staff
}
const SelectDateTime = () => {

    const history = useHistory();
    const today = dayjs();
    const { selectedDepartment } = useParams<{ selectedDepartment: string }>();
    const [staffList, setStaffList] = useState<Array<Staff>>([]);
    const [availableStaffList, setAvailableStaffList] = useState<Array<Staff>>([]); 
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().toISOString());
    const [selectedTimeslot, setSelectedTimeslot] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [selectedDoctorUsername, setSelectedDoctorUsername] = useState<string>('');
    const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

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
            shiftStartTime.getHours() >= 8 &&
            shiftEndTime.getHours() <= 16;

          return isShiftOnSelectedDate && isShiftBetween8AMAnd4PM;
        });
        // Check if staff has shifts on the selected date
        return staffShifts.length > 0;
      });
      setAvailableStaffList(availableStaff);
    }

    const getStaffListByRole = async () => {
      try {
        const response = await staffApi.getStaffListByRole("DOCTOR", selectedDepartment);
        const staffs = response.data;
        for (let i=0; i<staffs.length; i++) {
          const rosterResponse = await shiftApi.viewOverallRoster(staffs[i].username);
          const shifts: Shift[] = rosterResponse.data;
          staffs[i].shifts = shifts;
        }
        setStaffList(staffs);
      } catch (error) {
        console.log(error)
      }
    }

    const getAllAppointments = async () => {
      try {
        const response = await appointmentApi.viewAllAppointmentsByRange(Number(today.format('D')), Number(today.format('M')), Number(today.format('YYYY')), 31, 12, 2025, selectedDepartment)
        setAllAppointments(response.data);
      } catch (error) {
        console.log(error)
      }
    }

    function generateAvailableTimeSlots(staff: Staff, selectedDate: string): Shift[] {
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
        const isShiftBetween8AMAnd4PM = shiftStartHours >= 8 && shiftEndHours <= 16;

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
      const latestShiftEndTime = new Date(staffShifts[staffShifts.length - 1].endTime);
    
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
          return (
            startTime >= shiftStartTime &&
            slotEndTime <= shiftEndTime
          );
        });

        // Check if staff has any existing appointments during this time
        const slotHasAppointment = allAppointments.some((appointment) => {
          const appointmentStartTime = new Date(
            Number(appointment.actualDateTime[0]), Number(appointment.actualDateTime[1])-1, Number(appointment.actualDateTime[2]),
            Number(appointment.actualDateTime[3]), Number(appointment.actualDateTime[4]));
          const appointmentEndTime = new Date(appointmentStartTime);
          appointmentEndTime.setHours(appointmentEndTime.getHours() + 1);
          return (
            startTime >= appointmentStartTime && slotEndTime <= appointmentEndTime && appointment.currentAssignedStaffId === staff.staffId
          );
        });
    
        if (slotWithinShift && !slotHasAppointment) {
          availableTimeSlots.push({
            startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
    
        startTime.setHours(startTime.getHours() + 1);
      }
    
      return availableTimeSlots;
    }

    const handleTimeSlotSelection = (staff: Staff, slot: Shift) => {
      setSelectedTimeslot(slot.startTime + " - " + slot.endTime);
      setSelectedDoctor(staff.firstname + " " + staff.lastname)
      setSelectedDoctorUsername(staff.username)
      setShowConfirmationAlert(true);
    }

    const convertToDate = (dateString: string, timeString: string) => {
      const startTime = timeString.split('-')[0].trim();
      const origDateTime = dayjs(dateString).format('YYYY-MM-DD');
      const newDateStr = `${origDateTime}T${startTime}:00`
      return newDateStr;
    }

    useEffect(() => {
      getStaffListByRole();
      getAllAppointments();
      getAvailabilities(new Date().toISOString());
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
          <IonLabel style={{ fontSize: "20px",}}><b>2. Select a timeslot</b></IonLabel><br/>
          <IonLabel style={{ fontSize: "18px",}}><u>Department: {selectedDepartment}</u></IonLabel><br/><br/>
          <IonDatetime 
            presentation="date" 
            firstDayOfWeek={1}
            onIonChange={handleDateSelect}
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}>
            <span slot="title">Select an Appointment Date</span>
          </IonDatetime>
          {availableStaffList.map((staff) => (
            <div key={staff.staffId}>
              <h5>Dr. {staff.firstname} {staff.lastname}</h5>
              <IonGrid>
                {generateAvailableTimeSlots(staff, selectedDate).map((slot, index) => (
                  <IonCol>
                    <IonButton 
                      fill="outline" 
                      style={{ width: '40%'}} 
                      key={index}
                      onClick={() => handleTimeSlotSelection(staff, slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </IonButton>
                  </IonCol>
                ))}
              </IonGrid>
            </div>
          ))}
          {availableStaffList.length === 0 ? 
          <IonText>No timeslots available today!</IonText> : null}
          <IonAlert
              isOpen={showConfirmationAlert}
              onDidDismiss={() => setShowConfirmationAlert(false)}
              header= {`Confirm Timeslot with Dr ${selectedDoctor}`}
              subHeader={`${dayjs(selectedDate).format('DD/MM/YYYY')}, ${selectedTimeslot}`}
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    setShowConfirmationAlert(false);
                  },
                },
                {
                  text: 'Confirm',
                  handler: async (data: any) => {
                    try {
                      const username = localStorage.getItem('username') ?? '';
                      const response = await appointmentApi.createAppointment(data.reason, convertToDate(selectedDate,selectedTimeslot), dayjs().add(8, 'hours').toISOString().slice(0, dayjs().toISOString().length-2), 'LOW', username, selectedDepartment, selectedDoctorUsername);
                      console.log(response)
                      if (response.status === 200) {
        
                        history.push('/appointments', { successMessage: "Appointment successfully booked!"})
                      }
                    } catch (error) {
                      console.log(error)
                    }
                    setShowConfirmationAlert(false);
                  },
                },
              ]}
              inputs={[
                {
                  name: 'reason',
                  type: 'textarea',
                  placeholder: 'Reason for appointment (Max 200 words)',
                  attributes: {
                    maxlength: 200,
                    rows: 5
                  },
                },
              ]}
            />
          </IonContent>
          <Navbar />
        </IonPage>
      );
}

export default SelectDateTime;