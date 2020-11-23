import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import '@app/app.css';
import { getKeycloakInstance } from './auth/keycloakAuth';
import { Loading } from './components/Loading';
import { AuthContext } from './auth/AuthContext';

let keycloak: any;

const App: React.FunctionComponent = () => {

  const [initialized, setInitialized] = React.useState(false);

  // Initialize the client
  React.useEffect(() => {
    const init = async () => {
      keycloak = await getKeycloakInstance();
      if (keycloak) {
        await keycloak?.loadUserProfile();
      }
      setInitialized(true);
    }
    init();
  }, []);

  if (!initialized) return <Loading />;

  // TODO - index doing router is not desired.
  // Split to App.tsx etc.
  return (
    <AuthContext.Provider value={{ keycloak, profile: keycloak?.profile }}>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </AuthContext.Provider>
  );
}
export { App };
