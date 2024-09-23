import { DedotClient, WsProvider } from 'dedot';
import { ContractDeployer, Contract } from 'dedot/contracts';
import { MyFlipperContractApi } from './types/my-flipper';
import { stringToHex } from 'dedot/utils'
import * as fs from 'fs/promises';
import { Keyring } from '@polkadot/keyring';
const POP_NETWORK_ENDPOINT = 'wss://rpc1.paseo.popnetwork.xyz';

/**
 * Run `npm install && npm start` to run the script
 */
const run = async () => {
    const provider = new WsProvider(POP_NETWORK_ENDPOINT);

    const client = await DedotClient.new(provider);


    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    console.log(alice.address);

    console.log('Connected to:', await client.rpc.system_chain());

    const myFlipperMeta: string = await fs.readFile('my_flipper.json', 'utf-8');

    const contractAddress = `5E3aSsKHBeDfo8wmwYYdCD3zpAmEtgoRJeNSK7d2tXEy4J9S`;

    // create a contract instace from its metadata & address
    const contract = new Contract<MyFlipperContractApi>(client, myFlipperMeta, contractAddress);

    // Making call to get the current value of the flipper contract
    const result = await contract.query.get({ caller: alice.address });
    const value: boolean = result.data;

    console.log("Value after deploying:", value);


    // // Disconnect from network
    await client.disconnect();
    console.log('Disconnected!');
};


run().catch(console.error);

