import * as React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default class CustomTabPanel extends React.Component <any, any> {
  constructor(props:TabPanelProps){
    super(props);
  }

  render(){

    const { children, value, index, ...other } = this.props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2,
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",

          }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
}
