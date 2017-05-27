import React from "react";
import styled from "styled-components";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import "./index.css";

const Splashscreen = ({ visible }) => (
  <CSSTransitionGroup
    component="div"
    transitionLeaveTimeout={800}
    transitionEnterTimeout={800}
    transitionName={{
      enter: "splashEnter",
      enterActive: "splashEnterActive",
      leave: "splashLeave",
      leaveActive: "splashLeaveActive"
    }}
  >
    {visible &&
      <SplashscreenWrapper>
        <SplashSlogan>
          Splittaa <span>bensakulut</span>
        </SplashSlogan>
        <Panel className="right" r />
        <Panel className="left" l />
      </SplashscreenWrapper>}
  </CSSTransitionGroup>
);

const SplashscreenWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 9997;
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  width: 51%;
  bottom: 0;
  background-color: ${props => props.theme.mainColor};
  z-index: 9998;
  ${props => props.r && "right: 0"};
  ${props => props.l && "left: 0"};
`;

const SplashSlogan = styled.h1`
  position: fixed;
  top: 16px;
  width: 100%;
  text-align: center;
  z-index: 9999;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 56px;

  & > span {
    border-top: 2px solid #fff;
    padding-top: 6px;
    font-size: 32px;
    font-weight: 100;
  }
`;

export default Splashscreen;
