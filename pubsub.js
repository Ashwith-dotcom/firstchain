const PubNub = require("pubnub")

const credentials = {
    publishKey: "pub-c-b1ef194a-3232-44fc-9e77-f146525d124c",
    subscribeKey: "sub-c-942d71ad-5b69-4de0-9dfe-eb02de5292ba",
    secretKey: "sec-c-ZThkZmRlZjktMDUzMy00NGE1LWJlYzEtZjEwYzE1MDVhOTFk"
};

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
}

class PubSub{
    constructor({ blockchain }){
        this.blockchain = blockchain;
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({channels: [Object.values(CHANNELS)]})
        this.pubnub.addListener(this.listener())
    }
    listener(){
        return{
            message: (messageObject)=> {
                const { channel , message } = messageObject;

                console.log(`Message received. Channel: ${channel} . Message: ${message}`)
                const parsedMessage = JSON.parse(message);
                if(channel === CHANNELS.BLOCKCHAIN)
                {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        }
    }
    publish({channel,message}){

        this.pubnub.unsubscribe(channel , ()=>{
            this.pubnub.publish(channel , message ,()=>{
                this.pubnub.subscribe(channel)
            })
        })
        
    }
    subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
    }
    broadcastChain() {
        this.publish({
          channel: CHANNELS.BLOCKCHAIN,
          message: JSON.stringify(this.blockchain.chain)
        });
      }  
}
// const testPubSub = new PubSub();
// testPubSub.publish({channel: CHANNELS.TEST , message: "using pubnub"});
module.exports = PubSub;