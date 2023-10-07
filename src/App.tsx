import { Redirect, Route, useHistory, useLocation } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import { useEffect, useState } from "react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login";
import AddNextOfKin from "./pages/ehr/AddNextOfKin";
import EnterNric from "./pages/Register/EnterNric";
import CreateEhr from "./pages/Register/CreateEhr";
import CreatePatientAccount from "./pages/Register/CreatePatientAccount";
import Confirmation from "./pages/Register/Confirmation";
import Home from "./pages/home/index";
import Settings from "./pages/settings/index";
import ChangePassword from "./pages/settings/ChangePassword";
import Appointments from "./pages/appointments";
import SelectDepartment from "./pages/appointments/SelectDepartment";
import SelectDateTime from "./pages/appointments/SelectDateTime";
import ViewAppointment from "./pages/appointments/ViewAppointment";
import EHR from "./pages/ehr";
import GeneralInformation from "./pages/ehr/GeneralInformation";
import EditSelectDateTime from "./pages/appointments/EditSelectDateTime";

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const routes = [
    {
      path: "/register/enter-nric",
      component: <EnterNric />,
    },
    {
      path: "/register/create-ehr",
      component: <CreateEhr />,
    },
    {
      path: "/register/create-patient-account",
      component: <CreatePatientAccount />,
    },
    {
      path: "/register/confirmation",
      component: <Confirmation />,
    },
    {
      path: "/home",
      component: <Home />,
    },
    {
      path: "/ehr",
      component: <EHR />,
    },
    {
      path: "/ehr/next-of-kin",
      component: <AddNextOfKin />,
    },
    {
      path: "/ehr/general-information",
      component: <GeneralInformation />,
    },
    {
      path: "/settings",
      component: <Settings />,
    },
    {
      path: "/settings/change-password",
      component: <ChangePassword />,
    },
    {
      path: "/appointments",
      component: <Appointments />,
    },
    {
      path: "/appointments/:id",
      component: <ViewAppointment />,
    },
    {
      path: "/appointments/select-department",
      component: <SelectDepartment />,
    },
    {
      path: "/appointments/select-date-time/:selectedDepartment",
      component: <SelectDateTime />,
    },
    {
      path: "/appointments/:id/edit",
      component: <EditSelectDateTime />,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    window.addEventListener("storage", () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            {isAuthenticated ? <Home /> : <Login />}
          </Route>
          <Route exact path="/login">
            {!isAuthenticated ? <Login /> : <Home />}
          </Route>
          {/* <Route exact path="/home">
            {isAuthenticated ? <Home /> : <Login />}
          </Route>
          <Route exact path="/register/enter-nric">
            <EnterNric />
          </Route>
          <Route exact path="/register/create-ehr">
            <CreateEhr />
          </Route>
          <Route exact path="/register/create-patient-account">
            <CreatePatientAccount />
          </Route>
          <Route exact path="/register/add-next-of-kin">
            <AddNextOfKin />
          </Route>
          <Route exact path="/register/confirmation">
            <Confirmation />
          </Route> */}
          {routes.map((route) => (
            <Route exact path={route.path}>
              {isAuthenticated || route.path.split("/")[1] === "register" ? (
                route.component
              ) : (
                <Login />
              )}
            </Route>
          ))}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
