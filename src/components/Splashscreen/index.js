import React from "react";
import styled from "styled-components";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import "./index.css";

const Splashscreen = ({ visible }) => (
  <CSSTransitionGroup
    component="div"
    transitionLeaveTimeout={1000}
    transitionEnterTimeout={1000}
    transitionName={{
      enter: "splashEnter",
      enterActive: "splashEnterActive",
      leave: "splashLeave",
      leaveActive: "splashLeaveActive"
    }}
  >
    {/* NOTE: `CSSTransitionGroup` works so that when the component
      * inside it (children) gets unmounted it applies certain css classnames
      * to it before actually removing it from DOM.
      * => This way it's quite simple to animate hide / show type of things.
      */}
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
  z-index: ${props => props.theme.elevations.splash};
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 51%;
  background-color: ${props => props.theme.mainColor};
  z-index: ${props => props.theme.elevations.splash + 1};
  ${props => props.r && "right: 0"};
  ${props => props.l && "left: 0"};
`;

const SplashSlogan = styled.h1`
  position: fixed;
  top: 16px;
  width: 100%;
  text-align: center;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 3px;
  font-size: 56px;
  z-index: ${props => props.theme.elevations.splash + 2};

  & > span {
    border-top: 2px solid #fff;
    padding-top: 6px;
    font-size: 32px;
    font-weight: 100;
  }
`;

export default Splashscreen;
