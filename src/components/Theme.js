import React from "react";
import { ThemeProvider } from 'antd-theme';

const Theme = () => {
    const initialTheme = {
      name: 'default',
      variables: { 'primary-color': localStorage.getItem("theme") == "dark" ? "#664af0" : "#402E96" }
    };
    const [theme, setTheme] = React.useState(initialTheme);
    return (
      <ThemeProvider
        theme={theme}
      >
      </ThemeProvider>
    );
  };
  
export default Theme;