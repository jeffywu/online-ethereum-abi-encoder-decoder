import React, { Component } from "react";
import { HashRouter } from "react-router-dom";

import JssProvider from "react-jss/lib/JssProvider";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import wrapDisplayName from "recompose/wrapDisplayName";
import createContext from "../styles/createContext";

// Apply some reset
const styles = theme => ({
  "@global": {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: "antialiased", // Antialiasing.
      MozOsxFontSmoothing: "grayscale", // Antialiasing.
    },
    body: {
      margin: 0,
    },
  },
});

let AppWrapper = props => props.children;

AppWrapper = withStyles(styles)(AppWrapper);

const context = createContext();

function withRoot(BaseComponent) {
  class WithRoot extends Component {
    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#jss-server-side");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
          <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
            <AppWrapper>
              <HashRouter>
                <BaseComponent {...this.props} />
              </HashRouter>
            </AppWrapper>
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }

  if (process.env.NODE_ENV !== "production") {
    WithRoot.displayName = wrapDisplayName(BaseComponent, "withRoot");
  }

  return WithRoot;
}

export default withRoot;
