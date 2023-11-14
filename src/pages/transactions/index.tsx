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
	IonSelect,
	IonSelectOption,
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
import { invoiceApi, patientApi, transactionApi } from "../../api/Api";

interface Invoice {
	invoiceId: number;
	invoiceAmount: number;
	invoiceDueDate: string;
	invoiceStatusEnum: string;
	// transaction: Transaction | null; // Add the Transaction type or null if it can be null
	// patient: Patient; // Assuming that a patient is always associated with an invoice
}


interface Transaction {
	transactionId: number;
	transactionDate: string;
	transactionAmount: number;
	approvalStatusEnum: string;
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

const Transaction: React.FC = () => {
	const storedUsername = localStorage.getItem("username") || "";
	const history = useHistory();
	const [patient, setPatient] = useState<Patient>();
	const [transaction, setTransactions] = useState<Transaction[]>([]);
	const [sortBy, setSortBy] = useState<"earliest" | "latest">("latest");
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const sortTransactions = (transactions: Transaction[]) => {
		if (sortBy === "earliest") {
			return [...transactions].sort((a, b) => {
				const dateA = a.transactionDate.split("/");
				const dateB = b.transactionDate.split("/");
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
			return [...transactions].sort((a, b) => {
				const dateA = a.transactionDate.split("/");
				const dateB = b.transactionDate.split("/");
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


	const filteredAndSortedTransactions = () => {
		let filtered = transaction;
		if (statusFilter) {
			filtered = filtered.filter((item) => item.approvalStatusEnum === statusFilter);
		}
		return sortTransactions(filtered);
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

	const fetchInvoicesEarliest = async (username: string) => {
		try {
			const response = await transactionApi.getAllTransactionsOfPatientMobile(username);
			console.log(response.data)
			const formattedTransactions = response.data.map((transaction: Transaction) => {
				const dateArray = transaction.transactionDate;
				const year = dateArray[0];
				const month = dateArray[1];
				const day = dateArray[2];

				// Format the date in the desired format
				const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
				return {
					...transaction,
					transactionDate: formattedDate,
				};
			});
			setTransactions(formattedTransactions);
		} catch (error) {
			console.error("Error fetching invoices: ", error);
		}
	};

	const fetchInvoices = async (username: string) => {
		try {
			const response = await transactionApi.getAllTransactionsOfPatientMobile(username);
			console.log(response.data)
			const formattedTransactions = response.data.map((transaction: Transaction) => {
				const dateArray = transaction.transactionDate;
				const year = dateArray[0];
				const month = dateArray[1];
				const day = dateArray[2];

				// Format the date in the desired format
				const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
				return {
					...transaction,
					transactionDate: formattedDate,
				};
			});
			setTransactions(formattedTransactions);
		} catch (error) {
			console.error("Error fetching invoices: ", error);
		}
	};
	const getChipColor = (status: string) => {
		switch (status) {
			case 'APPROVED':
				return 'success';
			case 'PENDING':
				return 'warning';
			case 'REJECTED':
				return 'danger';
			default:
				return 'medium';
		}
	};

	const formatDueDate = (dueDateArray: number[]) => {
		const date = new Date(dueDateArray[0], dueDateArray[1] - 1, dueDateArray[2]);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
	      
		return `${day}/${month}/${year}`;
	      };

	const handleTransactionClick = async (transaction: Transaction) => {
		const invoiceId = await transactionApi.findInvoiceUsingTransaction(transaction.transactionId); // Implement this function
		console.log(invoiceId)
		const response = await invoiceApi.findInvoice(invoiceId.data);
		const invoice = response.data;
		console.log(response.data)
		const formattedDueDate = formatDueDate(invoice?.invoiceDueDate);

		history.push(
			`/tabs/services/finance/invoice/${invoice?.invoiceId}`,
			{
			  invoiceId: invoice?.invoiceId,
			  invoiceAmount: invoice?.invoiceAmount,
			  invoiceDueDate: formattedDueDate,
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
					<IonTitle>My Transactions</IonTitle>
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
						<IonSelectOption value="APPROVED">Approved</IonSelectOption>
						<IonSelectOption value="PENDING">Pending</IonSelectOption>
						<IonSelectOption value="REJECTED">Rejected</IonSelectOption>
					</IonSelect>
				</IonToolbar>
				<IonList>
					{filteredAndSortedTransactions().map((item) => (
						<IonItem
							key={item.transactionId}
							button  // Enable the item as a clickable button
							onClick={() => handleTransactionClick(item)}
						>
							<IonLabel>
								<h2>Transaction ID: {item.transactionId}</h2>
								<p>Amount: ${item.transactionAmount.toFixed(2)}</p>
								<p>Transaction Date: {item.transactionDate}</p>
								<p>
									Status:
									<IonChip color={getChipColor(item.approvalStatusEnum)}>
										{item.approvalStatusEnum}
									</IonChip>
								</p>
							</IonLabel>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default Transaction;
