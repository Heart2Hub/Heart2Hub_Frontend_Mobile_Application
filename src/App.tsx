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
import Register1 from "./pages/Register1";
import Register2 from "./pages/Register2";
import Register from "./pages/Register";
import Register3 from "./pages/Register3";
import Home from "./pages/home/index";
import Settings from "./pages/settings/index";
import ChangePassword from "./pages/settings/ChangePassword";


setupIonicReact();

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const routes = [
      {
        "path": "/home",
        "component": <Home />
      },
      {
        "path": "/settings",
        "component": <Settings />
      },
      {
        "path": "/settings/change-password",
        "component": <ChangePassword />
      }
    ]

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    window.addEventListener("storage", () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    });
  }, [])

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
        <Route exact path="/home">
          {isAuthenticated ? <Home /> : <Login />}
        </Route>
        <Route exact path="/register/step-1">
          <Register1 />
        </Route>
        <Route exact path="/register/step-2">
          <Register2 />
        </Route>
        <Route exact path="/register/step-3">
          <Register3 />
        </Route>
        {routes.map(route => 
          <Route exact path={route.path}>
            {isAuthenticated ? route.component : <Login />}
          </Route>)}
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  );
}

export default App;
