const { Keypair, Address } = require('@helium/crypto');
const inquirer = require('inquirer');
const words = require('./wordlist/english.json');
const fs = require('fs');
const { log } = console;

// Read addresses from file
const addresses = fs.readFileSync('addresses.txt', 'utf8').split('\n');

// Function to search for the missing words in a 12-word phrase
async function findMissingWords(addresses) {
  // Initialize a variable to store the number of iterations
  let count = 0;
  let counter = 0;

  // Open a writable file stream for the 'matches.txt' file
  const stream = fs.createWriteStream('matches.txt', { flags: 'a' });

  // Set a maximum number of iterations
  const maxIterations = 50000000;

  // Try random combinations of words in the wordlist until a match is found or the maximum number of iterations is reached
  while (count < maxIterations) {
    // Create a phrase using random words from the wordlist
    const phrase = [
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
      words[Math.floor(Math.random() * words.length)],
    ];

    // Print the current phrase
    //console.log(`Trying phrase: ${phrase.join(' ')}`);

    // Add a delay of 1 second between each iteration
    //await new Promise(resolve => setTimeout(resolve, 1));

    // Check if the resulting phrase creates any of the desired addresses
    const keypair = await Keypair.fromWords(phrase).catch(() => {});
    const newAddress = keypair ? keypair.address.b58 : [];
    console.log(`newAddress: ${newAddress}`);
    console.log(`iteration ${counter}`);
    //console.log(`includes result: ${addresses.includes(newAddress)}`);

    if (addresses.includes(newAddress)) {
      // Save the match to a file
      fs.appendFileSync('matches.txt', `${phrase.join(' ')}\n`);
      // Return the missing words that create the desired address
      return phrase;
    }
  // Increment the iteration count
  count++;
  counter++;
  }

  // If no combination of words is found to create the desired address, return an empty array
  return [];
}


async function findWord() {
  // Call the findMissingWords() function to search for the missing words
  const result = await findMissingWords(addresses);
  if (result) {
    log(`The missing words are: ${result.join(' ')}`);
  }
  else{
    log(`Could not find the missing words.`);
  }
}
// Call the findWord() function to search for the missing words
findWord().then(() => console.log('Done'));
