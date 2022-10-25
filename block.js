const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require("./config");
const shaHash = require("./shahash");

class Block{
    constructor({ timestamp , lastHash , data , hash , nonce , difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis(){
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock , data }){
        let hash , timestamp;
        // const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do{
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock , timestamp})
            hash=  shaHash(timestamp , lastHash , data , nonce , difficulty)
        }while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty))
        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
            // hash: shaHash(timestamp , lastHash , data , nonce , difficulty)
        })
        
    }
    static adjustDifficulty({ originalBlock , timestamp}){
        const {difficulty} = originalBlock;
        if(difficulty < 1) return 1;
        const difference = timestamp - originalBlock.timestamp;
        if(difference > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
        
    }
}

module.exports = Block;
