const INITIAL_DIFFICULTY = 3;
const MINE_RATE= 1000;
const GENESIS_DATA ={
    timestamp: 1,
    lastHash:"____",
    hash: "genesis block",
    data: [],
    difficulty:INITIAL_DIFFICULTY,
    nonce:0
};
module.exports = {GENESIS_DATA , MINE_RATE};