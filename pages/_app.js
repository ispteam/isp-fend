import 'styles/globals.css';
import 'styles/landing.css';
import 'styles/navbar-style.css';
import 'styles/footer.css';
import 'styles/add-request.css';
import 'styles/requests.css';
import 'styles/profile.css';
import 'styles/login.css';
import 'styles/chart.css';
import 'styles/tables.css';
import 'styles/grid-layout.css';
import 'styles/clients.css';
import 'styles/modal-details.css';
import 'styles/admin-moderator-auth.css';
// import 'semantic-ui-css/semantic.min.css';
import {createWrapper} from 'next-redux-wrapper';
import store from '../stores/store';
import {Provider as ReduxProvider} from 'react-redux';


function MyApp({ Component, pageProps }) {
  return <ReduxProvider store={store}>
          <Component {...pageProps} />
        </ReduxProvider>
}

const makeStore = () => store;

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);