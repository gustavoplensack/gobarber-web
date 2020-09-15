import React from 'react';

import GlobalStyle from './styles/global';

import SignIn from './pages/SignIn/index';
// import SignUp from './pages/SignUp/index';

import AppProvider from './hooks';

const App: React.FC = () => (
  <AppProvider>
    <SignIn />
    <GlobalStyle />
  </AppProvider>
);

export default App;
