const fs = require('fs');
const csv = require('csv-parser');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// Function to read the CSV and return an array of objects
function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to generate the Merkle tree and proofs
async function generateMerkleTree(csvFile) {
  // Read the CSV file
  const data = await readCSV(csvFile);

  // Map the data to an array of leaf nodes (hashed address + amount)
  const leaves = data.map((row) => {
    const address = row.address.trim();
    const amount = row.amount.trim();
    return keccak256(`${address},${amount}`);
  });

  // Create the Merkle tree
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  // Get the Merkle root
  const merkleRoot = merkleTree.getHexRoot();
  console.log('Merkle Root:', merkleRoot);

  // Generate proofs for each address and save them in an object
  const proofs = {};
  data.forEach((row) => {
    const address = row.address.trim();
    const amount = row.amount.trim();
    const leaf = keccak256(`${address},${amount}`);
    const proof = merkleTree.getHexProof(leaf);
    proofs[address] = { proof, amount };
  });

  // Write the proofs to a JSON file
  fs.writeFileSync('proofs.json', JSON.stringify(proofs, null, 2));

  console.log('Proofs saved to proofs.json');
}

// Run the script with the provided CSV file
const csvFile = process.argv[2];
if (!csvFile) {
  console.error('Please provide a CSV file as an argument.');
  process.exit(1);
}

generateMerkleTree(csvFile).catch((error) => {
  console.error('Error generating Merkle tree:', error);
  process.exit(1);
});