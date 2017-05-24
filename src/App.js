import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import logo from './logo.svg';
import theme from './theme';
import Form from './components/Form';
import './App.css';

class App extends Component {
  state = {
    initDone: false,
  }

  componentWillMount() {
    if (!window.google) {
      this.googleApiLoader = setInterval(
        () => this.checkIfGoogleApiExists(),
        500
      );
    } else {
      this.setState({ initDone: true });
    }
  }

  checkIfGoogleApiExists = () => {
    if (window.google) {
      this.setState({ initDone: true });
      clearInterval(this.googleApiLoader);
    }
  }

  render() {
    const { initDone } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header>
            <AppIcon className="ion-model-s" />
          </Header>

          {initDone
            ? <Form google={window.google} />
            : <div>Ladataan...</div>
          }
        </div>
      </ThemeProvider>
    );
  }
}

const Header = styled.div`
  height: 60px;
  width: 100%;
  background-color: ${props => props.theme.mainColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const AppIcon = styled.i`
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: white;
  font-size: 32px;
  color: ${props => props.theme.mainColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default App;
