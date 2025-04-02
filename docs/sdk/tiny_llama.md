# Tiny Llama

This is an example where we run an inference to a Tiny Llama model.
We prompt it with `Write me a story about Tony the tiny hawk`.

To run this example, run:

```sh
npx tsx tiny_llama.ts
```

```ts
// tiny_lamma.ts

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
      "id": "tinyllama",
      "args": {
        "cmd": ["'Write me a story about Tony the tiny hawk'"],
        "image": "docker.io/jeisses/tinyllama:v4",
        "gpu": true
      }
    }
  ]
};

(async () => {
// Check if SOLANA_KEY is set in environment variables otherwise use `your_private_key_here`
const private_key: string = process.env.SOLANA_KEY ?? 'your_private_key_here';

// Insatiate Nosana client
const nosana: Client = new Client('mainnet', private_key);

console.log(`
Connected with wallet: ${(nosana.solana.wallet).publicKey.toString()}
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

let job: Job = await nosana.jobs.get(response.job);
// Job states are QUEUED, RUNNING, COMPLETED
while (!job || job.state === "RUNNING") {
  job = await nosana.jobs.get(response.job);
  console.log(`Job state: ${job.state}`)
  await sleep(5);
}

const result = await nosana.ipfs.retrieve(job.ipfsResult);
const chat_response = result.opStates[0].logs.map((log: any) => log.log).join("")

console.log(`
Job done!

Chat response:
${chat_response}

Job IPFS:
${nosana.ipfs.config.gateway}${job.ipfsResult}
`)
})()
```
