// import React, { useEffect, useState } from "react";
// import {
//   IonContent,
//   IonHeader,
//   IonPage,
//   IonTitle,
//   IonToolbar,
//   IonInput,
//   IonImg,
//   IonButton,
//   IonFooter,
// } from "@ionic/react";
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
//   Sidebar,
//   Search,
//   ConversationList,
//   Conversation,
//   ConversationHeader,
//   MessageSeparator,
//   TypingIndicator,
// } from "@chatscope/chat-ui-kit-react";
// import { timerOutline } from "ionicons/icons";
// import { Route, Redirect, useHistory, useLocation } from "react-router";
// import { appointmentApi, patientApi, staffApi } from "../../api/Api";
// import dayjs from "dayjs";
// import { Socket, io } from 'socket.io-client';
// import { DefaultEventsMap } from "@socket.io/component-emitter";


// interface Staff {
//   firstname: string;
//   lastname: string;
//   unit: {
//     unitId: number;
//     name: string;
//   };
// }

// interface ChatMessage {
//   chatMessageId: number,
//   senderId: number,
//   timestamp: string,
//   content: string,
//   messageTypeEnum: string
// }

// interface Conversation {
//   conversationId: number,
//   listOfChatMessages: ChatMessage[]
// }

// type Patient = {
//   patientId: number,
//   firstName: string;
//   lastName: string;
//   profilePicture: string;
//   sex: string;
//   electronicHealthRecordId: number;
//   nric: string;
//   username: string;
// };

// var socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

// const ChatPage = () => {
//   const storedUsername = localStorage.getItem("username");
//   const history = useHistory();
//   const [patient, setPatient] = useState<Patient>();
//   const [inputMessage, setInputMessage] = useState<string>("");
//   const [selectedConversation, setSelectedConversation] = useState<Conversation>();

//   const connect = () => {
//     socket = io('http://localhost:4000');
//     // socket.emit('newUser', socket.id);
//   };

//   const handleSendMessage = () => {
//     if (socket != null) {
//       socket.emit('message', {
//         content: inputMessage,
//         senderId: patient?.patientId,
//         conversationId: selectedConversation?.conversationId,
//         timestamp: new Date(),
//         socketID: socket.id,
//         randomId: Math.random()
//       });
//       setInputMessage("")
//     }
//   }
  
//   const onPrivateMessage = (payload: any) => {
//     setSelectedConversation((prevConversation: any) => {
//       const updatedConversation = { ...prevConversation };
//       updatedConversation.listOfChatMessages = [
//         ...updatedConversation.listOfChatMessages,
//         payload,
//       ];
//       return updatedConversation;
//     });
//     // setNewPayload(payload)
// };

//   useEffect(() => {
//     const getPatientDetails = async () => {
//       try {
//         const response = await patientApi.getAllPatients();
//         const patients = response.data;
//         const currPatient = patients.filter(
//           (patient: any) => patient.username === storedUsername
//         )[0];
//         //console.log(currPatient);
//         setPatient(currPatient);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getPatientDetails();
//   }, []);

//   useEffect(() => {
//     try {
//       if (patient) {
//         connect();
//         if (socket) {
//           socket.on('messageResponse', (data) => onPrivateMessage(data));

//           return () => {
//             if (socket) socket.disconnect();
//           }; 
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, [[patient]]);
  

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle className="ion-text-center" style={{ height: "80px" }}>
//             <b>Chat</b>
//           </IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent className="ion-padding">
//         <IonButton expand="full" shape="round" onClick={() => console.log("hey")}>
//           Start chat
//         </IonButton>
//         <br />
//         <ChatContainer>
//             <ConversationHeader>
//               <ConversationHeader.Back />
//               <ConversationHeader.Content
//                 userName="Heart2Hub Helpline"
//                 info={selectedStaff ? 
//                   allStaffs.filter(staff => staff.staffId == selectedStaff)[0].staffRoleEnum + " (" + allStaffs.filter(staff => staff.staffId == selectedStaff)[0].unit.name + ")"
//                    : "N/A"}
//               />
//               <ConversationHeader.Actions>
//               </ConversationHeader.Actions>
//             </ConversationHeader>
//             <MessageList
//             >
//               {selectedConversation?.listOfChatMessages?.map((message =>
//               <>
//                 <Message
//                   key={message.chatMessageId ? message.chatMessageId : message.randomId}
//                   model={{
//                     message: message.content,
//                     sentTime: "10:00",
//                     sender: "xxx",
//                     direction: message.senderId == selectedStaff ? "incoming" : "outgoing",
//                     position: "single",
//                   }}
//                 ></Message>
//                 <Message.Header sentTime={formatTime(message.timestamp)}/>
//                 {/* <p style={{fontSize: '12px', float: message.senderId != selectedStaff ? 'right' : null, marginBottom: '5px'}}>time</p> */}
//               </>))}

//             </MessageList>
//             <MessageInput
//               placeholder="Type message here"
//               value={inputMessage}
//               onChange={(newMessage) => setInputMessage(newMessage)}
//               onSend={handleSendMessage}
//             />
//           </ChatContainer>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default ChatPage;
