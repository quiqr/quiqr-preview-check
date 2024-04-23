import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default class About extends React.Component {

  renderCopyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '} {new Date().getFullYear()} <Link href="https://pimsnel.nl">Pim Snel</Link>
      </Typography>
      );
    }

  render(){
    return (

      <div>
        <Typography variant="body1" color="text.secondary" align="center" sx={{mb:2}}>
          Quiqr Preview Check is part of the Quiqr Project which includes <Link
            href="https://quiqr.org">Quiqr Desktop</Link>, an advanced CMS for
          Hugo.
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" sx={{mb:2}}>
          The purpose of Quiqr Preview Check is to analyze and show SEO factors
          that can affect the page ranking of a website or single webpage.
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" sx={{mb:2}}>
          Quiqr Preview Check is free to use and open source. The source code is
          distributed with a MIT License. Source code is available on <Link
            href="https://github.com/quiqr/quiqr-preview-check">GitHub</Link>.
        </Typography>

        {this.renderCopyright()}
      </div>


    )

  }

}
/*
*/

