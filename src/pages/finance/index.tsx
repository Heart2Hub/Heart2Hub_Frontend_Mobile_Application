import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonChip,
  IonInput,
  IonBackButton,
  IonButtons,
  IonImg,
  IonButton,
  IonFooter,
  IonText,
  IonLabel,
  IonItem,
  IonSelectOption,
  IonSelect,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
  IonThumbnail,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { timerOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory, useLocation } from "react-router";
import { invoiceApi, patientApi } from "../../api/Api";

interface Invoice {
  invoiceId: number;
  invoiceAmount: number;
  invoiceDueDate: string;
  invoiceStatusEnum: string;
  // transaction: Transaction | null; // Add the Transaction type or null if it can be null
  insuranceClaim: InsuranceClaim | null; // Add the InsuranceClaim type or null if it can be null
  medishieldClaim: MedishieldClaim | null; // Add the MedishieldClaim type or null if it can be null
  // patient: Patient; // Assuming that a patient is always associated with an invoice
  listOfTransactionItem: TransactionItem[];
}
interface InsuranceClaim {
  insuranceClaimId: number;
  insuranceClaimDateApplied: string; // You might want to adjust the data type to match the date format you are using
  insuranceClaimAmount: number;
  insurerName: string;
  isPrivateInsurer: boolean;
}

interface MedishieldClaim {
  medishieldClaimId: number;
  medishieldClaimDateApplied: string; // You might want to adjust the data type to match the date format you are using
  medishieldClaimAmount: number;
  approvalStatusEnum: string; // Adjust the data type as necessary
}

interface TransactionItem {
  transactionItemId: number;
  transactionItemName: string;
  transactionItemDescription: string;
  transactionItemQuantity: number;
  transactionItemPrice: number;
}
type Patient = {
  patientId: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  sex: string;
  electronicHealthRecordId: number;
  nric: string;
  username: string;
};

const Finance: React.FC = () => {
  const storedUsername = localStorage.getItem("username") || "";
  const history = useHistory();
  const [patient, setPatient] = useState<Patient>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"earliest" | "latest">("latest");

  const sortInvoices = (invoicesToSort: Invoice[]) => {
    if (sortBy === "earliest") {
      return [...invoicesToSort].sort((a, b) => {
        const dateA = a.invoiceDueDate.split("/");
        const dateB = b.invoiceDueDate.split("/");
        const formattedDateA = new Date(
          parseInt(dateA[2]),
          parseInt(dateA[1]) - 1, // Months are 0 indexed
          parseInt(dateA[0])
        );
        const formattedDateB = new Date(
          parseInt(dateB[2]),
          parseInt(dateB[1]) - 1,
          parseInt(dateB[0])
        );
        return formattedDateA.getTime() - formattedDateB.getTime();
      });
    } else {
      return [...invoicesToSort].sort((a, b) => {
        const dateA = a.invoiceDueDate.split("/");
        const dateB = b.invoiceDueDate.split("/");
        const formattedDateA = new Date(
          parseInt(dateA[2]),
          parseInt(dateA[1]) - 1,
          parseInt(dateA[0])
        );
        const formattedDateB = new Date(
          parseInt(dateB[2]),
          parseInt(dateB[1]) - 1,
          parseInt(dateB[0])
        );
        return formattedDateB.getTime() - formattedDateA.getTime();
      });
    }
  };


  const filteredAndSortedInvoices = () => {
    let filtered = statusFilter ? invoices.filter((invoice) => invoice.invoiceStatusEnum === statusFilter) : invoices;
    return sortInvoices(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNPAID":
        return "danger";
      case "CLAIMS_IN_PROCESS":
        return "warning";
      case "PAID":
        return "success";
      default:
        return "medium";
    }
  };

  const getPatientDetails = async () => {
    try {
      const response = await patientApi.getAllPatients();
      const patients = response.data;
      const currPatient = patients.filter(
        (patient: any) => patient.username === storedUsername
      )[0];
      //console.log(currPatient);
      setPatient(currPatient);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInvoices = async (username: string) => {
    try {
      const response = await invoiceApi.findInvoicesOfAPatient(username);
      const formattedInvoices = response.data.map((invoice: Invoice) => {
        const dateArray = invoice.invoiceDueDate;
        const formattedDate = new Date(
          parseInt(dateArray[0]),
          parseInt(dateArray[1]) - 1, // Month is zero-indexed
          parseInt(dateArray[2]),
          parseInt(dateArray[3]),
          parseInt(dateArray[4]),
          parseInt(dateArray[5]),
          parseInt(dateArray[6])
        ).toLocaleDateString();
        return {
          ...invoice,
          invoiceDueDate: formattedDate,
        };
      });
      setInvoices(formattedInvoices);
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    }
  };

  const handleClickInvoice = (invoice: Invoice) => {
    history.push(
      `/tabs/services/finance/invoice/${invoice?.invoiceId}`,
      {
        invoiceId: invoice?.invoiceId,
        invoiceAmount: invoice?.invoiceAmount,
        invoiceDueDate: invoice?.invoiceDueDate,
        invoiceStatusEnum: invoice?.invoiceStatusEnum,
        listOfTransactionItem: invoice?.listOfTransactionItem,
        // arrived: invoice,
      }
    );
  };

  useEffect(() => {
    getPatientDetails();
  }, []);

  useEffect(() => {
    if (patient) {
      fetchInvoices(patient.username);
    }
  }, [patient]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/services"></IonBackButton>
          </IonButtons>
          <IonTitle>My Invoices</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonSegment value={sortBy} onIonChange={(e) => setSortBy(e.detail.value as "earliest" | "latest")}>
            <IonSegmentButton value="latest">
              <IonLabel>Latest</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="earliest">
              <IonLabel>Earliest</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonSelect
            value={statusFilter}
            placeholder="Select Status"
            onIonChange={(e) => setStatusFilter(e.detail.value)}
          >
            <IonSelectOption value={null}>All</IonSelectOption>
            <IonSelectOption value="UNPAID">Unpaid</IonSelectOption>
            <IonSelectOption value="CLAIMS_IN_PROCESS">Claims in Process</IonSelectOption>
            <IonSelectOption value="PAID">Paid</IonSelectOption>
          </IonSelect>
        </IonToolbar>
        <IonList>
          {filteredAndSortedInvoices().map((invoice) => (
            <IonItem
              key={invoice.invoiceId}
              button
              onClick={() => handleClickInvoice(invoice)}
            >
              <IonLabel>
                <h2>Invoice ID: {invoice.invoiceId}</h2>
                <p>Amount: ${invoice.invoiceAmount.toFixed(2)}</p>
                <p>Due Date: {invoice.invoiceDueDate}</p>
                <IonChip color={getStatusColor(invoice.invoiceStatusEnum)}>
                  <IonLabel>Status: {invoice.invoiceStatusEnum}</IonLabel>
                </IonChip>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Finance;
