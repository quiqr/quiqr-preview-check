/*
MIT License

Copyright (c) 2023 Valeriu Dodon (https://github.com/ginirator/js-text-analyzer-density-generator/blob/main/LICENSE)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import StopWords from './StopwordsEnglish.json'
import KeywordExtractor from 'keyword-extractor'

export default class WordCounter {

  static stopWords = StopWords;
  text: string;

  constructor(text:string) {
    this.text = text;
  }

  getWords(useStopWords:boolean = false) {
    let words:Array<string> = this.text.toLowerCase().match(/\b(\w+)\b/g);

    // If stopWords parameter is true, ignore stop words
    if (useStopWords) {
      // Filter out the stop words
      words = words.filter(word => !WordCounter.stopWords.includes(word));
    }

    return words ? words.length : 0;
  }

  getKeyWords(min_words:number=1, max_words:number=3) {
    const result: Array<string> = KeywordExtractor.extract(this.text,{
      language:"english",
      remove_digits: true,
      return_changed_case:true,
      return_chained_words:true,
      remove_duplicates: false
    });

    const filtered_result = result.filter((word)=> (word.split(" ").length <= max_words && word.split(" ").length >= min_words))


    return filtered_result;
  }

  getCharacters() {
    return this.text.length;
  }

  getSentences() {
    let sentences = this.text.match(/[^\.!\?]+[\.!\?]+/g);
    return sentences ? sentences.length : 0;
  }

  getParagraphs() {
    let paragraphs = this.text.split(/\n+/g);
    return paragraphs ? paragraphs.length : 0;
  }

  formatTime(timeInMinutes:number) {
    const timeInSeconds = timeInMinutes * 60;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return minutes >= 1 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  getReadingTime() {
    // Average reading speed is about 200 words per minute.
    const timeInMinutes = this.getWords() / 200;
    return this.formatTime(timeInMinutes);
  }

  getSpeakingTime() {
    // Average speaking speed is about 150 words per minute.
    const timeInMinutes = this.getWords() / 150;
    return this.formatTime(timeInMinutes);
  }

  getKeywordCountObject(){
    //let wordsAll:Array<string> = this.text.toLowerCase().match(/\b(\w+)\b/g);
    let words = this.getKeyWords();
    let wordCount = {};
    if (words) {
      words.forEach( (word:string) => {
        if (wordCount[word]) {
          wordCount[word]++;
        } else {
          wordCount[word] = 1;
        }
      });
    }

    return wordCount
  }

  getWordCountObject(){
    let wordsAll:Array<string> = this.text.toLowerCase().match(/\b(\w+)\b/g);
    let words = wordsAll.filter(word => !WordCounter.stopWords.includes(word));
    let wordCount = {};
    if (words) {
      words.forEach( (word:string) => {
        if (wordCount[word]) {
          wordCount[word]++;
        } else {
          wordCount[word] = 1;
        }
      });
    }
    return wordCount
  }

  getWordDensity() {
    // Extract words from the text, lower case them, and filter out stop words
    let wordsAll:Array<string> = this.text.toLowerCase().match(/\b(\w+)\b/g);
    let words = wordsAll.filter(word => !WordCounter.stopWords.includes(word));

    let wordCount = this.getWordCountObject();

    let keywordDensity = {};

    for (let word in wordCount) {
      // Avoid showing 'undefined' in the results
      if (wordCount[word] !== undefined && wordCount[word] >= words.length * 0.001) {
        keywordDensity[word] = wordCount[word] / wordsAll.length;
      }
    }

    // Sort keywords by density from highest to lowest
    let sortedKeywordDensity = Object.keys(keywordDensity).sort((a, b) => keywordDensity[b] - keywordDensity[a]);

    let sortedDensity = {};
    sortedKeywordDensity.forEach(key => {
      sortedDensity[key] = keywordDensity[key];
    });

    return sortedDensity;
  }

  getKeywordDensity() {
    // Extract words from the text, lower case them, and filter out stop words
    let wordsAll:Array<string> = this.text.toLowerCase().match(/\b(\w+)\b/g);
    let words = this.getKeyWords();

    let wordCount = this.getKeywordCountObject();

    let keywordDensity = {};

    for (let word in wordCount) {
      // Avoid showing 'undefined' in the results
      if (wordCount[word] !== undefined && wordCount[word] >= words.length * 0.001) {
        keywordDensity[word] = wordCount[word] / wordsAll.length;
      }
    }

    // Sort keywords by density from highest to lowest
    let sortedKeywordDensity = Object.keys(keywordDensity).sort((a, b) => keywordDensity[b] - keywordDensity[a]);

    let sortedDensity = {};
    sortedKeywordDensity.forEach(key => {
      sortedDensity[key] = keywordDensity[key];
    });

    return sortedDensity;
  }
}

