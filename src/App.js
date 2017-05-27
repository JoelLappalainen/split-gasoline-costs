import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import "./App.css";

// Assets, constants
import theme from "./theme";
import { GOOGLE_API_INTEVAL, SPLASH_DELAY } from "./constants";

// Components
import Form from "./components/Form";
import Splashscreen from "./components/Splashscreen";

class App extends Component {
  state = {
    initDone: false,
    splashVisible: true
  };

  componentWillMount() {
    if (!window.google) {
      this.googleApiLoader = setInterval(
        this.checkIfGoogleApiExists,
        GOOGLE_API_INTEVAL
      );
    } else {
      this.appReady();
    }
  }

  checkIfGoogleApiExists = () => {
    if (window.google) {
      this.appReady();
      clearInterval(this.googleApiLoader);
    }
  };

  appReady = () => {
    this.setState({ initDone: true });

    // Delay the showing of the content a bit to allow the user
    // to see the splash screen properly => feels more mobile app like
    setTimeout(() => this.setState({ splashVisible: false }), SPLASH_DELAY);
  };

  render() {
    const { initDone, splashVisible } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header>
            <AppIcon className="ion-model-s" moveIcon={splashVisible} />
          </Header>

          {initDone && <Form google={window.google} />}

          <Splashscreen visible={splashVisible} />
        </div>
      </ThemeProvider>
    );
  }
}

const Header = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: ${props => props.theme.mainColor};
`;

const AppIcon = styled.i`
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: white;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s cubic-bezier(.03, .83, .76, .98);
  transform: translateY(0px);
  color: ${props => props.theme.mainColor};
  z-index: ${props => props.theme.elevations.navbar};
  ${props => props.moveIcon && "transform: translateY(45vh) scale(2);"}
`;

export default App;
