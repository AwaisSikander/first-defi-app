const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.002")
const AMOUNT1 = ethers.utils.parseEther("1")
async function getWeth() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    // call the deposit function on the weth contract
    // for that we need abi & contract address
    /* WETH */
    // MAIN
    // 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    // SEPOLIA
    // 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
        signer
    )

    const tx = await iWeth.deposit({ value: AMOUNT })
    tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)

    console.log(`Weth Balacne ${wethBalance.toString()}`)
}
module.exports = { getWeth, AMOUNT, AMOUNT1 }
