import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import fetchMeta from 'fetch-meta-tags'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

class CustomTabPanel extends React.Component <any, any> {
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
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
}
type MyProps = { url: string};
type MyState = {
  value: number,
  headTitleValue: string,
  metaDescriptionValue: string
};

export default class SidePanel extends React.Component <MyProps, MyState> {

  constructor(props: any){
    super(props);
    this.state = {
      value: 0,
      headTitleValue: "",
      metaDescriptionValue: "",
    };
  }
  componentDidMount(){
    this.fetchMetaTags();
  }

  getMeta(htmlDoc: any, metaName:string) {
    const metas = htmlDoc.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === metaName) {
        return metas[i].getAttribute('content');
      }
    }

    return '';
  }

  parseHTML(htmlString: string){

    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(htmlString, "text/html");
    //var hasError = (htmlDoc.getElementsByTagName("parsererror").length > 0);

    let title = htmlDoc.getElementsByTagName("title")[0].innerHTML;
    let description = this.getMeta(htmlDoc, 'description');
    console.log(title);
    console.log(description);

    this.setState({headTitleValue: title});
    this.setState({metaDescriptionValue: description});
  }

 fetchMetaTags(){
  //const [headTitleValue, setHeadTitleValue] = useState("");

    fetch("http://localhost:13131")
    .then((response) => response.text())
    .then((html) => {
        this.parseHTML(html)
    })
    .catch((error:any) => { console.warn(error); });
}

  a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  render(){

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
      this.setState({value: newValue});
    };

    return (
      <React.Fragment>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={this.state.value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Overview" {...this.a11yProps(0)} />
            <Tab label="Keywords" {...this.a11yProps(1)} />
            <Tab label="Meta Tags" {...this.a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={this.state.value} index={0}>

          <Button
            onClick={() => {
              this.fetchMetaTags();
            }}
          >
            Fetch Meta Tags
          </Button>

          <Card sx={{ display: 'flex', height: 151}}>
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image="http://localhost:13131/unleash.jpg"
              alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="subtitle2">
                  { this.state.headTitleValue }
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  {this.state.metaDescriptionValue}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
              </Box>
            </Box>

          </Card>

        </CustomTabPanel>
        <CustomTabPanel value={this.state.value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={this.state.value} index={2}>
          Item Three
        </CustomTabPanel>
      </React.Fragment>
    )

  }
}




