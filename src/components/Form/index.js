import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import debounce from "lodash.debounce";

import { GOOGLE_API_KEY, GOOGLE_API_URL } from "../../constants";

const fetchOptions = {
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Acces-Control-Allow-Origin": "*"
  }
};

// Sanitize number string so that parseFloat works properly
const sanitize = num => num.replace(',', '.');

class Form extends Component {
  constructor(props) {
    super(props);

    // Add these to `this` instead of state since we dont want to re-create them
    // every time the state changes
    this.gApi = props.google;
    this.gDistance = new props.google.maps.DistanceMatrixService();
    this.gAutocomplete = new props.google.maps.places.AutocompleteService();

    this.state = {
      passengerCount: 2,
      searchResults: [],
      showFrom: false,
      showTo: false,
      chosenFromValue: "",
      chosenToValue: "",
      chosenFrom: null,
      chosenTo: null,
      distance: null,
      gasolinePrice: "",
      totalPrice: null,
      consumption: ""
    };
  }

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

  // second parameter is a callback function that is called after the state is updated
  addFrom = item => {
    this.setState(
      { chosenFrom: item, chosenFromValue: item.description },
      () => {
        if (this.state.chosenTo) {
          this.calculateDistance();
        }
      }
    );
  };

  // second parameter is a callback function that is called after the state is updated
  addTo = item => {
    this.setState({ chosenTo: item, chosenToValue: item.description }, () => {
      if (this.state.chosenFrom) {
        this.calculateDistance();
      }
    });
  };

  updateDistance = ({ rows = [] }) => {
    if (rows.length) {
      this.setState({ distance: rows[0].elements[0].distance });
    }
  }

  calculateDistance = (from, to) => {
    const { chosenFrom, chosenTo } = this.state;

    if (chosenFrom && chosenTo) {
      const idFrom = chosenFrom.place_id;
      const idTo = chosenTo.place_id;

      // Request distance from api
      this.gDistance.getDistanceMatrix({
        origins: [{ placeId: idFrom }],
        destinations: [{ placeId: idTo }],
        travelMode: 'DRIVING',
      }, this.updateDistance); // <-- this is the callback
    } else {
      console.log("error");
    }
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.searchPlacesDebounced(value);
  };

  calculateTotalPrice = () => {
    const { distance, gasolinePrice, consumption } = this.state;
    const consumptionNum = parseFloat(consumption);
    const gasPriceNum = parseFloat(gasolinePrice);
    const totalPrice = (distance.value / 100000) * consumptionNum * gasPriceNum;
    this.setState({ totalPrice });
  };

  updateSearchResults = predictions => {
    if (predictions) {
      this.setState({ searchResults: predictions });
    }
  }

  searchPlacesDebounced = debounce(word => {
    // Get address predictions from api
    this.gAutocomplete.getPlacePredictions({
      input: word,
      types: ['geocode'],
      componentRestrictions: { country: 'fi' },
    }, this.updateSearchResults); // <-- this is the callback
  }, 400);

  render() {
    const {
      passengerCount,
      searchResults,
      showFrom,
      showTo,
      distance,
      chosenToValue,
      chosenFromValue,
      gasolinePrice,
      totalPrice,
      consumption
    } = this.state;

    console.log('state', this.state);

    return (
      <FormWrapper>

        <Label>
          Mistä?
          <Input
            name="chosenFromValue"
            value={chosenFromValue}
            onChange={this.handleChange}
            onFocus={() => this.setState({ showFrom: true })}
            onBlur={() =>
              setTimeout(() => this.setState({ showFrom: false }), 100)}
          />
          {showFrom &&
            <Autocomplete>
              {searchResults.map(item => (
                <Item onClick={() => this.addFrom(item)} key={item.place_id}>
                  {item.description}
                </Item>
              ))}
            </Autocomplete>}
        </Label>

        <Label>
          Mihin?
          <Input
            name="chosenToValue"
            value={chosenToValue}
            onChange={this.handleChange}
            onFocus={() => this.setState({ showTo: true })}
            onBlur={() =>
              setTimeout(() => this.setState({ showTo: false }), 100)}
          />
          {showTo &&
            <Autocomplete>
              {searchResults.map(item => (
                <Item onClick={() => this.addTo(item)} key={item.place_id}>
                  {item.description}
                </Item>
              ))}
            </Autocomplete>}
        </Label>

        <TravelInfo>
          <Label w="100%">
            Bensan hinta?
            <Input
              w="100%"
              type="number"
              placeholder="€/l"
              value={gasolinePrice}
              onChange={({ target }) =>
                this.setState({ gasolinePrice: sanitize(target.value) })}
            />
          </Label>
          <div style={{ paddingRight: 24 }} />
          <Label w="100%">
            Kulutus?
            <Input
              w="100%"
              type="number"
              value={consumption}
              placeholder="l/100km"
              onChange={({ target }) =>
                this.setState({ consumption: sanitize(target.value) })}
            />
          </Label>
        </TravelInfo>

        {distance &&
          <Distance>
            <i className="ion-ios-location-outline" />&nbsp;{distance.text}
          </Distance>}

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

        <CalculateButton type="button" onClick={this.calculateTotalPrice}>
          SPLITTAA!
        </CalculateButton>

        {totalPrice !== null &&
          <SplittedPrice>
            {Number(totalPrice / passengerCount).toFixed(3)}&nbsp;€
          </SplittedPrice>}
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
  font-family: ${props => props.theme.mainFontFamily};
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  position: relative;
  ${props => props.w && `width: ${props.w}`};
`;

const Input = styled.input`
  margin-top: 8px;
  font-size: 18px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  color: ${props => props.theme.mainColor};
  ${props => props.w && `width: ${props.w}`};
`;

const TravelInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

const PassengerCountControl = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  margin-bottom: 24px; 
`;

const IconButton = styled.i`
  font-size: 56px;
  color: ${props => props.theme.mainColor};
  &:active {
    color: black;
  }
`;

const PassengerCount = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const Distance = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const CalculateButton = styled.button`
  font-family: ${props => props.theme.mainFontFamily};
  font-size: 28px;
  border-radius: 3px;
  background-color: ${props => props.theme.mainColor};
  color: white;
  border: none;
  padding: 12px 16px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1.6px;
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

const SplittedPrice = styled.div`
  margin-top: 16px;
  font-size: 24px;
  font-weight: 700;
`;

export default Form;
