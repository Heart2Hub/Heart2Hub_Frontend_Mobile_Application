import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonChip,
	IonGrid,
	IonRow,
	IonCol,
	IonItemDivider,
	IonBackButton,
	IonModal,
	IonInput,
	IonImg,
	IonFooter,
	IonButtons,
	IonText,
	IonLabel,
	IonItem,
	IonIcon,
	IonRouterOutlet,
	IonTabBar,
	IonButton,
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
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import React, { useEffect, useState, } from "react";
import { Route, Redirect, useHistory, useLocation, useParams } from "react-router";
import { invoiceApi, patientApi, transactionApi } from "../../api/Api";
import { FaSadTear } from "react-icons/fa";


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

interface Transaction {
	transactionId: number;
	transactionDate: string;
	transactionAmount: number;
	approvalStatusEnum: string;
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

interface CheckoutProps {
	amount: number; // Define the type for the 'amount' prop
}

const InvoiceDetails: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
	const history = useHistory();
	const { id } = useParams<{ id: string }>();
	const { state } = useLocation<Invoice>();
	const [insuranceClaim, setInsuranceClaim] = useState<InsuranceClaim[]>([]);
	const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);

	const [medishieldClaim, setMedishieldClaim] = useState<MedishieldClaim[]>([]);
	const [transactionItem, setTransactionItem] = useState<TransactionItem[]>([]);
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [transactionDetails, setTransactionDetails] = useState<Transaction | null>(null);

	const [toastOpen, setToastOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [toastType, setToastType] = useState('');

	const handleToastClose = () => {
		setToastOpen(false);
	};

	const handleCloseTransactionModal = () => {
		setShowTransactionModal(false);
	};

	const fetchTransactionDetails = async () => {
		try {
			const response = await transactionApi.findTransactionWithInvoice(Number(id));
			setTransactionDetails(response.data);
			console.log(response)
			setShowTransactionModal(true);
		} catch (error) {
			console.error('Error fetching transaction details: ', error);
		}
	};

	const fetchInsuranceClaim = async () => {
		try {
			const response = await invoiceApi.findMedishieldClaimOfInvoice(Number(id));
			setInsuranceClaim(response.data);
			console.log(response.data)
		} catch (error) {
			console.error("Error fetching invoices: ", error);
		}
	};

	const fetchMedishieldClaim = async () => {
		try {
			const response = await invoiceApi.findInsuranceClaimOfInvoice(Number(id));
			setMedishieldClaim(response.data);
			console.log(response.data)

		} catch (error) {
			console.error("Error fetching invoices: ", error);
		}
	};
	const fetchTransactionClaim = async () => {
		try {
			const response = await invoiceApi.findTransactionItemOfInvoice(Number(id));
			setTransactionItem(response.data);
			console.log(response.data)

		} catch (error) {
			console.error("Error fetching invoices: ", error);
		}
	};

	useEffect(() => {
		fetchInsuranceClaim();
		fetchMedishieldClaim();
		fetchTransactionClaim();
	}, []);

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

	const formatTransactionDate = (dateArray: string) => {
		const year = dateArray[0];
		const month = dateArray[1];
		const day = dateArray[2];

		// Format the date in the desired format
		return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
	};

	const handleToken = async (token: any) => {
		console.log(token);
		console.log(transactionItem.reduce((total, item) => total + item.transactionItemPrice, 0));

		try {


			try {
				const response2 = await axios.post(
					'http://localhost:8080/api/payment/charge', '',
					{
						headers: {
							Authorization: "Bearer " + localStorage.getItem("accessToken"),
							token: token.id,
							amount: transactionItem.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0)
						},
					}
				);

				console.log(response2.data);
				console.log('Payment Success');
			} catch (error) {
				// Type assertion to treat the error object as 'any'
				if ((error as any).response && (error as any).response.status === 400) {
					const errorMessage = (error as any).response.data;

					// Check if the error message contains the specified string
					if (errorMessage.includes("Error Encountered: Your card was declined")) {

						const total = transactionItem.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0);

						const response = await transactionApi.createFailedTransaction(Number(id), total);
						console.log(response.data);

						console.log('Card Declined Error:', errorMessage);

						setToastType('error');
						setToastMessage('Payment Failed, Please try again!');

						setToastOpen(true);

					} else {
						const total = transactionItem.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0);

						const response = await transactionApi.createTransaction(Number(id), total);
						console.log(response.data);

						history.push('/tabs/services/finance');

						setToastType('success');
						setToastMessage('Payment Successful!');

						setToastOpen(true);
					}
				} else {
					console.log('Payment Error: ', error);
				}
			}
		} catch (error) {
			console.log('Error outside axios request:', error);
		}
	};


	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/tabs/services/finance"></IonBackButton>
					</IonButtons>
					<IonTitle>Invoice Details</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonCard>
					<IonCardHeader>
						Invoice ID: {state?.invoiceId}
					</IonCardHeader>
					<IonCardContent>
						<p>Amount: ${state?.invoiceAmount.toFixed(2)}</p>
						<p>Due Date: {state?.invoiceDueDate}</p>
						<IonChip color={getStatusColor(state?.invoiceStatusEnum)}>
							<IonLabel>Status: {state?.invoiceStatusEnum}</IonLabel>
						</IonChip>

						<div>
							<IonGrid>
								<IonRow>
									<IonCol size="12">
										<IonList>
											<IonItemDivider>Product and Services</IonItemDivider>
											{transactionItem
												.filter((item) => item.transactionItemPrice >= 0)
												.map((item: TransactionItem) => (
													<IonItem key={item.transactionItemId}>
														<IonLabel>
															<h2>{item.transactionItemName}</h2>
															<p>
																Quantity: {item.transactionItemQuantity} | Total Price: ${(
																	item.transactionItemPrice * item.transactionItemQuantity
																).toFixed(2)}
															</p>
														</IonLabel>
													</IonItem>
												))}
										</IonList>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol size="12">
										<IonList>
											<IonItemDivider>Claims and Subsidies</IonItemDivider>
											{transactionItem
												.filter((item) => item.transactionItemPrice < 0)
												.map((item) => (
													<IonItem key={item.transactionItemId}>
														<IonLabel>
															<h2>{item.transactionItemName}</h2>
															<p>
																${item.transactionItemPrice.toFixed(2)}
															</p>
														</IonLabel>
													</IonItem>
												))}
										</IonList>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol size="12" class="ion-text-end">
										<IonText>
											<h3>
												<strong>Total Amount Payable:</strong> $
												{transactionItem.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0).toFixed(2)}
											</h3>
										</IonText>
									</IonCol>
								</IonRow>
							</IonGrid>
						</div>
						{state?.invoiceStatusEnum === 'UNPAID' && (
							<div className="App">
								<StripeCheckout
									stripeKey="pk_test_51O7JiaLsRgAdoykUXHQQVFQPZDxlatzA1LF6rBUQnY9awP4khMBHKRqY4T27YVvemrsz8VKwhzpG32SSGhyFIzk100p1E172jk" // Replace with your Stripe publishable key
									token={handleToken}
									amount={transactionItem.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0) * 100} // Convert to cents
								/>
							</div>
						)}
						{state?.invoiceStatusEnum === 'PAID' && (
							<IonButton expand="full" onClick={fetchTransactionDetails}>
								View Transaction
							</IonButton>
						)}
						<IonModal isOpen={showTransactionModal} onDidDismiss={() => setShowTransactionModal(false)}>
							<IonContent className="ion-padding">
								<IonList lines="full">
									{transactionDetails ? (
										<>
											<IonItem>
												<IonLabel>
													<h3>Transaction ID:</h3>
													<p>{transactionDetails.transactionId}</p>
												</IonLabel>
											</IonItem>
											<IonItem>
												<IonLabel>
													<h3>Transaction Date:</h3>
													<p>{formatTransactionDate(transactionDetails.transactionDate)}</p>
												</IonLabel>
											</IonItem>
											<IonItem>
												<IonLabel>
													<h3>Transaction Amount:</h3>
													<p>${transactionDetails.transactionAmount.toFixed(2)}</p>
												</IonLabel>
											</IonItem>
											<IonItem>
												<IonLabel>
													<h3>Status:</h3>
													<IonChip color={getChipColor(transactionDetails.approvalStatusEnum)}>
														{transactionDetails.approvalStatusEnum}
													</IonChip>
												</IonLabel>
											</IonItem>
										</>
									) : (
											<div
												style={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													// height: "100vh",
													flexDirection: "column",
													backgroundColor: "#f4f4f4", // Light gray background
												}}
											>
												<FaSadTear style={{ fontSize: "3em", color: "#999" }} /> {/* Sad face icon */}
												<h2 style={{ marginTop: "10px", color: "#555" }}>Invoice was paid by Claims/Subsidies</h2>
											</div>
									)}
								</IonList>
								<IonButton expand="full" onClick={handleCloseTransactionModal}>
									Close
								</IonButton>
							</IonContent>
						</IonModal>
						<IonToast
							isOpen={toastOpen}
							onDidDismiss={handleToastClose}
							message={toastMessage}
							color={toastType === 'success' ? 'success' : 'danger'}
							duration={3000}
						/>
					</IonCardContent>
				</IonCard>
			</IonContent>
		</IonPage>
	);
};

export default InvoiceDetails;
