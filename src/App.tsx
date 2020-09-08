import React from 'react';

import GlobalStyle from './styles/global';

// import SignIn from './pages/Sigin/index';
import SignUp from './pages/SignUp/index';

const App: React.FC = () => (
  <>
    <SignUp />
    <GlobalStyle />
  </>
);

export default App;
