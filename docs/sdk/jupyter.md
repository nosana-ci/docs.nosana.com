# Jupyter

With this example you will spin up a jupyter notebook, Note that a service url will be printed.
By following that service url, you will be able to access the Jupyter Instance running on the Nosana Grid.
In this example it would be something like:
`Service URL: https://8pAaw3fc9AqroEB15yFYckgTPJVDtwqp2xDKczE2uqtZ.node.k8s.prd.nos.ci`

To run this example, run:

```sh
npx tsx jupyter.ts
```

```ts
// jupyter.ts

import { PublicKey } from '@solana/web3.js';
import { Client, Job, sleep } from '@nosana/sdk'

// Define Nosana job definition
const json_flow = {
  "version": "0.1",
  "type": "container",
  "meta": {
    "trigger": "cli"
  },
  "ops": [
    {
      "type": "container/run",
      "id": "jupyter-notebook",
      "args": {
        "cmd": [
          "bash",
          "-c",
          "source /etc/bash.bashrc && jupyter notebook --notebook-dir=/tf --ip 0.0.0.0 --no-browser --allow-root --NotebookApp.token='' --NotebookApp.password=''"
        ],
        "expose": 8888,
        "image": "docker.io/tensorflow/tensorflow:2.17.0-gpu-jupyter",
        "gpu": true
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

let job: Job = await nosana.jobs.get(response.job);
// Job states are QUEUED, RUNNING, COMPLETED
while (!job || job.state === "QUEUED"|| job.state !== "RUNNING") {
  job = await nosana.jobs.get(response.job);
  console.log(`Check job state: ${job.state}`)
  await sleep(5);
}
})();

```
