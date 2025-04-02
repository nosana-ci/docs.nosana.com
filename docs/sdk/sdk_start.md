# SDK Start

After reading how to use the `@nosana/cli` section, you should have a clear understanding of how to post and retrieve inference jobs on Nosana.
Now in this section we will dive a bit deeper into how this is done with the `@nosana/sdk`.
The steps are a bit more manual, in the sense, you will have to upload the data to IPFS, post the job, wait, and retrieve the job.

These are the basics steps needed to get started using the SDK.

1. Installing dependencies
2. Importing the dependencies
3. Instantiating the Nosana SDK client
4. Create Nosana JSON job definition
5. Upload job definition to IPFS
6. List job to Nosana grid with IPFS hash and Nosana market address
7. Wait for jobs to complete
8. Retrieve job data from blockchain
9. Retrieve results from IPFS
10. Expose service URL to website or API

## Installing dependencies

To begin, install the Nosana SDK to the folder, using NPM or your favorite JS runtime.

:::: tabs
@tab npm
[Node.JS](https://nodejs.org/en)
```sh:no-line-numbers
npm install @nosana/sdk
```

@tab Yarn
[Yarn](https://yarnpkg.com/)
```sh:no-line-numbers
yarn install @nosana/sdk
```

@tab pnpm
[pnpm](https://pnpm.io/)
```sh:no-line-numbers
pnpm install @nosana/sdk
```

@tab Bun
[Bun](https://bun.sh/)
```sh:no-line-numbers
bun install @nosana/sdk
```
::::


## Imports and Initial Setup

```ts
import { PublicKey } from '@solana/web3.js';
import { Client, Job, sleep } from '@nosana/sdk'
```

- The script imports several packages:
 - `import { Client, }` is the Nosana client that enables interaction with the Solana blockchain and Nosana APIs.
 - `sleep` from `../src/utils` is a helper function to pause execution for a specified time (used to periodically check job status).
 - `PublicKey` from `@solana/web3.js` handles Solana public keys.
- The `nosana` client instance is initialized with the `mainnet` network configuration. It is also possible to specify `devnet` as the network.

This guide assumes you already have a wallet with funds on it.
You will need to have at least `0.05` Solana and enough Nosana to cover the cost of the job.

## Creating the Nosana client and Logging In

After we have imported the required packages, we can start by instantiating the client.

Here we pass in the credentials needed to connect with our Solana Wallet.
Note how we check for the Environment variable before we try use the private_key variable.

```ts
const private_key: string = process.env.SOLANA_KEY ?? 'your_private_key_here';

// Now we can create the Nosana client and hook in our Solana wallet.
const nosana: Client = new Client('mainnet', private_key);
```

Here we have to make sure we are logged in correctly.
This logs the public key of the wallet associated with the Nosana client instance.
It is also possible to retrieve the balance of SOL and NOS for this account.

```typescript
console.log(`
Connected with wallet: ${nosana.solana.wallet.publicKey.toString()}
Solana balance: ${(await nosana.solana.getSolBalance())} SOL
Nosana balance: ${(await nosana.solana.getNosBalance())?.amount.toString()} NOS
`);
```

## Workflow Definition

Next up comes the workflow definition, this JSON object will specify the parameters needed to run an inference job on Nosana.

These are the minimum required properties to run a hello world example on the Nosana Grid.
Let's go through them one by one:

- `ops`:
  This is short for operations, as can be seen in this example it is an array.
  A Nosana workflow definition can contain multiple operations.
  It is possible to chain these operations and move assets between the operations, but is beyond the scope of this tutorial.
- `op`:
  The motif continues and this is short for operation, here we define the context of the operation.
  As we can see here, this operation will run within a container.
- `id`:
  A simple custom identifier for what this operation is.
- `args`:
  Short for arguments, here we start specifying the commands images for the operation.

  - `cmds`:
    An array of the commands
    - `cmd`:
      The shell commands that will run in the container
    - `image`:
      The image that will be loaded as the running environment.

For a full list of all of the properties for the Nosana Job definition please go to: [Writing a Job](../inference/writing_a_job.md).

```typescript
const json_flow = {
 ops: [
   {
     op: 'container/run',
     id: 'hello-world',
     args: {
       cmds: [
         {
           cmd: 'echo hello world',
         },
       ],
       image: 'ubuntu',
     },
   },
 ],
};
```

The `json_flow` object defines a workflow for running a Docker container.
In this case, it specifies an operation (`op`) to run a container with the `ubuntu` image and execute the command `echo hello world`.

## Uploading to IPFS

Now that we have all of our building blocks in place, the next step is to start uploading them, so they can be registered in the smart contract.
In this example we will be using IPFS to upload our data, this way we will be able to get a hash that will be used to register the job to the blockchain.

By using `nosana.ipfs.pin()` we can upload any data we want, in this it will be the Nosana JSON job definition we created above.
After it has been successfully uploaded, the resulting IPFS hash is logged, and can be used to retrieve the workflow

 ```typescript
const ipfsHash = await nosana.ipfs.pin(json_flow);
console.log(`IPFS uploaded: ${nosana.ipfs.config.gateway}ipfsHash`);
 ```

## Posting and Monitoring a Job

This posts the job using the `jobs.list()` method, which takes the IPFS hash of the workflow and a Nosana market address.
Markets can be found at the [Nosana Explorer](https://dashboard.nosana.com/markets).
The response contains details of the posted job, such as the job address and transaction_id.
Posting the job means it will be posted to the Solana blockchain, and processed by the Nosana smart contract.
When this happens, a Nosana Node that is waiting in the queue, monitoring the blockchain for new jobs, will claim it and run it.

```typescript
const market = new PublicKey('97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf')

// Post job with IPFS hash to market
const response = await nosana.jobs.list(ipfsHash, market);

console.log(`
Posted to market: https://dashboard.nosana.com/markets/${market.toBase58()}
Nosana Explorer: https://dashboard.nosana.com/jobs/${response.job}
`)
```

After the job has been posted, all we have to do is wait.
This usually takes about 10 seconds, from posting the job, to a Nosana Node running the job, to posting the results back.

The script then enters a loop to monitor the job status.
It uses the `jobs.get()` method to check the job's state, waiting until it reaches a `COMPLETED` state.
The job state are `QUEUED`, `RUNNING` or `COMPLETED`.

```typescript
// Retrieve job from blockchain, loop until job is COMPLETED
let job: Job = await nosana.jobs.get(response.job);
while (!job || job.state !== "COMPLETED") {
  job = await nosana.jobs.get(response.job);
  console.log(`Job state: ${job.state}`)
  await sleep(5);
}
```

## Retrieving Job Result from IPFS

Once the job is complete, the result (which was stored in IPFS) is retrieved using the `ipfs.retrieve()` method.
The result is then logged, in this case the result is that `hello world` has been printed to stdout, and can be seen in the logs.

```typescript
const result = await nosana.ipfs.retrieve(job.ipfsResult);
console.log(result);
```

## Conclusion

For a complete overview of this example take a look at: [Hello World](./hello_world.md)
