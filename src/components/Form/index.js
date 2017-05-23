import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import debounce from "lodash.debounce";

import { GOOGLE_API_KEY } from "../../constants";

const fetchOptions = {
  mode: "no-cors"
};

class Form extends Component {
  state = {
    passengerCount: 2,
    searchResults: [],
    showFrom: false,
    showTo: false
  };

  addPassenger = () => {
    this.setState(prevState => ({
      passengerCount: Math.min(prevState.passengerCount + 1, 9)
    }));
  };

  removePassenger = () => {
    this.setState(prevState => ({
      passengerCount: Math.max(prevState.passengerCount - 1, 1)
    }));
  };

  searchPlaces = term => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${term}&types=geocode&language=fi&key=${GOOGLE_API_KEY}`
      )
      .then(({ data }) => this.setState({ searchResults: data.predictions }));
  };

  render() {
    const { passengerCount, searchResults, showFrom, showTo } = this.state;

    return (
      <FormWrapper>

        <Label>
          Mistä?
          <Input
            onChange={({ target }) => this.searchPlaces(target.value)}
            onFocus={() => this.setState({ showFrom: true })}
            onBlur={() => this.setState({ showFrom: false })}
          />
          {showFrom &&
            <Autocomplete>
              {searchResults.map(item => <Item>{item.description}</Item>)}
            </Autocomplete>}
        </Label>

        <Label>
          Mihin?
          <Input
            onChange={({ target }) => this.searchPlaces(target.value)}
            onFocus={() => this.setState({ showTo: true })}
            onBlur={() => this.setState({ showTo: false })}
          />
          {showTo &&
            <Autocomplete>
              {searchResults.map(item => <Item>{item.description}</Item>)}
            </Autocomplete>}
        </Label>

        <Label>
          Bensan hinta?
          <Input />
        </Label>

        <PassengerCountControl>
          <IconButton
            className="ion-ios-minus-outline"
            onClick={this.removePassenger}
          />
          <PassengerCount>
            {passengerCount}
          </PassengerCount>
          <IconButton
            className="ion-ios-plus-outline"
            onClick={this.addPassenger}
          />
        </PassengerCountControl>

        <CalculateButton>
          Split!
        </CalculateButton>

      </FormWrapper>
    );
  }
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  position: relative;
`;

const Input = styled.input`
  margin-top: 8px;
  font-size: 18px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  color: ${props => props.theme.mainColor};
`;

const PassengerCountControl = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  margin-bottom: 24px; 
`;

const IconButton = styled.i`
  font-size: 40px;
  color: ${props => props.theme.mainColor};

  &:active {
    color: black;
  }
`;
const PassengerCount = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const CalculateButton = styled.button`
  font-size: 24px;
  border-radius: 3px;
  background-color: ${props => props.theme.mainColor};
  color: white;
  border: none;
  padding: 12px 16px;
  text-align: center;
`;

const Autocomplete = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  transform: translateY(100%);
  background-color: white;
  box-shadow: 0px 2px 16px rgba(0,0,0,0.2);
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  z-index: 999;
`;

const Item = styled.li`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

export default Form;
