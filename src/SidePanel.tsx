import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//import fetchMeta from 'fetch-meta-tags'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

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
type MyProps = {
  url: string
  min_keywords: number,
  max_keywords: number,
  word_count: number,
  description_character_count: number,
  title_character_count: number,
  content_css_selector: string,
  timestamp: number,
  setUrlFromIframe: any
};
type MyState = {
  url: string,
  value: number,
  headTitleValue: string,
  headTitleSituation: string,
  headTitleAdvisary: string,
  metaDescriptionValue: string,
  metaDescriptionSituation: string,
  metaDescriptionAdvisary: string,
  metaKeywordsValue: Array<string>,
  metaKeywordsSituation: string,
  metaKeywordsAdvisary : string,
  twitterImage: string,
};

export default class SidePanel extends React.Component <MyProps, MyState> {

  constructor(props: any){
    super(props);
    this.state = {
      value: 0,
      url: "",
      headTitleValue: "",
      headTitleSituation: "",
      headTitleAdvisary: "",
      metaDescriptionValue: "",
      metaDescriptionSituation: "",
      metaDescriptionAdvisary: "",
      metaKeywordsValue: [],
      metaKeywordsSituation: '',
      metaKeywordsAdvisary: '',
      twitterImage: "",
    };
  }

  componentDidMount(){

    this.fetchMetaTags();
    const socket = new WebSocket("ws://localhost:13131/livereload")

    // Connection opened
    socket.addEventListener("open", () => {
      socket.send("Connection established")
    });

    // Listen for messages
    socket.addEventListener("message", event => {
      this.fetchMetaTags();
    });
  }

