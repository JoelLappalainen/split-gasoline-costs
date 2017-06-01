import React, { Component } from "react";
import styled, { css } from "styled-components";
import debounce from "lodash.debounce";
import Results from "../Results";

// TODO: refactor this into more manageable pieces...

// Sanitize number string so that parseFloat works properly
// => decimal numbers have to use dot instead of comma
const sanitize = num => num.replace(",", ".");

const initialState = {
  passengerCount: 2,
  searchResults: [],
  gasolinePrice: "",
  consumption: "",
  chosenToValue: "",
  chosenFromValue: "",
  showTo: false,
  showFrom: false,
  showResults: false,
  chosenFrom: null,
  chosenTo: null,
  distance: null,
  totalPrice: null,
  errors: {
    chosenFrom: false,
    chosenTo: false
  }
};

class Form extends Component {
  constructor(props) {
    super(props);

    // Add these to `this` instead of state since we dont want to
    // re-create them every time the state changes
    this.gApi = props.google; // TODO: This might not be needed
    this.gDistance = new props.google.maps.DistanceMatrixService();
    this.gAutocomplete = new props.google.maps.places.AutocompleteService();

    this.state = initialState;
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

  // NOTE:Second parameter is a callback function
  // that is called after the state is updated
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

  // NOTE: Second parameter is a callback function
  // that is called after the state is updated
  addTo = item => {
    this.setState({ chosenTo: item, chosenToValue: item.description }, () => {
      if (this.state.chosenFrom) {
        this.calculateDistance();
      }
    });
  };

  // NOTE: The empty array here is the default parameter if we don't supply it
  updateDistance = ({ rows = [] }) => {
    if (rows.length) {
      this.setState({ distance: rows[0].elements[0].distance });
    }
  };

  calculateDistance = (from, to) => {
    const { chosenFrom, chosenTo } = this.state;

    if (chosenFrom && chosenTo) {
      const idFrom = chosenFrom.place_id;
      const idTo = chosenTo.place_id;

      // Request distance from api
      this.gDistance.getDistanceMatrix(
        {
          origins: [{ placeId: idFrom }],
          destinations: [{ placeId: idTo }],
          travelMode: "DRIVING"
        },
        this.updateDistance // <-- this is the callback
      );
    } else {
      // TODO: handle showing of error messages to the user
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
    const totalPrice = distance.value / 100000 * consumptionNum * gasPriceNum;
    this.setState({ totalPrice, showResults: true });
  };

  hideResults = () => {
    this.setState({ showResults: false });
  };

  updateSearchResults = predictions => {
    if (predictions) {
      this.setState({ searchResults: predictions });
    }
  };

  // eg. "showFrom", "chosenFrom"
  handleInputBlur = (autocompleteOpen, predicate) => {
    setTimeout(() => {
      this.setState({ [autocompleteOpen]: false }, () => {
        if (!this.state[predicate]) {
          this.setState(prevState => ({
            errors: { ...prevState.errors, [predicate]: true }
          }));
        } else {
          this.setState(prevState => ({
            errors: { ...prevState.errors, [predicate]: false }
          }));
        }
      });
    }, 100);
  };

  resetForm = e => {
    e.preventDefault();
    this.setState({ ...initialState });
  };

  searchPlacesDebounced = debounce(word => {
    if (word) {
      // Get address predictions from api
      this.gAutocomplete.getPlacePredictions(
        {
          input: word,
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "fi" }
        },
        this.updateSearchResults // <-- this is the callback
      );
    }
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
      consumption,
      errors,
      showResults,
      chosenTo,
      chosenFrom
    } = this.state;

    console.log("state", this.state);

    const isValid = chosenFrom && chosenTo && gasolinePrice && consumption;

    return (
      <FormWrapper autoComplete="off">

        <Label>
          Mistä?

          {/* NOTE: we are adding a small timeout to the blur handler to keep
            * the onClick handler responsive to clicks
            */}
          <Input
            name="chosenFromValue"
            value={chosenFromValue}
            onChange={this.handleChange}
            onFocus={() => this.setState({ showFrom: true })}
            onBlur={() => this.handleInputBlur("showFrom", "chosenFrom")}
            error={errors.chosenFrom}
          />

          {showFrom &&
            <Autocomplete>
              {searchResults.map(item => (
                <Item
                  onClick={() => {
                    this.addFrom(item);
                    this.setState({ searchResults: [] });
                  }}
                  key={item.place_id}
                >
                  {item.description}
                </Item>
              ))}
            </Autocomplete>}
        </Label>

        <Label>
          Mihin?

          {/* NOTE: we are adding a small timeout to the blur handler to keep
            * the onClick handler responsive to clicks
            */}
          <Input
            name="chosenToValue"
            value={chosenToValue}
            onChange={this.handleChange}
            onFocus={() => this.setState({ showTo: true })}
            onBlur={() => this.handleInputBlur("showTo", "chosenTo")}
            error={errors.chosenTo}
          />

          {showTo &&
            <Autocomplete>
              {searchResults.map(item => (
                <Item
                  onClick={() => {
                    this.addTo(item);
                    this.setState({ searchResults: [] });
                  }}
                  key={item.place_id}
                >
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

        <CalculateButton
          type="button"
          disabled={!isValid}
          onClick={this.calculateTotalPrice}
        >
          SPLITTAA!
        </CalculateButton>

        <Results
          visible={showResults}
          totalPrice={totalPrice}
          passengerCount={passengerCount}
          handleHide={this.hideResults}
          handleReset={this.resetForm}
        />
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
  margin-bottom: 24px;
  position: relative;
  font-family: ${props => props.theme.mainFontFamily};
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
  ${props => props.error && `border-color: ${props.theme.errorColor}`};
  ${props => props.error && `background-color: ${props.theme.errorColorLight}`};

  &:focus {
    outline: none;
    box-shadow: inset 0px 0px 4px ${props => props.theme.mainColor};
  }
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
  font-size: 28px;
  border-radius: 3px;
  color: white;
  border: none;
  padding: 12px 16px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1.6px;
  background-color: ${props => props.theme.mainColor};
  font-family: ${props => props.theme.mainFontFamily};
  ${props => props.disabled && css`
    opacity: 0.4;
    background-color: #eee;
    color: #ccc;
    pointer-events: none;
    cursor: not-allowed;
  `};

  &:active {
    background-color: ${props => props.theme.mainColorDarker};
  }
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
  font-size: 14px;
`;

const SplittedPrice = styled.div`
  margin-top: 16px;
  font-size: 24px;
  font-weight: 700;
`;

export default Form;
