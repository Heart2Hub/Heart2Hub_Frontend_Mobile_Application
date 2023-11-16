import React, { useEffect, useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
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
  IonList,
  IonItem,
  IonText,
  IonIcon,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  MessageSeparator,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { timerOutline } from "ionicons/icons";
import { Route, Redirect, useHistory, useLocation, useParams } from "react-router";
import { appointmentApi, chatApi, patientApi, staffApi } from "../../api/Api";
import dayjs from "dayjs";
import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from "@socket.io/component-emitter";
import './index.css'
import { send } from 'ionicons/icons';


interface Staff {
  staffId: number,
  firstname: string;
  lastname: string;
  staffRoleEnum: string,
  unit: {
    unitId: number;
    name: string;
  };
}

interface ChatMessage {
  chatMessageId: number,
  senderId: number,
  timestamp: string,
  content: string,
  randomId: string,
  messageTypeEnum: string
}

interface Conversation {
  conversationId: number,
  listOfChatMessages: ChatMessage[]
}

type Patient = {
  patientId: number,
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

var socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

const ChatPage = () => {
  const storedUsername = localStorage.getItem("username");
  const history = useHistory();
  const { unit } = useParams<{ unit: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [staff, setStaff] = useState<Staff>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newPayload, setNewPayload] = useState<string>("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [noStaffAvailable, setNoStaffAvailable] = useState(false);

  const connect = () => {
    socket = io('http://localhost:4000', { transports : ['websocket']});
    // socket.emit('newUser', socket.id);
  };

  const handleSendMessage = () => {
    if (socket != null) {
      socket.emit('message', {
        content: inputMessage,
        senderId: patient?.electronicHealthRecordId,
        conversationId: selectedConversation?.conversationId,
        token: localStorage.getItem("accessToken"),
        timestamp: new Date(),
        socketID: socket.id,
        randomId: Math.random()
      });
      setInputMessage("")
    }
  }
  
  const onPrivateMessage = (payload: any) => {
    setSelectedConversation((prevConversation: any) => {
      if (prevConversation.conversationId === payload.conversationId) {
        const updatedConversation = { ...prevConversation };
        updatedConversation.listOfChatMessages = [
          ...updatedConversation.listOfChatMessages,
          payload,
        ];
        return updatedConversation;
      } else {
        return prevConversation;
      }
    
  });
    setNewPayload(payload)
  };

  const handleChange = (e: CustomEvent) => {
    // Handle input changes here
    setInputMessage(e.detail.value);
  };

  const getStaffsWorkingInCurrentShiftAndDepartment = async (unit: string, id: number) => {
    try {
      const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(unit);
      const admins = response.data.filter((staff: Staff) => staff.staffRoleEnum === "ADMIN");
      if (admins.length === 0) {
        setNoStaffAvailable(true);
      }
      setStaff(admins[0]);
      try {
        let hasExisting = false;
        const convos = await chatApi.getPatientConversation(id);
        if (Object.keys(convos.data).length > 0) {
          for (const [key, value] of Object.entries(convos.data)) {
            if (key == admins[0].staffId) {
              setSelectedConversation(value as Conversation);
              hasExisting = true;
              break;
            }
          }
        }
        if (Object.keys(convos.data).length === 0 || !hasExisting) {
          const newConvo = await chatApi.createPatientConversation(id, admins[0].staffId);
          setSelectedConversation(newConvo.data)
        }
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formatTime = (dateTime: string) => {
    if (dateTime.charAt(dateTime.length-1) === 'Z') {
      return dayjs(dateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY HH:mm')
    } else {
      return dayjs(dateTime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')
    }
  }

  useEffect(() => {
    const getPatientDetails = async () => {
      try {
        const response = await patientApi.getAllPatients();
        const patients = response.data;
        const currPatient = patients.filter(
          (patient: any) => patient.username === storedUsername
        )[0];
        getStaffsWorkingInCurrentShiftAndDepartment(unit, currPatient.electronicHealthRecordId);
        setPatient(currPatient);
      } catch (error) {
        console.log(error);
      }
    };
    if (!patient) getPatientDetails();
  }, [patient]);

  useEffect(() => {
    try {
      if (patient) {
        connect();
        if (socket) {
          socket.on('messageResponse', (data) => onPrivateMessage(data));

          return () => {
            if (socket) socket.disconnect();
          }; 
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [patient]);
  
  useEffect(() => {

  }, [newPayload])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs/services"></IonBackButton>
        </IonButtons>
          <IonTitle>
            <b>Chat Assistance</b>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText style={{ color: 'grey', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {staff ? `You are matched with ADMIN ${staff?.firstname + " " + staff?.lastname}` : 
          noStaffAvailable ? "No staff on duty today :(" : "Please be patient as we are matching you with our staff"}
        </IonText>
      <IonList>
          {selectedConversation && selectedConversation.listOfChatMessages?.map((convo, index) => (
            <div key={index}>
              <div className={convo.senderId == patient?.electronicHealthRecordId ? 'sent-message' : 'received-message'} key={convo.chatMessageId ? convo.chatMessageId : convo.randomId}>
                {convo.content}
              </div><br/><br/>
              <div className="time" style={{ float: convo.senderId == patient?.electronicHealthRecordId ? 'right' : 'left'}}>
                {formatTime(convo.timestamp)}
              </div>
            </div>
          ))}
        </IonList>
      </IonContent>
      <IonFooter >
      <IonItem lines="none">
        {staff ? 
        <>
          <IonInput
            placeholder="Type your message..."
            value={inputMessage}
            onIonInput={handleChange}
          />
          <IonButton fill="clear" onClick={handleSendMessage}>
            <IonIcon icon={send} slot="icon-only" />
          </IonButton>
          </> : noStaffAvailable ? "" : "Matching you to our staff..."}
        </IonItem>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;
