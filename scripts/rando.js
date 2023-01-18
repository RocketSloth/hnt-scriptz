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

    // Generate a random index from the wordlist for each of the 12 words
    const startIndexes = [];
    for (let i = 0; i < 12; i++) {
        startIndexes.push(Math.floor(Math.random() * words.length));
    }

    // Iterate through all combinations of words from the wordlist, starting from the random index for each word
    for (let i = startIndexes[0]; i < words.length; i++) {
        for (let j = startIndexes[1]; j < words.length; j++) {
            for (let k = startIndexes[2]; k < words.length; k++) {
                // ...and so on for the remaining 9 words in the phrase
                for (let l = startIndexes[3]; l < words.length; l++) {
                    for (let m = startIndexes[4]; m < words.length; m++) {
                        for (let n = startIndexes[5]; n < words.length; n++) {
                            for (let o = startIndexes[6]; o < words.length; o++) {
                                for (let p = startIndexes[7]; p < words.length; p++) {
                                    for (let q = startIndexes[8]; q < words.length; q++) {
                                        for (let r = startIndexes[9]; r < words.length; r++) {
                                            for (let s = startIndexes[10]; s < words.length; s++) {
                                                for (let t = startIndexes[11]; t < words.length; t++) {
                                                    // Create a phrase using the current combination of words from the wordlist
                                                    const phrase = [
                                                        words[i],
                                                        words[j],
                                                        words[k],
                                                        words[l],
                                                        words[m],
                                                        words[n],
                                                        words[o],
                                                        words[p],
                                                        words[q],
                                                        words[r],
                                                        words[s],
                                                        words[t],
                                                    ];
                                                    // Print the current phrase
                                                    console.log(`Trying phrase: ${phrase.join(' ')}`);
                                                    
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
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
