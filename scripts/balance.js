const { Keypair, Address } = require('@helium/crypto');
const inquirer = require('inquirer');
const words = require('./wordlist/english.json');
const fs = require('fs');
const { log } = console;
const { Client } = require('@helium/http');
const client = new Client();
client.network.endpoint; //= https://api.helium.io/v1

// Function to search for the missing words in a 12-word phrase
async function findMissingWords() {
    // Initialize a variable to store the number of iterations
    
    let counter = 0;
  
    // Open a writable file stream for the 'matches.txt' file
    const stream = fs.createWriteStream('matches.txt', { flags: 'a' });
  
    // Set a maximum number of iterations
    const maxIterations = 50000000;
  
    // Try random combinations of words in the wordlist until a match is found or the maximum number of iterations is reached
    while (counter < maxIterations) {
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
        try {
            // Check if the resulting phrase creates any of the desired addresses
            const keypair = await Keypair.fromWords(phrase);
            const address = keypair.address.b58;
            console.log(`address: ${address}`);
            console.log(`${phrase}`);
            console.log(`iteration ${counter}`);
            
    
            if (Address.isValid(address)) {
                let balance = await client.accounts.get(address);
                console.log(`Balance: ${balance.balance}`);
                if (balance > 0) {
                fs.appendFileSync('matches.txt', `${address} ${phrase.join(' ')}\n`);
                return { address, phrase };
                }
            }
           
        } catch (error) {
           // console.log(error)
        } 
        counter++;   
    }
    return null;
}

findMissingWords().then(() => console.log('Done'));
