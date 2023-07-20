const { ethers, getNamedAccounts } = require("hardhat")
const { getWeth, AMOUNT, AMOUNT1 } = require("./getWeth")
const { default: ADDRESSES } = require("../constants/CONTRACT_ADDRESSES")
const lendingPoolAddressAbi = require("../abis/LendingPoolAddressProvider.json")
const poolAbi = require("../abis/Pool.json")

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        lendingPoolAddressAbi,
        ADDRESSES.POOL_ADDRESS_PROVIDER,
        account
    )
    const lendingPoolAddress = await lendingPoolAddressProvider.getPool()

    const lendingPool = await ethers.getContractAt(
        "IPool",
        lendingPoolAddress,
        account
    )
    return lendingPool
}
async function main() {
    // protocol treats every thing as ERC20 token
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const lendingPool = await getLendingPool(signer)
    console.log(`LendingPool address ${lendingPool.address}`)
    /* DEPOSIT */

    /* WETH */
    // MAIN
    // 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    // SEPOLIA
    // 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
    const wethTokenAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, signer)
    // PROVE
    // const addr = await signer.getAddress()
    const gasLimit = 3000000
    console.log(`Depositing......`, deployer)
    const tx = await lendingPool.supply(
        wethTokenAddress,
        AMOUNT1,
        deployer,
        0
        // { gasLimit }
    )
    tx.wait(6)
    console.log(`Deposited......`)
    console.log(tx)
    // const tx1 = await lendingPool.getReserveData(wethTokenAddress)
    // console.log(tx1.toString())
}

async function approveErc20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log(`Approved`)
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
