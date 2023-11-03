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
			const response = await invoiceApi.getAllTransactionsOfPatientMobile(username);
			setInvoices(response.data);
		} catch (error) {
			console.error("Error fetching invoices: ", error);
		}
	};


	// useEffect(() => {
	// 	getPatientDetails();
	// }, []);
	useEffect(() => {
		getPatientDetails();
		if (patient) { // Add a conditional check for the patient object
			fetchInvoices(patient.username);
		}
	}, [patient]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Invoice Records</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonList>
					{invoices.map((invoice) => (
						<IonItem key={invoice.invoiceId} >
							<IonLabel>
								<h2>Invoice ID: {invoice.invoiceId}</h2>
								<p>Amount: {invoice.invoiceAmount}</p>
								<p>Due Date: {invoice.invoiceDueDate}</p>
								<p>Status: {invoice.invoiceStatusEnum}</p>
							</IonLabel>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	);
};
export default Finance;