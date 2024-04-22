import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
//import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//import fetchMeta from 'fetch-meta-tags'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Accordion from '@mui/material/Accordion';
//import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

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
  url: string,
  value: number,
  headTitleValue: string,
  metaDescriptionValue: string,
  metaKeywordsValue: string,
  twitterImage: string,
};

export default class SidePanel extends React.Component <MyProps, MyState> {

  constructor(props: any){
    super(props);
    this.state = {
      value: 0,
      url: "",
      headTitleValue: "",
      metaDescriptionValue: "",
      metaKeywordsValue: "",
      twitterImage: "",
    };
  }

  componentDidUpdate(){
    if (this.state.url !== this.props.url) {
      this.setState({ url: this.props.url });
      console.log(this.props.url)
      this.fetchMetaTags();
    }
  }

  getMeta(htmlDoc: any, metaName:string, attribute:string='name') {
    const metas = htmlDoc.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute(attribute) === metaName) {
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
    let keywords = this.getMeta(htmlDoc, 'keywords');

    let twitterCard = this.getMeta(htmlDoc, 'twitter:card');
    let twitterTitle = this.getMeta(htmlDoc, 'twitter:title');
    let twitterDescription = this.getMeta(htmlDoc, 'twitter:description');
    let twitterImage = this.getMeta(htmlDoc, 'twitter:image');

    let ogType = this.getMeta(htmlDoc, 'og:type', 'property');
    let ogTitle = this.getMeta(htmlDoc, 'og:title', 'property');
    let ogDescription = this.getMeta(htmlDoc, 'og:description', 'property');
    let ogUrl = this.getMeta(htmlDoc, 'og:url', 'property');
    let ogImage = this.getMeta(htmlDoc, 'og:image', 'property');
    let ogLogo = this.getMeta(htmlDoc, 'og:logo', 'property');

    let itempropName = this.getMeta(htmlDoc, 'name', 'itemprop');
    let itempropImage = this.getMeta(htmlDoc, 'image', 'itemprop');
    let itempropDescription = this.getMeta(htmlDoc, 'description', 'itemprop');

    console.log(title);
    console.log(description);

    this.setState({headTitleValue: title});
    this.setState({metaDescriptionValue: description});
    this.setState({metaKeywordsValue: keywords});
    this.setState({twitterImage: twitterImage});
  }

  fetchMetaTags(){
    //const [headTitleValue, setHeadTitleValue] = useState("");
    console.log(this.props.url)

    fetch(this.props.url)
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
            {/*<Tab label="Keywords" {...this.a11yProps(1)} />
            <Tab label="Meta Tags" {...this.a11yProps(2)} />*/}
          </Tabs>
        </Box>
        <CustomTabPanel value={this.state.value} index={0}>

          <Typography variant="overline" display="block" gutterBottom>
           Preview
          </Typography>

          {/*
          <Button
            onClick={() => {
              this.fetchMetaTags();
            }}
          >
            Fetch Meta Tags
          </Button>
          */}

          <Card sx={{ display: 'flex', height: 151}}>
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image={this.state.twitterImage}
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

          <div>

            <Box sx={{ mt: 5}}>
          <Typography variant="overline" display="block" gutterBottom>
           Meta tags
          </Typography>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                   <CheckIcon color="success" sx={{mr:2}}/>
                  Title
                </AccordionSummary>
                <AccordionDetails>
                  {this.state.headTitleValue}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <WarningIcon color="warning" sx={{mr:2}}/> Keywords
                </AccordionSummary>
                <AccordionDetails>
                  {this.state.metaKeywordsValue}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <ErrorIcon color="error" sx={{mr:2}}/> Description
                </AccordionSummary>
                <AccordionDetails>
                  {this.state.metaDescriptionValue}
                </AccordionDetails>
              </Accordion>

            </Box>
          </div>



        </CustomTabPanel>
        <CustomTabPanel value={this.state.value} index={1}>
        </CustomTabPanel>
        <CustomTabPanel value={this.state.value} index={2}>
        </CustomTabPanel>
      </React.Fragment>
    )

  }
}




