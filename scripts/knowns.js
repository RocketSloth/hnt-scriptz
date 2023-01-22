const { Keypair, Address } = require('@helium/crypto');
const inquirer = require('inquirer');
const words = require('./wordlist/english.json');
const fs = require('fs');
const { log } = console;

// Read addresses from file
const addresses = fs.readFileSync('addresses.txt', 'utf8').split('\n');

async function findMissingWords(addresses) {
    // Initialize a variable to store the number of iterations
    let count = 0;
    let counter = 0;

    // Open a writable file stream for the 'matches.txt' file
    const stream = fs.createWriteStream('matches.txt', { flags: 'a' });

    // Set a maximum number of iterations
    const maxIterations = 5000000;

    // Ask the user for the number of known words
    const { knownPhrase } = await inquirer.prompt([
        {
            type: 'input',
            name: 'knownPhrase',
            message: 'Enter the known words, separated by spaces:',
        },
    ]);

    // Split the known words into an array
    const knownWordsArray = knownPhrase.split(' ');

    // Create an empty object to store the new address and its corresponding phrase
    let newAddress = {}

    // Try random combinations of words in the wordlist until a match is found or the maximum number of iterations is reached
    while (count < maxIterations) {
        // Create a phrase using random words from the wordlist
        const phrase = [
          ...knownWordsArray,
          //words[Math.floor(Math.random() * words.length)],
          //words[Math.floor(Math.random() * words.length)],
          //words[Math.floor(Math.random() * words.length)],
          //words[Math.floor(Math.random() * words.length)],
          //words[Math.floor(Math.random() * words.length)],
          words[Math.floor(Math.random() * words.length)],
          words[Math.floor(Math.random() * words.length)],
          words[Math.floor(Math.random() * words.length)],
          words[Math.floor(Math.random() * words.length)],
          words[Math.floor(Math.random() * words.length)],
          words[Math.floor(Math.random() * words.length)],
        ];
    
        // Check if the resulting phrase creates any of the desired addresses
        try {
          const keypair = await Keypair.fromWords(phrase);
          newAddress.address = keypair.address.b58;
          newAddress.phrase = phrase;
          console.log(`iteration ${counter}`);
          console.log(`newAddress: ${newAddress.address}`);
          console.log(`${newAddress.phrase}`);
    
          if (addresses.includes(newAddress.address)) {
            // Save the match to a file
            fs.appendFileSync('matches.txt', `${newAddress.phrase.join(' ')}\n`);
            // Return the new address and its corresponding phrase
            return newAddress;
          }
        } catch (error) {
          //console.log(error)
        }
        // Reset newAddress object
        newAddress = {};
        // Increment the iteration count
        count++;
        counter++;
      }
    
// If no combination of words is found to create the desired address, return an empty object
return {};
}

async function findWord() {
  try{
    // Call the findMissingWords() function to search for the new address and its corresponding phrase
    const result = await findMissingWords(addresses);
    if (result.address) {
      log(`The new address is: ${result.address}`);
      log(`The corresponding phrase is: ${result.phrase.join(' ')}`);
    } else {
      log(`Could not find the new address and its corresponding phrase.`);
    }
  }catch(error){
    //console.log(error)
  }
}
// Call the findWord() function to search for the new address and its corresponding phrase
findWord().then(() => console.log('Done'));
   
