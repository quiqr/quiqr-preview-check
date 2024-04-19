import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IframeResizer from 'iframe-resizer-react'
import { useState, useRef } from "react";

import "./App.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © Quiqr '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function TabsSidePanel(){

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Meta Tags" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>

        <Button
          onClick={() => {
            alert('clicked');
            fetchMetaTags();
          }}
        >
          Fetch Meta Tags
        </Button>

      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </React.Fragment>
  )

}

function fetchMetaTags(){
  fetch("http://localhost:13131")
    .then((response) => response.text())
    .then((html) => {
       const matches = html.match(/<title>(.*?)<\/title>/);
      console.log(matches);
    })
    .catch((error:any) => { console.warn(error); });
}

function App() {
  const sidebarRef = useRef<HTMLInputElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [resizeDisplay, setResizeDisplay] = useState("none");

  const startResizing = React.useCallback((mouseDownEvent:any) => {
    setIsResizing(true);
    setResizeDisplay("inline-block");
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
    setResizeDisplay("none");
  }, []);

  const resize = React.useCallback(

    (mouseMoveEvent:any) => {

      if (isResizing) {
        setSidebarWidth(
          window.innerWidth - mouseMoveEvent.clientX
        );
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="app-container">

      <div className="app-frame">
        <IframeResizer
          log
          src="http://localhost:13131"
          scrolling={true}
        />
      </div>

      <div
        ref={sidebarRef}
        className="app-sidebar"
        style={{ width: sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="app-sidebar-resizer" onMouseDown={startResizing} >
          <div className="resize-panel" style={{ display: resizeDisplay }}></div>
        </div>
        <div className="app-sidebar-content">
          <TabsSidePanel />
          <Copyright />
        </div>

      </div>


    </div>
  );
}

export default App;
