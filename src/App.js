import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import logo from './logo.svg';
import theme from './theme';
import Form from './components/Form';
import './App.css';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header>
            <AppIcon className="ion-model-s"/>
          </Header>
          <Form/>
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
