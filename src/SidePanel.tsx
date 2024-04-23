import * as React from 'react';

import Tabs from '@mui/material/Tabs';
//import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
//import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import WordAnalyser from './WordAnalyser'

import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import AccordionItem from './AccordionItem';
import KeywordsStats from './KeywordsStats';
import About from './About';

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
  headTitleAdvisory: string,
  metaDescriptionValue: string,
  metaDescriptionSituation: string,
  metaDescriptionAdvisory: string,
  metaKeywordsValue: Array<string>,
  metaKeywordsSituation: string,
  metaKeywordsAdvisory : string,
  wordsCount: number,
  readingTime: string,
  paragraphs: number,
  sentences: number,
  wordsCountAdvisory: string,
  wordsCountSituation: string,
  twitterImage: string,
  wordsCountObject: any,
  keywordDensity: any,
};

export default class SidePanel extends React.Component <MyProps, MyState> {

  constructor(props: any){
    super(props);
    this.state = {
      value: 0,
      url: "",
      headTitleValue: "",
      headTitleSituation: "",
      headTitleAdvisory: "",
      metaDescriptionValue: "",
      metaDescriptionSituation: "",
      metaDescriptionAdvisory: "",
      metaKeywordsValue: [],
      metaKeywordsSituation: '',
      metaKeywordsAdvisory: '',
      readingTime: '',
      paragraphs: 0,
      sentences: 0,
      wordsCount: 0,
      wordsCountAdvisory: '',
      wordsCountSituation: '',
      twitterImage: "",
      wordsCountObject: null,
      keywordDensity: null,
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
        headTitleAdvisory: `No title, A page should have a title.`
      });
    }
    else if((this.state.headTitleValue.length - 10) > this.props.title_character_count){
      this.setState( {
        headTitleSituation: 'warning',
        headTitleAdvisory: `Too long title. It should be around ${this.props.title_character_count} characters.`
      });
    }
    else if( this.state.headTitleValue.length + 10 < this.props.title_character_count){
      this.setState( {
        headTitleSituation: 'warning',
        headTitleAdvisory: `Too short title,  It should be around ${this.props.title_character_count} characters.`
      });
    }
    else{
      this.setState( {
        headTitleSituation: 'success',
        headTitleAdvisory: ``
      });
    }

  }

  checkMetaDescription(){
    if (this.state.metaDescriptionValue.length === 0){
      this.setState( {
        metaDescriptionSituation: 'error',
        metaDescriptionAdvisory: `No meta description, A page should have a description.`
      });
    }
    else if((this.state.metaDescriptionValue.length - 10) > this.props.description_character_count){
      this.setState( {
        metaDescriptionSituation: 'warning',
        metaDescriptionAdvisory: `Too long meta description. It should be around ${this.props.description_character_count} characters.`
      });
    }
    else if( this.state.metaDescriptionValue.length + 10 < this.props.description_character_count){
      this.setState( {
        metaDescriptionSituation: 'warning',
        metaDescriptionAdvisory: `Too short meta description,  It should be around ${this.props.description_character_count} characters.`
      });
    }
    else{
      this.setState( {
        metaDescriptionSituation: 'success',
        metaDescriptionAdvisory: ``
      });
    }

  }

  checkKeyWords(){
    if (this.state.metaKeywordsValue.length === 0){
      this.setState( {
        metaKeywordsSituation: 'error',
        metaKeywordsAdvisory: `No keywords, A page should have between ${this.props.min_keywords} and ${this.props.max_keywords} keywords`
      });
    }
    else if(this.state.metaKeywordsValue.length > this.props.max_keywords){
      this.setState( {
        metaKeywordsSituation: 'warning',
        metaKeywordsAdvisory: `Too many keywords. A page should have between ${this.props.min_keywords} and ${this.props.max_keywords} keywords`
      });
    }
    else if( this.state.metaKeywordsValue.length < this.props.min_keywords){
      this.setState( {
        metaKeywordsSituation: 'warning',
        metaKeywordsAdvisory: `Too little keywords, A page should have between ${this.props.min_keywords} and ${this.props.max_keywords} keywords`
      });
    }
    else{
      this.setState( {
        metaKeywordsSituation: 'success',
        metaKeywordsAdvisory: ``
      });
    }
  }

  checkMainContent(contentText: string){

    let counter = new WordAnalyser(contentText);
    const words = counter.getWords();
    this.setState( {
      wordsCount: words,
    });

    if (words === 0){
      this.setState( {
        wordsCountSituation: 'error',
        wordsCountAdvisory: `Main content seems to have no text. For SEO having around ${this.props.word_count} words is recommended.`
      });
    }
    else if(words + 100 < this.props.word_count){
      this.setState( {
        wordsCountSituation: 'warning',
        wordsCountAdvisory: `Too little words in main main content. For SEO having around ${this.props.word_count} words is recommended.`
      });
    }
    else{
      this.setState( {
        wordsCountSituation: 'success',
        wordsCountAdvisory: `Enough words. Nice.`
      });
    }
  }

  checkContent(contentText: string){
    let counter = new WordAnalyser(contentText);

    const words = counter.getWords();
    const filteredWordsCount = counter.getWords(true);
//    const chars = counter.getCharacters();
    const sentences = counter.getSentences();
    const paragraphs = counter.getParagraphs();
    const readingTime = counter.getReadingTime();
//    const speakingTime = counter.getSpeakingTime();
    const keywordDensity = counter.getKeywordDensity();
    const wordsCountObject = counter.getWordCountObject();
//
//    console.log(words)
//    console.log(keywordDensity);
    /*
    for (let word in keywordDensity) {
        //console.log(word)
      if (keywordDensity.hasOwnProperty(word)) {

        let keydens:number = (keywordDensity[word]*100);
        let debugdens = `${word} (${wordsCountObject[word]}) (${keydens}%)`

        console.log(debugdens);
      }
    }
    */
    this.setState( {
      readingTime: readingTime,
      sentences: sentences,
      paragraphs: paragraphs,
      wordsCountObject: wordsCountObject,
      keywordDensity: keywordDensity,
    });
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

    let contentText = htmlDoc.querySelector<HTMLElement>(".content").innerText;
    this.checkContent(contentText);
    this.checkMainContent(contentText);


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

    this.setState({
      headTitleValue: title,
      //wordsCount: content.length,
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
            <Tab label="About" {...this.a11yProps(1)} />
            {/* <Tab label="Meta Tags" {...this.a11yProps(2)} />*/}
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

              <AccordionItem
                title="Title"
                situation={this.state.headTitleSituation}
                advisory={this.state.headTitleAdvisory}
                count={"("+this.state.headTitleValue.length+")"}
                hideDetails={false}
              >
                {this.state.headTitleValue}
              </AccordionItem>

              <AccordionItem
                title="Keywords"
                situation={this.state.metaKeywordsSituation}
                advisory={this.state.metaKeywordsAdvisory}
                count={"("+this.state.metaKeywordsValue.length+")"}
                hideDetails={false}
              >
                {
                  this.state.metaKeywordsValue.map((kw,i)=>{
                    return (<Chip key={`kw${i}`} label={kw} sx={{mr:1, mb:1}} />)
                  })
                }
              </AccordionItem>

              <AccordionItem
                title="Description"
                situation={this.state.metaDescriptionSituation}
                //value={this.state.metaDescriptionValue}
                advisory={this.state.metaDescriptionAdvisory}
                count={"("+this.state.metaDescriptionValue.length+")"}
                hideDetails={false}
              >
                {this.state.metaDescriptionValue}
              </AccordionItem>
            </Box>

            <Box sx={{ mt: 5}}>
              <Typography variant="overline" display="block" gutterBottom>
                Main Content
              </Typography>

              <AccordionItem
                title="Words"
                situation={this.state.wordsCountSituation}
                //value={""}
                advisory={this.state.wordsCountAdvisory}
                count={"("+this.state.wordsCount+") "}
                hideDetails={false}
              >
                <div>
                Reading Time: {this.state.readingTime}<br/>
                Sentences: {this.state.sentences}<br/>
                Paragraphs: {this.state.paragraphs}<br/>
                </div>

              </AccordionItem>

            </Box>

            <Box sx={{ mt: 5}}>
              <Typography variant="overline" display="block" gutterBottom>
                Keywords
              </Typography>

              <AccordionItem
                title="Keywords from Meta Tags"
                hideDetails={false}
              >
                <KeywordsStats
                  wordsCountObject={this.state.wordsCountObject}
                  keywordDensity={this.state.keywordDensity}
                  wordsOnly={
                    this.state.metaKeywordsValue.map((kw)=>{
                      return kw.trim().toLowerCase();

                    })
                  }
                />

              </AccordionItem>

              <AccordionItem
                title="Keywords from Title"
                hideDetails={false}
              >
                <KeywordsStats
                  wordsCountObject={this.state.wordsCountObject}
                  keywordDensity={this.state.keywordDensity}
                  wordsOnly={
                    this.state.headTitleValue.split(" ").map((kw)=>{
                      return kw.trim().toLowerCase();

                    })
                  }
                />

              </AccordionItem>


              <AccordionItem
                title="All Keywords"
                hideDetails={false}
              >
                <KeywordsStats
                  wordsCountObject={this.state.wordsCountObject}
                  keywordDensity={this.state.keywordDensity}
                />

              </AccordionItem>


            </Box>
          </div>


        </CustomTabPanel>

        <CustomTabPanel value={this.state.value} index={1}>
          <About />
        </CustomTabPanel>

        <CustomTabPanel value={this.state.value} index={2}>
        </CustomTabPanel>
      </React.Fragment>
    )

  }
}




