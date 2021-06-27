import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import {Provider as ReduxProvider} from 'react-redux';
import {Provider as SessionProvider} from 'next-auth/client';
import {createWrapper} from 'next-redux-wrapper';
import store from '../stores/store';



function MyApp({ Component, pageProps }) {
  
  return <SessionProvider session={pageProps.session}>
              <ReduxProvider store={store}>
              <Component {...pageProps} />
              </ReduxProvider>
            </SessionProvider>
}


const makeStore = () => store;

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
