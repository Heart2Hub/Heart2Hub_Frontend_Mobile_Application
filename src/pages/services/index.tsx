import {
  IonAvatar,
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


const Services: React.FC = () => {
  const history = useHistory();
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
      </IonContent>
    </IonPage>
     );
    };
 
export default Services;
