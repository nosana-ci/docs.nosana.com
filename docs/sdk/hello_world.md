# Hello World

Simple hello world typescript program to run an inference job on nosana.
This program will run `echo hello world` in an `ubuntu` container.

The output of `echo` that results in `stdout` is available in the the `result` object: `${JSON.stringify(result.opStates[0].logs)}`

To run this example:

```sh
npx tsx hello_world.ts
```

```ts
// hello_world.ts
import { PublicKey } from '@solana/web3.js';
import { Client, Job, sleep } from '@nosana/sdk'

const json_flow = {
  "version": "0.1",
  "type": "container",
  "meta": {
    "trigger": "cli"
  },
  "ops": [
    {
      "type": "container/run",
      "id": "hello-world",
      "args": {
        "cmd": "echo Hello Theoriq",
        "image": "ubuntu"
      }
    }
  ]
};

(async () => {

// Check if SOLANA_KEY is set in environment variables otherwise use `your_private_key_here`
const private_key: string = process.env.SOLANA_KEY ?? 'your_private_key_here';

// Instantiate Nosana client
const nosana: Client = new Client('mainnet', private_key);

console.log(`
Connected with wallet: ${nosana.solana.wallet.publicKey.toString()}
Solana balance: ${(await nosana.solana.getSolBalance())} SOL
Nosana balance: ${(await nosana.solana.getNosBalance())?.amount.toString()} NOS
`);

// Upload Nosana job definition to IPFS
const ipfsHash = await nosana.ipfs.pin(json_flow);

// Markets can be found at https://dashboard.nosana.com/markets
const market = new PublicKey('97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf')

// Post job with IPFS hash to market
const response = await nosana.jobs.list(ipfsHash, market);

console.log(`
Job posted!
IPFS uploaded: ${nosana.ipfs.config.gateway + ipfsHash}
Posted to market: https://dashboard.nosana.com/markets/${market.toBase58()}
Service URL: https://${response.job}.node.k8s.prd.nos.ci
Nosana Explorer: https://dashboard.nosana.com/jobs/${response.job}
`)

// Retrieve job from blockchain, loop until job is COMPLETED
let job: Job = await nosana.jobs.get(response.job);
// Job states are QUEUED, RUNNING, COMPLETED
while (!job || job.state !== "COMPLETED") {
  job = await nosana.jobs.get(response.job);
  console.log(`Job state: ${job.state}`)
  await sleep(5);
}

// Results are posted back to IPFS when COMPLETED, retrieve them with IPFS hash
const result = await nosana.ipfs.retrieve(job.ipfsResult);

console.log(`
Job done!
Job output logs:
${JSON.stringify(result.opStates[0].logs)}

Job result meta data:
${JSON.stringify(result)}

Job IPFS:
${nosana.ipfs.config.gateway}${job.ipfsResult}
`)
})()
```
