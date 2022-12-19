const { Keypair, Address } = require('@helium/crypto');
const words = require('./wordlist/english.json');
const fs = require('fs');
const { log } = console;
const readline = require('readline');

let phraseString = '';

// Function to search for the missing words in a 12-word phrase
async function findMissingWords(phraseString, addresses) {
  // Declare the iterations variable
  let iterations = 0;
  const maxIterations = 10000000; // Adjust this value as needed

  // Keep looping until a match is found
  while (true) {
    // Create an array of shuffled words for each position in the phrase
    let wordsShuffled = [];
    for (let i = 0; i < 12; i++) {
      // Shuffle the words array for this position
      wordsShuffled[i] = words.sort(() => Math.random() - 0.5);
    }

    // Create an array to hold the selected words for the phrase
    let phrase = [];

    // Select a word for each position in the phrase
    for (let i = 0; i < 12; i++) {
      phrase[i] = wordsShuffled[i][0];
    }
    for (let j = 1; j < 12; j++) {
      phrase[j] = wordsShuffled[j][1];
    }
    for (let k = 2; k < 12; k++) {
      phrase[k] = wordsShuffled[k][2];
    }
    for (let l = 3; l < 12; l++) {
      phrase[l] = wordsShuffled[l][3];
    }
    for (let m = 4; m < 12; m++) {
      phrase[m] = wordsShuffled[m][4];
    }
    for (let n = 5; n < 12; n++) {
      phrase[n] = wordsShuffled[n][5];
    }
    for (let o = 6; o < 12; o++) {
      phrase[o] = wordsShuffled[o][6];
    }
    for (let p = 7; p < 12; p++) {
      phrase[p] = wordsShuffled[p][7];
    }
    for (let q = 8; q < 12; q++) {
      phrase[q] = wordsShuffled[q][8];
    }
    for (let r = 9; r < 12; r++) {
      phrase[r] = wordsShuffled[r][9];
    }
    for (let s = 10; s < 12; s++) {
      phrase[s] = wordsShuffled[s][10];
    }
    for (let t = 11; t < 12; t++) {
      phrase[t] = wordsShuffled[t][11];
    }

    // Check if the resulting phrase creates any of the desired addresses
    const keypair = await Keypair.fromWords(phrase).catch(() => {});
    const newAddress = keypair ? keypair.address.b58 : [];
    if (addresses.includes(newAddress)) {
      // Save the matching recovery phrase to a file
      fs.appendFile('matches.txt', `${phrase}\n`, (error) => {
        if (error) {
          console.error(error);
        }
      });

      // Return the missing words that create the desired address
      return phrase;
    }
    // Increment the iteration counter
    iterations++;

    // Check if the number of iterations is a multiple of 10,000
    if (iterations % 10000 === 0) {
      // Print the number of iterations
      console.log(`Iterations: ${iterations}`);
      // Print the number of iterations
      console.log(`${phrase}`);
      // Check if a match has been found
      const missingWords = await findMissingWords(phraseString, addresses);
      if (missingWords) {
        // Return the missing words if a match was found
        return missingWords;
      }
    }
    // Check if the maximum number of iterations has been reached
    //if (iterations >= maxIterations) {
    ///  break;
    //}
  }
}

// Read the .txt file
fs.readFile('addresses.txt', 'utf8', (error, data) => {
  if (error) {
    console.error(error);
  } else {
    // Split the contents of the file on newline characters to get an array of addresses
    const addresses = data.split('\n');
    // Pass the addresses array to the findMissingWords function
    findMissingWords(phraseString, addresses);
  }
});

