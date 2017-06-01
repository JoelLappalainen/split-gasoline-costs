import React from "react";
import styled, { keyframes } from "styled-components";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import "./index.css";

const Results = ({
  visible,
  totalPrice,
  passengerCount,
  handleHide,
  handleReset
}) => {
  return (
    <CSSTransitionGroup
      component="div"
      transitionLeaveTimeout={300}
      transitionEnterTimeout={300}
      transitionName={{
        enter: "resultsEnter",
        enterActive: "resultsEnterActive",
        leave: "resultsLeave",
        leaveActive: "resultsLeaveActive"
      }}
    >
      {visible &&
        <div>
          <ResultPanel className="results-panel">
            <ResultDetails>
              <Heading>
                <i className="ion-pie-graph" />
                Splitattu hinta
              </Heading>
              <Price>
                {Number(totalPrice / passengerCount).toFixed(3)}&nbsp;€
              </Price>

              <hr />

              <Heading sub>
                <i className="ion-loop" />
                Edestakaisin
              </Heading>
              <Price small>
                {Number(totalPrice / passengerCount * 2).toFixed(3)}&nbsp;€
              </Price>

              <hr />

              <Heading sub>
                <i className="ion-person-stalker" />
                Kokonaishinta
              </Heading>
              <Price small>
                {Number(totalPrice).toFixed(3)}&nbsp;€
              </Price>

            </ResultDetails>

            <ResetButton type="button" onClick={handleReset}>
              Uusi splittaus
            </ResetButton>

            <Close>
              <i onClick={handleHide} className="ion-close-round" />
            </Close>
          </ResultPanel>

          <Backdrop onClick={handleHide} className="results-backdrop" />
        </div>}
    </CSSTransitionGroup>
  );
};

const Backdrop = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: ${props => props.theme.elevations.results};
`;
const ResultPanel = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 85vh;
  background-color: #fff;
  box-shadow: 0px 0px 18px rgba(0,0,0,0.7);
  text-align: center;
  z-index: ${props => props.theme.elevations.results + 1};

  & hr {
    border: none;
    height: 1px;
    background-color: #eee;
    margin: 24px 0px;
  }
`;
const ResultDetails = styled.div`
  flex: 1;
`;
const Heading = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => (props.sub ? "18px" : "26px")};
  font-weight: ${props => (props.sub ? 100 : 700)};
  margin: 0 0 16px 0;
  color: ${props => props.theme.mainColor};

  & > i {
    margin-right: 12px;
    font-size: ${props => (props.sub ? "22px" : "30px")};
    color: ${props => props.theme.mainColor};
  }
`;
const Price = styled.div`
  padding: 8px 12px;
  border-radius: 22px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  display: inline-block;
  font-weight: 700;
  color: #666;
  font-size: ${props => (props.small ? "18px" : "24px")};
`;
const ResetButton = styled.button`
  margin: 8px auto;
  font-size: 20px;
  border-radius: 3px;
  color: white;
  border: none;
  padding: 12px 16px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1.6px;
  background-color: ${props => props.theme.mainColor};
  font-family: ${props => props.theme.mainFontFamily};

  &:active {
    background-color: ${props => props.theme.mainColorDarker};
  }
`;
const Close = styled.div`
  text-align: right;
  font-size: 24px;
  color: #444;

  &:active {
    color: #999;
  }
`;

export default Results;
