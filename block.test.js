const hexToBinary = require('hex-to-binary');
const Block = require("./block");
const { GENESIS_DATA , MINE_RATE } = require("./config");
const shaHash = require("./shahash");

describe("Block" , () => {
    const timestamp=2000;
    const lastHash="asfa";
    const hash="aqwer";
    const data="data";
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp , lastHash , hash , data , nonce , difficulty});
    
    it("block has a timestamp, lasthash , hash , data",()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })
    describe('genesis()' , ()=> {
        const genesisBlock = Block.genesis();
        console.log("genesis block" , genesisBlock)
        it('is genesis block an instance of Block' , () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it("returns the data of genesis" , ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA)
        });
    })
    describe('mineBlock()' , () => {
        const lastBlock = Block.genesis();
        const data = 'data';
        const minedBlock = Block.mineBlock({ lastBlock , data });

        it('is mined block an instance of Block' , () => {
            expect(minedBlock instanceof Block).toBe(true);
        });
        it('sets the `lastHash` to be the `hash` of the lastblock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        })
        it('sets the data' , ()=>{
            expect(minedBlock.data).toEqual(data);
        })
        it('sets a timestamp' , ()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        })
        it('creates a sha 256 hash based on proper inputs' , () => {
            expect(minedBlock.hash).toEqual(shaHash(
                minedBlock.timestamp , 
                lastBlock.hash , 
                minedBlock.nonce,
                minedBlock.difficulty,
                data
            ));
        })
        it('sets a `hash` that matches the difficulty', ()=>{
            expect(hexToBinary(minedBlock.hash).substring(0 , minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
        })
        it("adjust the difficulty" , ()=>{
            const possibleResults = [lastBlock.difficulty+1 , lastBlock.difficulty-1]
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)
        })
    })
    describe('adjustDifficulty()', () => { 
        it('raises the difficulty for quickly mined block' ,()=>{
            expect(Block.adjustDifficulty({originalBlock:block , timestamp: block.timestamp + MINE_RATE - 100})).toEqual(block.difficulty+1)
        })
        it('lowers the difficulty for slowly mined block' ,()=>{
            expect(Block.adjustDifficulty({originalBlock:block , timestamp: block.timestamp + MINE_RATE + 100})).toEqual(block.difficulty-1)    
        })
        it('has a lower limit of 1' , ()=>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock:block})).toEqual(1);
        })
     })
});
