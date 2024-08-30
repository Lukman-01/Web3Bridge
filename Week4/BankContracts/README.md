npx hardhat ignition deploy ./ignition/modules/SaveERC20.ts --network lisk-sepolia

npx hardhat run scripts/interaction.ts --network lisk-sepolia

npx hardhat verify --network lisk-sepolia <deployed address>