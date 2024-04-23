import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


type MyProps = {
  wordsCountObject: any,
  wordsOnly?: Array<string>,
  keywordDensity: any,
}
type Row = {
  name: string,
  repeat: number,
  density: string,
}
type MyState = {};

export default class KeywordsStats extends React.Component<MyProps,MyState> {

  render(){
    const {keywordDensity, wordsCountObject, wordsOnly} = this.props;

    let rows:Array<Row> = [];

    for (let word in keywordDensity) {
      if(wordsOnly && !wordsOnly.includes(word.toLowerCase())){
        continue;
      }

      if (keywordDensity.hasOwnProperty(word)) {
        let keydens:number = (keywordDensity[word]*100);
        rows.push(createData(word, wordsCountObject[word], `${keydens.toFixed(2)}%`))
      }
    }

    function createData(
      name: string,
      repeat: number,
      density: string,
    ) {
      return { name, repeat, density};
    }

    return (
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table sx={{ }} aria-label="simple table" size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Keyword</TableCell>
              <TableCell align="right">Repeats</TableCell>
              <TableCell align="right">Denstity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.repeat}</TableCell>
                <TableCell align="right">{row.density}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
