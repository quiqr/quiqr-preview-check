import * as React from 'react';

import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

type MyProps = {
  title: string,
  situation?: string,
  children?: React.ReactNode;
  //value?: any,
  advisory?: string
  count?: string,
  hideDetails: boolean,
}
type MyState = {

}
export default class AccordionItem extends React.Component <MyProps, MyState> {

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
      return <Box sx={{mr:0}}/>;
    }

  }

  render(){
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={(this.props.hideDetails ? null : <ExpandMoreIcon />)}
          aria-controls="panel3-content"
          id="panel2-header"
        >
          {this.getSituationIcon(this.props.situation)}
          {this.props.title} {this.props.count}
        </AccordionSummary>
        {(this.props.hideDetails ? null :
        <AccordionDetails>
          {this.props.children}

          <Typography sx={{mt:2}} variant="body2" gutterBottom>
            {this.props.advisory}
          </Typography>

        </AccordionDetails>
        )}
      </Accordion>
    )
  }
}