  componentDidUpdate(){
    if (this.state.url !== this.props.url) {
      this.setState({ url: this.props.url });
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

  checkHeadTitle(){
    if (this.state.headTitleValue.length === 0){
      this.setState( {
        headTitleSituation: 'error',
        headTitleAdvisary: `No title, A page should have a title.`
      });
    }
    else if((this.state.headTitleValue.length - 10) > this.props.title_character_count){
      this.setState( {
        headTitleSituation: 'warning',
        headTitleAdvisary: `Too long title. It should be around ${this.props.title_character_count} characters.`
      });
    }
    else if( this.state.headTitleValue.length + 10 < this.props.title_character_count){
      this.setState( {
        headTitleSituation: 'warning',
        headTitleAdvisary: `Too short title,  It should be around ${this.props.title_character_count} characters.`
      });
    }
    else{
      this.setState( {
        headTitleSituation: '',
        headTitleAdvisary: ``
      });
    }

  }

  checkMetaDescription(){
    if (this.state.metaDescriptionValue.length === 0){
      this.setState( {
        metaDescriptionSituation: 'error',
        metaDescriptionAdvisary: `No meta description, A page should have a description.`
      });
    }
    else if((this.state.metaDescriptionValue.length - 10) > this.props.description_character_count){
      this.setState( {
        metaDescriptionSituation: 'warning',
        metaDescriptionAdvisary: `Too long meta description. It should be around ${this.props.description_character_count} characters.`
      });
    }
    else if( this.state.metaDescriptionValue.length + 10 < this.props.description_character_count){
      this.setState( {
        metaDescriptionSituation: 'warning',
        metaDescriptionAdvisary: `Too short meta description,  It should be around ${this.props.description_character_count} characters.`
      });
    }
    else{
      this.setState( {
        metaDescriptionSituation: '',
        metaDescriptionAdvisary: ``
      });
    }

  }

  checkKeyWords(){
    if (this.state.metaKeywordsValue.length === 0){
      this.setState( {
        metaKeywordsSituation: 'error',
        metaKeywordsAdvisary: `No keywords, A page should have between ${this.props.min_keywords} and ${this.props.max_keywords} keywords`
      });
    }
    else if(this.state.metaKeywordsValue.length > this.props.max_keywords){
      this.setState( {
        metaKeywordsSituation: 'warning',
        metaKeywordsAdvisary: `Too many keywords. A page should have between ${this.props.min_keywords} and ${this.props.max_keywords} keywords`
      });
    }
    else if( this.state.metaKeywordsValue.length < this.props.min_keywords){
      this.setState( {
        metaKeywordsSituation: 'warning',
        metaKeywordsAdvisary: `Too little keywords, A page should have between ${this.props.min_keywords} and ${this.props.max_keywords} keywords`
      });
    }
    else{
      this.setState( {
        metaKeywordsSituation: '',
        metaKeywordsAdvisary: ``
      });
    }

  }

  parseHTML(htmlString: string){

    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(htmlString, "text/html");
    //var hasError = (htmlDoc.getElementsByTagName("parsererror").length > 0);

    let title = htmlDoc.getElementsByTagName("title")[0].innerHTML;
    let description = this.getMeta(htmlDoc, 'description');
    let keywords: Array<string> = this.getMeta(htmlDoc, 'keywords').replace("[","").replace("]","").split(',');
    if(keywords.length ===1 && keywords[0]===""){
      keywords = [];
    }

    /*
    let twitterCard = this.getMeta(htmlDoc, 'twitter:card');
    let twitterTitle = this.getMeta(htmlDoc, 'twitter:title');
    let twitterDescription = this.getMeta(htmlDoc, 'twitter:description');
    */
    let twitterImage = this.getMeta(htmlDoc, 'twitter:image');

    /*
    let ogType = this.getMeta(htmlDoc, 'og:type', 'property');
    let ogTitle = this.getMeta(htmlDoc, 'og:title', 'property');
    let ogDescription = this.getMeta(htmlDoc, 'og:description', 'property');
    let ogUrl = this.getMeta(htmlDoc, 'og:url', 'property');
    let ogImage = this.getMeta(htmlDoc, 'og:image', 'property');
    let ogLogo = this.getMeta(htmlDoc, 'og:logo', 'property');

    let itempropName = this.getMeta(htmlDoc, 'name', 'itemprop');
    let itempropImage = this.getMeta(htmlDoc, 'image', 'itemprop');
    let itempropDescription = this.getMeta(htmlDoc, 'description', 'itemprop');
    */

    this.setState({headTitleValue: title,
    metaDescriptionValue: description,
    metaKeywordsValue: keywords,
    twitterImage: twitterImage},()=>{
        this.checkKeyWords();
        this.checkMetaDescription();
        this.checkHeadTitle();
      });
  }

  fetchMetaTags(){
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

  getSituationIcon(situation:string){
    if(situation==='warning'){
      return <WarningIcon color="warning" sx={{mr:2}}/>
    }
    else if(situation==='error'){
      return <ErrorIcon color="error" sx={{mr:2}}/>
    }
    else if(situation==='success'){
      return <CheckIcon color="success" sx={{mr:2}}/>
    }
    else{
      return null;

    }

  }
  render(){

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
      this.setState({value: newValue});
    };

    return (
      <React.Fragment>

        {/*
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-start"
          spacing={2}
          sx={{m:2}}
        >
          <Button variant="outlined" size="small" onClick={()=>{
            this.props.setUrlFromIframe();
          }} >
            set url
          </Button>
        </Stack>
        */}

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
              alt={this.state.twitterImage}
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
                  {this.getSituationIcon(this.state.headTitleSituation)}
                  Title ({this.state.headTitleValue.length})
                </AccordionSummary>
                <AccordionDetails>
                  {this.state.headTitleValue}

                  <Typography sx={{mt:2}} variant="body2" gutterBottom>
                    {this.state.headTitleAdvisary}
                  </Typography>

                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel1-header"
                >
                  {this.getSituationIcon(this.state.metaKeywordsSituation)}
                  Keywords ({this.state.metaKeywordsValue.length})

                </AccordionSummary>
                <AccordionDetails>
                  {this.state.metaKeywordsValue.map((kw,i)=>{
                    return (<Chip label={kw} key={i} variant="outlined" />)
                  })}

                  <Typography sx={{mt:2}} variant="body2" gutterBottom>
                    {this.state.metaKeywordsAdvisary}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel2-header"
                >
                  {this.getSituationIcon(this.state.metaDescriptionSituation)}
                  Description ({this.state.metaDescriptionValue.length})

                </AccordionSummary>
                <AccordionDetails>
                  {this.state.metaDescriptionValue}

                  <Typography sx={{mt:2}} variant="body2" gutterBottom>
                    {this.state.metaDescriptionAdvisary}
                  </Typography>

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




