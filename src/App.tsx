import * as React from 'react';
import IframeResizer from 'iframe-resizer-react'
import SidePanel from './SidePanel'

import "./App.css";

/*
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © Quiqr '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
*/

type MyProps = {};
type MyState = { isResizing: boolean, sidebarWidth: number, resizeDisplay: string, url: string };
export default class App extends React.Component<MyProps, MyState> {

  constructor(props: any){
    super(props);

    this.state = {
      isResizing: false,
      url: 'empty.html',
      sidebarWidth: 500,
      resizeDisplay: "none",
    };

   this.resize = this.resize.bind(this);
  }

  startResizing(){
    this.setState({
      isResizing: true,
      resizeDisplay: "inline-block"});
  };

  stopResizing(){
    this.setState({
      isResizing: false,
      resizeDisplay: "none"});
  }

  resize(mouseMoveEvent:any){
    if (this.state && this.state.isResizing) {
      this.setState({sidebarWidth: (window.innerWidth - mouseMoveEvent.clientX)});
    }
  }

  componentDidMount(){
    window.addEventListener("mousemove", (e)=>{this.resize(e)});
    window.addEventListener("mouseup", ()=>{this.stopResizing()});

    const searchParams = new URLSearchParams(window.location.search);
    this.setState({url: searchParams.get("url")});
  }

  render(){
    return (
      <div className="app-container">

        <div className="app-frame">
          <IframeResizer
            log={false}
            src={this.state.url}
            scrolling={true}
          />
        </div>

        <div className="app-sidebar" style={{ width: this.state.sidebarWidth }}
          onMouseDown={(e) => e.preventDefault()} >
          <div className="app-sidebar-resizer" onMouseDown={()=>{this.startResizing()}} >
            <div className="resize-panel" style={{ display: this.state.resizeDisplay }}></div>
          </div>
          <div className="app-sidebar-content">
            <SidePanel
              url={this.state.url}
            />
          </div>
        </div>
      </div>
    );
  }
}
