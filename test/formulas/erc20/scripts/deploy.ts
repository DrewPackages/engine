import { ethers } from "hardhat";

async function main() {
  const tokenName = process.env.TOKEN_NAME!;
  const tokenSymbol = process.env.TOKEN_SYMBOL!;
  const totalSupply = Number.parseInt(process.env.TOKEN_SUPPLY!);

  if (!tokenName || !tokenSymbol || !totalSupply) {
    throw new Error("Params for token not found");
  }

  const token = await ethers.deployContract("MyToken", [
    tokenName,
    tokenSymbol,
    BigInt(totalSupply) * BigInt(10 ** 18),
  ]);

  await token.waitForDeployment();

  console.log(`My token deployed with address ${token.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .then(() => process.exit(0));
