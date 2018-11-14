readContents('..///Guttenberg');

function readContents(rootDir) {
  let fs = require('fs');
  let path = require('path');
  let myFiles = [];
  let counter;
  // Loop through all the files in the temp directory
  fs.readdir(rootDir,
    function (err, files) {
      if (err) {//error message
        console.error("Could not list the directory.", err);
        process.exitCode = 1;
      }
      counter = 1;
      let file = files[4];
      // Make one pass and process all contents
      let fromPath = path.join(rootDir, file);
      fs.stat(fromPath, function (error, stat) {
        let contents = processFileInfo(error, stat, fromPath, myFiles, counter);
        //culmination of everything so far(the words ready to be processed)
      });
    });
}
function processFileInfo(error, stat, fromPath, myFiles, counter) {
  let fs = require('fs');
  let path = require('path');
  let outstr;
  if (error) { //error message
    console.error("Error stating file.", error);
    return;
  }
  if (stat.isFile()) {
    let extension = fromPath.split('.');
    if (extension.length > 1 && extension[extension.length - 1] === 'txt') {
      //finding the right files and showing the computer where they are
      fs.readFile(fromPath,
        function (err, buf) {
          counter--;
          let outstr = buf.toString();//converting the 10s to legible words
          myFiles.push(outstr);//adding the words to myFiles
          if (counter === 0) {
            run(myFiles);
          }
        });
    }
  }
  return;
}
//__------------------____________________-------------------___________________---------------------
function run(myFiles) {


  let wordList = seperateText(myFiles); // get list of words...
  let dict = getUniqueWords(wordList);      // get unique words
  let masterEncoder = new Encoders(dict);
  let results = [];

  //results.push(JSON.stringify(wordList).length);
  //results.push(wordList.slice(0, 50).join(" "));

  results.push(doer('Huffman', masterEncoder.huffmanEncode, masterEncoder.huffmanDecode, wordList));
  results.push(doer('Simple', masterEncoder.naiveEncode, masterEncoder.naiveDecode, wordList));
  resulter(results, "g5");
}
function doer(nameA, encode, decode, word) {
    let results = {};
    d = new Date();
    t = d.getTime();
    let coded = word.map((o, i) => { return encode[o]; });
    d2 = new Date();
    ts = d2.getTime();
    results[nameA +'ETime'] = ((ts - t) / 1000);  // get the time it took
    //results[nameA +'ELength'] = JSON.stringify(coded).length;

    d = new Date();
    t = d.getTime();
    let decoded = coded.map((o, i) => { return decode[o]; });
    d2 = new Date();
    ts = d2.getTime();
    results[nameA +'DTime'] = ((ts - t) / 1000);  // get the time it took
  //results[nameA +'DLength'] = decoded.length;
  //results[nameA +'ESample'] = coded.slice(0, 50).join(" ");
  //results[nameA +'ReproSample'] = decoded.slice(0, 50).join(" ");
    return results;
}
function resulter(results, filename) {// write results to file
  let fs = require('fs');

  fs.appendFile('..///HuffmanData/' + filename + '.txt', // adds it to encoderResults.txt
    JSON.stringify(results, null, 4),
    function (err, data) {
      if (err) console.log(err);
      console.log("Success: '%s' ", '../' + filename + '.txt');
      process.exitCode = 0;
    });
}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::::::::::::::::::::::::::::::::::::::::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::::::::::::::::::::::::::::::::

function seperateText(myFiles) {// read text into list of words
  console.log('seperate text');
  let text = myFiles.join(' ');//so the words can be specified as 'each word is seperated by a space'
  text = text.replace(/[^\w\s?!.][0-9][.{2}]-|_/g, "").replace(/\s+/g, " ").split(' ');
  return text;
}


function getUniqueWords(wordList) {// find and count the appearences of every unique word
  console.log('getUniqueWords');
  let dict = {};
  let j = 1;
  for (let i = 0; i < wordList.length; i++) {
    if (dict.hasOwnProperty(wordList[i])) {// has the word been counted yet?
      dict[wordList[i]]["count"] += 1;
    } else {
      dict[wordList[i]] = { count: 1, order: j };
      j++;
    }
  }
  return dict; //dictionary of word:{count:#,order:#} objects
}

function sortArrayByField(array, sortField) {
  function comp(a, b) {
    if (a[sortField] > b[sortField]) {
      return -1;
    } else {
      return 1;
    }
  }
  array.sort(comp);
  return array;
}
function Encoders(dict) {
  this.huffmanEncode = {};
  this.naiveEncode = {};
  this.huffmanDecode = {};
  this.naiveDecode = {};

  let dictArray = [];
  for (var word in dict) {
    if (dict.hasOwnProperty(word)) {
      var wordObject = dict[word];
      dictArray.push(Object.assign({ word: word }, wordObject));
      this.naiveEncode[word] = wordObject["order"];
      this.naiveDecode[wordObject["order"] + ''] = word;
    }
  }
  dictArray = sortArrayByField(dictArray, "count");
  dictArray.forEach((elem, i) => {
    this.huffmanEncode[elem["word"]] = i;
    this.huffmanDecode[i + ''] = elem["word"];
  });
}

















function encodeFile(texter, code) { // finds a word and replaces it by it's value
  texter = texter.map((o, i) => { return code[o]; });
  console.log('yay');// yay 2
  return texter;
}
function decodeFile(text, uncode) { // finds a value and replace it by its word
  console.log('decodeFile');
  text = text.map((o, i) => { return uncode[o]; });
  console.log('decode yay '); // yay 3
  return text.join(" ");
}
function getSmart(dict, wordList) {// copies dict into more usable format with key and reps
  console.log('getSmart');
  let orderListWord = [];
  for (let key in dict) {
    if (dict.hasOwnProperty(key)) {
      orderListWord.push({ word: key, reps: dict[key], value: null });
    }
  }
  return orderListWord;
}
function getNaive(dict) { //copies into dict and gives value by order
  console.log('getNaive');
  let cDict = Object.assign({}, dict); // make a copy
  let dDict = {};
  let i = 1;
  for (var word in cDict) {
    if (cDict.hasOwnProperty(word)) {
      cDict[word] = i;
      i++;
    }
    return cDict;
  }
}

function sorterSmaller(array) {// sorts by order of least appearence first
  function comp(a, b) {
    if (a.reps > b.reps) {
      return -1;
    } else {
      return 1;
    }
  }
  array.sort(comp); // order by repititions
  array.map((o, i) => { o.value = i; });
}
function orderDict(dict) { // makes encoder and decoder dictionary
  let encoder = dict;
  let decoder = {};
  console.log('orderDict');
  for (let i = 0; i < array.length; i++) {
    encoder[array[i]['word']] = array[i]['value']; // encoder dict
    decoder[array[i]['value']] = array[i]['word']; // decoder dict
  }
  console.log('yay');// first yay
  return [encoder, decoder];
}