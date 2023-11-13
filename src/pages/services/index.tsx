import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";import { useHistory } from 'react-router-dom'; // Assuming that you're using React Router
import { arrowForward, informationCircleOutline, people } from "ionicons/icons";
import { useState } from "react";


const Services: React.FC = () => {
  const history = useHistory();
  const [showDepartment, setShowDepartment] = useState(false);
  return (
<IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center" style={{ height: "80px" }}>
            <b>My Electronic Health Record</b>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonCard onClick={() => history.push("/tabs/services/appointments")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>My Appointments</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard onClick={() => history.push("/tabs/services/finance")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>My Invoices</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div style={{ height: "5px" }}></div>
          <IonCard onClick={() => history.push("/tabs/services/transaction")}>
            <IonCardContent>
              <IonItem lines="none" style={{ fontSize: "18px" }}>
                <IonLabel>My Transactions</IonLabel>
                <IonIcon icon={arrowForward} slot="end"></IonIcon>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonList>
        <IonButton 
          style={{ position: 'fixed', left:0,right:0, bottom:'10px', marginLeft: '10%', marginRight: '10%'}}
          onClick={() => setShowDepartment(true)}>
          Chat with us!
        </IonButton>
      </IonContent>
      <IonAlert
          isOpen={showDepartment}
          onDidDismiss={() => setShowDepartment(false)}
          header={`Select Unit`}
          subHeader={`Indicate which unit you need assistance from, so that we can better assist you!`}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                setShowDepartment(false);
              },
            },
            {
              text: "Confirm",
              handler: async (data: any) => {
                try {
                  console.log(data)
                  history.push(`/tabs/services/chat/${data}`)
                } catch (error: any) {
                  console.log(error)
                }

                setShowDepartment(false);
              },
            },
          ]}
          inputs={[
            {
              label: "Cardiology",
              type: "radio",
              value: "Cardiology"
            },
            {
              label: "Orthopedics",
              type: "radio",
              value: "Orthopedics"
            },
            {
              label: "Pediatrics",
              type: "radio",
              value: "Pediatrics"
            },
            {
              label: "Emergency Medicine",
              type: "radio",
              value: "Emergency Medicine"
            },
            {
              label: "Surgery",
              type: "radio",
              value: "Surgery"
            },
            {
              label: "Ophthalmology",
              type: "radio",
              value: "Ophthalmology"
            },
            {
              label: "Psychiatry",
              type: "radio",
              value: "Psychiatry"
            },
            {
              label: "Radiology",
              type: "radio",
              value: "Radiology"
            },
            {
              label: "Pharmacy",
              type: "radio",
              value: "Pharmacy"
            }
          ]}
        />
    </IonPage>
     );
    };
 
export default Services;
