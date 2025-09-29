# Post Jobs with Credits

Use your API key to create, extend, and stop jobs with Nosana credits. The SDK provides wrappers under `client.api`:

- `client.api.credits.balance()` — check your available credits
- `client.api.jobs.list()` — create a job using credits
- `client.api.jobs.extend()` — extend the maximum timeout of a job
- `client.api.jobs.stop()` — stop a job

[API reference](https://dashboard.k8s.prd.nos.ci/api/swagger#tag/credits).

## Prerequisites

- Install the SDK

```sh:no-line-numbers
npm install @nosana/sdk
```

- An active API key

## Get an API Key

You can create an API key from the Nosana dashboard.

1. Log in at `https://dashboard.nosana.com`
2. Go to `Account`
3. Find the `API Keys` section
4. Click `Create Key`

![API keys overview](../.vuepress/public/api_keys.png)

![Create API key](../.vuepress/public/create_key.png)

## Initialize the client with API key

```ts
import { Client, sleep } from '@nosana/sdk';

const API_KEY = process.env.NOSANA_API_KEY ?? 'nos_xxx_your_api_key';

const client = new Client('mainnet', undefined, {
  apiKey: API_KEY,
});
```

## Check credit balance

```ts
const balance = await client.api.credits.balance();
const available = balance.assignedCredits - balance.reservedCredits - balance.settledCredits;
console.log(`Balance available: $${available.toFixed(2)}`);
```

## Create a job using credits

Upload your job definition to IPFS, then create the job with the returned IPFS hash.

```ts
const jobDefinition = {
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
        "cmd": "for i in `seq 1 30`; do echo $i; sleep 1; done",
        "image": "ubuntu"
      }
    }
  ]
}

const ipfsHash = await client.ipfs.pin(jobDefinition);

// Markets can be found on the dashboard explorer
const market = '7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq';

const listResp = await client.api.jobs.list({
  ipfsHash,
  market,
  timeout: 1800, // max. 30 minutes
});

console.log('Created job:', listResp);
```

## Extend a running job

```ts
const extendResp = await client.api.jobs.extend({
  jobAddress: listResp.jobAddress,
  extensionSeconds: 1800, // +30 minutes
});

console.log('Extended job:', extendResp);
```

## Stop a job

```ts
const stopResp = await client.api.jobs.stop({ jobAddress: listResp.jobAddress });
console.log('Stopped job:', stopResp);
```

## Full example

```ts
import { Client, sleep } from '@nosana/sdk';

(async () => {
  try {
    const API_KEY = process.env.NOSANA_API_KEY ?? 'nos_xxx_your_api_key';

    const client = new Client('mainnet', undefined, {
      apiKey: API_KEY,
    });

    const balance = await client.api.credits.balance();
    const available = balance.assignedCredits - balance.reservedCredits - balance.settledCredits;
    console.log(`Balance available: $${available.toFixed(2)}`);

    const jobDefinition = {
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
            "cmd": "for i in `seq 1 30`; do echo $i; sleep 1; done",
            "image": "ubuntu"
          }
        }
      ]
    }

    const ipfsHash = await client.ipfs.pin(jobDefinition);

    // Markets can be found on the dashboard explorer
    const market = '7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq';

    const listResp = await client.api.jobs.list({
      ipfsHash,
      market
    });

    console.log('Created job:', listResp);

    await sleep(10);

    // Extend the job
    const extendResp = await client.api.jobs.extend({
      jobAddress: listResp.jobAddress,
      extensionSeconds: 1800, // +30 minutes
    });
    console.log('Extended job:', extendResp);

    // Stop the job
    const stopResp = await client.api.jobs.stop({ jobAddress: listResp.jobAddress });
    console.log('Stopped job:', stopResp);
  } catch (e) {
    console.error('Example failed:', e);
    process.exit(1);
  }
})();
```
