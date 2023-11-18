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
import { invoiceApi, patientApi, transactionApi, subsidyApi } from "../../api/Api";

interface Subsidy {
	subsidyId: number;
	subsidyNehrId: string;
	subsidyRate: number;
	itemTypeEnum: string;
	minDOB: string;
	sex: string;
	race: string;
	nationality: string;
	subsidyName?: string;
	subsidyDescription?: string;
}

const Subsidies: React.FC = () => {
	const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
	const storedUsername = localStorage.getItem("username") || "";
	const history = useHistory();
	const fetchSubsidies = async () => {
		try {
			const response = await subsidyApi.findAllSubsidiesOfPatient(storedUsername);
			setSubsidies(response.data);
		} catch (error) {
			console.error('Error fetching subsidies: ', error);
		}
	};

	const getChipData = (type: string) => {
		switch (type) {
			case "INPATIENT":
				return { label: "Inpatient", color: "primary" };
			case "OUTPATIENT":
				return { label: "Outpatient", color: "secondary" };
			case "MEDICINE":
				return { label: "Medicine", color: "success" };
			default:
				return { label: type, color: "medium" };
		}
	};

	function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
		setTimeout(() => {
		  fetchSubsidies();
		  event.detail.complete();
		}, 1000);
	  }

	useEffect(() => {
		fetchSubsidies();
	}, []);

	return (

		<IonPage>

			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/tabs/ehr"></IonBackButton>
					</IonButtons>

					<IonTitle>Subsidies</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
					<IonRefresherContent></IonRefresherContent>
				</IonRefresher>
				{subsidies.length === 0 ? (
					<div
					style={{
					    display: "flex",
					    justifyContent: "center",
					    alignItems: "center",
					    height: "100vh",
					    flexDirection: "column",
					    backgroundColor: "#f4f4f4", // Light gray background
					}}
				    >
					<h2 style={{ marginTop: "10px", color: "#555" }}>No subsidies available.</h2>
				    </div>) : (
					<IonList>
						{subsidies.map(subsidy => (
							<IonItem key={subsidy.subsidyId}>
								<IonLabel>
									<h2>{subsidy.subsidyName}</h2>
									{subsidy.subsidyDescription && (
										<p>Subsidy Description: {subsidy.subsidyDescription}</p>
									)}
									<p>Subsidy Rate: {subsidy.subsidyRate * 100} %</p>
									{subsidy.itemTypeEnum && (
										<IonChip color={getChipData(subsidy.itemTypeEnum).color}>
											{getChipData(subsidy.itemTypeEnum).label}
										</IonChip>
									)}								</IonLabel>
							</IonItem>
						))}
					</IonList>
				)}
			</IonContent>
		</IonPage>
	);
};

export default Subsidies;