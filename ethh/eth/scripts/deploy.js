const hre = require("hardhat");

async function main() {
    // Compile the contract
    const SalutCrestin = await hre.ethers.getContractFactory("SalutCrestin");

    // Initial supply in ethers (e.g., 1000 tokens with 18 decimals)
    const initialSupply = hre.ethers.parseEther("1000");

    // Deploy the contract
    const salutCrestin = await SalutCrestin.deploy(initialSupply);

    console.log("Waiting for contract to be deployed...");
    await salutCrestin.waitForDeployment(); // Wait for deployment confirmation

    // Log the deployed contract address
    console.log(`SalutCrestin contract deployed to: ${salutCrestin.target}`);
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
