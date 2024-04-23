import * as React from 'react';
import IframeResizer from 'iframe-resizer-react'
import SidePanel from './SidePanel'
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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
type MyState = {
  isResizing: boolean,
  sidebarWidth: number,
  resizeDisplay: string,
  url: string,
  min_keywords: number,
  max_keywords: number,
  word_count: number,
  description_character_count: number,
  title_character_count: number,
  content_css_selector: string,
  timestamp: number,
  corsAllow: boolean,
  loadTimer: boolean,
};
export default class App extends React.Component<MyProps, MyState> {

  constructor(props: any){
    super(props);

    this.state = {
      isResizing: false,
      url: 'empty.html',
      sidebarWidth: 500,
      resizeDisplay: "none",
      min_keywords: 0,
      max_keywords: 0,
      word_count: 0,
      description_character_count: 0,
      title_character_count: 0,
      timestamp: 0,
      content_css_selector: "",
      corsAllow: false,
      loadTimer: false,
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
    setTimeout(()=>{
      this.setState({loadTimer:true});
    },300)

    window.addEventListener("mousemove", (e)=>{this.resize(e)});
    window.addEventListener("mouseup", ()=>{this.stopResizing()});

    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get("url");
    if(url!==""){
        this.setState({
          url: url,
          min_keywords: parseInt(searchParams.get("min_keywords")),
          max_keywords: parseInt(searchParams.get("max_keywords")),
          word_count: parseInt(searchParams.get("word_count")),
          description_character_count: parseInt(searchParams.get("description_character_count")),
          title_character_count: parseInt(searchParams.get("title_character_count")),
          content_css_selector: searchParams.get("content_css_selector"),
        });

      this.canAccessIFrame(url);
    }
  }

  canAccessIFrame(url: string) {
    fetch(url)
      .then((response) =>
        response.text()
        //console.log(response);
      )
      .then(() => {
        this.setState({
          corsAllow:true,
        });
      })
      .catch((error:any) => {
        console.warn(error);
        //console.log(error);
      });
  }

  renderSidePanel(){

    if(this.state.url !== 'empty.html' && this.state.url !== null ) {
      if(this.state.corsAllow){
        return(
          <SidePanel
            url={this.state.url}
            min_keywords={this.state.min_keywords}
            max_keywords={this.state.max_keywords}
            word_count={this.state.word_count}
            description_character_count={this.state.description_character_count}
            title_character_count={this.state.title_character_count}
            content_css_selector={this.state.content_css_selector}
            timestamp={this.state.timestamp}
            setUrlFromIframe={()=>{
              console.log("not working");
            }}
          />
        );

      }
      else{
        return (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            spacing={2}
            sx={{m:2}}
          >
            <Alert severity="warning">
              Reading from preview URL is not allowed. Setup CORS headers should fix this.
              <Typography variant="body2" color="text.secondary" component="p" sx={{mt:2}}>
                <Link href="https://gohugo.io/getting-started/configuration/#configure-server" underline="hover">
                  Hugo server documentation
                </Link>
              </Typography>

            </Alert>

          </Stack>

        )

      }
    }
    else{

      return (
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-start"
          spacing={2}
          sx={{m:2}}
        >
          <Alert severity="warning">
            No valid URL to analyse. This Preview Check is specially made for Quiqr Websites.

            <p>
            <Link href="https://quiqr.org" underline="hover">
              Learn more about Quiqr.
            </Link>
            </p>

          </Alert>

        </Stack>
      );


    }


  }

  render(){
    const sidePanel = this.renderSidePanel();
    return (
      <div className="app-container">

        <div className="app-frame">
          <IframeResizer
            log={false}
            src={this.state.url}
            scrolling={true}
            id="iframe"
          />
        </div>

        <div className="app-sidebar" style={{ width: this.state.sidebarWidth }}
          onMouseDown={(e) => e.preventDefault()} >
          <div className="app-sidebar-resizer" onMouseDown={()=>{this.startResizing()}} >
            <div className="resize-panel" style={{ display: this.state.resizeDisplay }}></div>
          </div>
          <div className="app-sidebar-content">
            { ( this.state.loadTimer ? sidePanel : <CircularProgress sx={{m:5}}/> )  }
          </div>
        </div>
      </div>
    );
  }
}
