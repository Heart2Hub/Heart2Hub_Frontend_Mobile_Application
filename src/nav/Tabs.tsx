import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  document,
  ellipse,
  grid,
  home,
  settings,
  square,
  triangle,
} from "ionicons/icons";
import Home from "../pages/home";
import Appointments from "../pages/appointments";
import EHR from "../pages/ehr";
import Settings from "../pages/settings";
import ViewAppointment from "../pages/appointments/ViewAppointment";
import SelectDepartment from "../pages/appointments/SelectDepartment";
import SelectDateTime from "../pages/appointments/SelectDateTime";
import EditSelectDateTime from "../pages/appointments/EditSelectDateTime";
import GeneralInformation from "../pages/ehr/GeneralInformation";
import AddNextOfKin from "../pages/ehr/AddNextOfKin";
import ChangePassword from "../pages/settings/ChangePassword";
import Problems from "../pages/ehr/Problems";
import MedicalHistory from "../pages/ehr/MedicalHistory";
import Services from "../pages/services";
import Finance from "../pages/finance";

const routes = [
  {
    path: "/tabs/home",
    component: <Home />,
  },
  {
    path: "/tabs/services",
    component: <Services />,
  },
  {
    path: "/tabs/services/appointments",
    component: <Appointments />,
  },
  {
    path: "/tabs/services/appointments/select-department",
    component: <SelectDepartment />,
  },
  {
    path: "/tabs/services/appointments/view/:id",
    component: <ViewAppointment />,
  },
  {
    path: "/tabs/services/appointments/select-date-time/:selectedDepartment",
    component: <SelectDateTime />,
  },
  {
    path: "/tabs/services/appointments/edit/:id",
    component: <EditSelectDateTime />,
  },
  {
    path: "/tabs/services/finance",
    component: <Finance />,
  },
  {
    path: "/tabs/ehr",
    component: <EHR />,
  },
  {
    path: "/tabs/ehr/general-information",
    component: <GeneralInformation />,
  },
  {
    path: "/tabs/ehr/next-of-kin",
    component: <AddNextOfKin />,
  },
  {
    path: "/tabs/ehr/problems",
    component: <Problems />,
  },
  {
    path: "/tabs/ehr/medical-history",
    component: <MedicalHistory />,
  },
  {
    path: "/tabs/settings",
    component: <Settings />,
  },
  {
    path: "/tabs/settings/change-password",
    component: <ChangePassword />,
  },
  // {
  //   path: "/tabs/finance",
  //   component: <Finance />,
  // },
];

const Tabs: React.FC<any> = ({ isAuthenticated }) => (
  <IonTabs>
    <IonRouterOutlet>
      <Redirect exact path="/tabs" to="/tabs/home" />
      {routes.map((route) => (
        <Route exact path={route.path} key={route.path}>
          {isAuthenticated ? route.component : <Redirect to="/" />}
        </Route>
      ))}
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/tabs/home">
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="services" href="/tabs/services">
        <IonIcon icon={grid} />
        <IonLabel>Services</IonLabel>
      </IonTabButton>
      {/* <IonTabButton tab="appointments" href="/tabs/appointments">
        <IonIcon icon={grid} />
        <IonLabel>Appointments</IonLabel>
      </IonTabButton> */}
      <IonTabButton tab="ehr" href="/tabs/ehr">
        <IonIcon icon={document} />
        <IonLabel>EHR</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/tabs/settings">
        <IonIcon icon={settings} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

Tabs.defaultProps = {
  isAuthenticated: false, // Set the default value here
};

export default Tabs;
