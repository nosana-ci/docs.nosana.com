# Endpoints

Setting Up and Communicating with Endpoints on the Nosana Network

When posting a job to the Nosana network, it is possible to specify the duration for which you want your compute job to be available. This means an instance will be accessible via an endpoint with which you can communicate.

This guide will walk you through setting up an Nginx server and interacting with its endpoint. Afterwards, we will set up a Llama instance and start communicating with it.

## Proof of concept: Nginx

Nginx is a high-performance web server and reverse proxy server that is widely used for serving static content, load balancing, and handling HTTP and HTTPS traffic.
It'll be a good proof of concept to showcase how to use a Nosana endpoint.

1. Setting Up an Nginx Server

Step 1: Define the Job Schema
Create a file called nginx.json and copy the following JSON schema into it:

```json
{
  "version": "0.1",
  "type": "container",
  "meta": {
    "trigger": "cli"
  },
  "ops": [
    {
      "type": "container/run",
      "id": "nginx",
      "args": {
        "cmd": [],
        "image": "nginx",
        "expose": 80
      }
    }
  ]
}
```

This schema specifies the use of the Nginx image and exposes port 80.

Step 2: Post the Job
Run the following command to post the job to the Nosana network:

```sh:no-line-numbers
nosana job post --file nginx.json --market 97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf
```

Once the job is running, you will see an output similar to this:

```sh:no-line-numbers
  _   _
 | \ | | ___  ___  __ _ _ __   __ _
 |  \| |/ _ \/ __|/ _` | '_ \ / _` |
 | |\  | (_) \__ \ (_| | | | | (_| |
 |_| \_|\___/|___/\__,_|_| |_|\__,_|

Reading keypair from /home/user/.nosana/nosana_key.json

Network: mainnet
Wallet:  4WtG17Vn3SSoTAVvXxpopQTG3Qo9NUK28Zotv4rL1ccv
SOL balance: 0.05066028 SOL
NOS balance: 66.781499 NOS
ipfs uploaded: https://nosana.mypinata.cloud/ipfs/QmTcNQ4dGq8veeg8v5cQyGoaJEPSYQnVTd1TvfckVFVzRu
posting job to market 97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf for price 0.000115 NOS/s (total: 0.8280 NOS)
job posted with tx 4UJ7Ad84PkaxDvx7VQWwNfNia7M7E4WJQeAomjEuA8xn5V4T9QWbQtusJgsQUV9Dj9o8bs1FL6hJhhAPUrYeLVpF!
Service will be exposed at https://FhkRunC6dAtPaEWGJwRK16Vctzv1KmHBhpSyUmMsYyMS.node.k8s.prd.nos.ci
Job:  https://dashboard.nosana.com/jobs/B3MmwHz7sovudYwMxZFwjS2E6eMRaEEqNgWao5RYUkLi
JSON flow: https://nosana.mypinata.cloud/ipfs/QmTcNQ4dGq8veeg8v5cQyGoaJEPSYQnVTd1TvfckVFVzRu
Market:  https://dashboard.nosana.com/markets/97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf
Price:  0.000115 NOS/s
Status:  RUNNING

run nosana job get B3MmwHz7sovudYwMxZFwjS2E6eMRaEEqNgWao5RYUkLi --network mainnet to retrieve job and result
```

::: info
Take note of the following line in the output:
The service will be exposed at
<https://FhkRunC6dAtPaEWGJwRK16Vctzv1KmHBhpSyUmMsYyMS.node.k8s.prd.nos.ci>
:::

Navigate to this link to find your Nginx service.

![nginx](./nginx.png)

Success! Your Nginx instance is running on the Nosana Network.

## Ollama Inference Endpoint

Now we will delve into how to setup an inference endpoint, where we will run an Ollama service and communicate with it.

Step 1: Define the Job Schema
Create a file named `ollama.json` and paste the following JSON schema into it:

Below we can see an example Nosana Job Definition that is used to post jobs to Nosana
Note there is one `ops` (short for operations) happening in this job. For this `ops` the [Ollama Docker Image](https://hub.docker.com/r/ollama/ollama).

Here we use [Ollama](https://github.com/ollama/ollama) to run [Gemma3](https://ollama.com/library/gemma3:4b).

```json
{
  "version": "0.1",
  "type": "container",
  "ops": [
    {
      "type": "container/run",
      "id": "ollama-service",
      "args": {
        "image": "docker.io/ollama/ollama:0.6.6",
        "entrypoint": ["/bin/sh"],
        "cmd": ["-c", "ollama serve & sleep 5 && ollama pull $MODEL && tail -f /dev/null"],
        "env": {
          "MODEL": "gemma3:4b-it-qat"
        },
        "gpu": true,
        "expose": 11434
      }
    }
  ]
}
```

Step 2: Post the Job
Run the following command to post the job:

```sh:no-line-numbers
nosana job post --file ollama.json --market nvidia-3090
```

Please note that it can take up to 5 minutes for your endpoint to be available. The Nosana team is working on reducing startup time to a few seconds.

Once the job is running, you will see an output similar to this:

```sh:no-line-numbers
$ npx @nosana/cli job post --file ollama.json --timeout 30 --market nvidia-3060
  _   _
 | \ | | ___  ___  __ _ _ __   __ _
 |  \| |/ _ \/ __|/ _` | '_ \ / _` |
 | |\  | (_) \__ \ (_| | | | | (_| |
 |_| \_|\___/|___/\__,_|_| |_|\__,_|

Reading keypair from /home/user/.nosana/nosana_key.json

Network:        mainnet
Wallet:         CTYw7JqNeh92BLFCJ5pR9HbpZHCsQPxtV2mZdD7WY2bD
SOL balance:    0.115372223 SOL
NOS balance:    49.046325 NOS
Service URL:    https://tzrYei3AxEa13vc1qY1VLoNniRKX7jF5dNJVq93HPPb5.node.k8s.prd.nos.ci
Job:            https://dashboard.nosana.com/jobs/H3fhW6p9qQ2anKERK85LCVd3TJu2DVPdX2FhzWLMUyqg
Market:         https://dashboard.nosana.com/markets/7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq
Status:         RUNNING

run nosana job get H3fhW6p9qQ2anKERK85LCVd3TJu2DVPdX2FhzWLMUyqg --network mainnet to retrieve job and result
```

You can visit the service URL to check the status.

![Page not found](./frp_page_not_found.png)

Initially, you might see a "Page not found" message. After 10 minutes, the Ollama service should be up and running, and you can start making requests to the endpoint.

::: info
Note the endpoint service url:
`https://tzrYei3AxEa13vc1qY1VLoNniRKX7jF5dNJVq93HPPb5.node.k8s.prd.nos.ci`
:::

The Ollama service will run a server that is available at `/api/generate`.
Append `/api/generate` to the URL to communicate with the Ollama service.

## Client Example

Try these client examples to talk to your endpoint, remember to fill in the endpoint with your own endpoint.

:::: tabs

@tab cURL

Use the following curl command to post a JSON body to the endpoint:

```sh:no-line-numbers
curl -X POST https://tzrYei3AxEa13vc1qY1VLoNniRKX7jF5dNJVq93HPPb5.node.k8s.prd.nos.ci/api/generate \
-H "Content-Type: application/json" \
-d "{\"model\": \"gemma3:4b-it-qat\", \"stream\": false, \"prompt\": \"What is water made of?\"}"
```

@tab JavaScript

Alternatively, you can use JavaScript:

```js
import https from 'https';

const data = JSON.stringify({
  model: 'gemma3:4b-it-qat',
  stream: false,
  prompt: 'What is water made of?',
});

const options = {
  hostname: '8enyfpbp5pba3pwyexvhpw1jhfurou9tundyhdexfuuk.node.k8s.prd.nos.ci',
  port: 443,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();
```

::::

## Response

The endpoint should return a response like this:

```json
{
  "model": "gemma3:4b-it-qat",
  "created_at": "2025-05-20T18:59:55.853156018Z",
  "response": "Water, chemically speaking, is incredibly simple! It's made up of just **two elements**:\n\n* **Hydrogen (H)** - There are always **two** atoms of hydrogen per water molecule.\n* **Oxygen (O)** - There is always **one** atom of oxygen per water molecule.\n\nSo, the chemical formula for water is **H₂O**. \n\n**Here’s a breakdown:**\n\n* **Molecules:** Water is formed when two hydrogen atoms bond with one oxygen atom.\n* **Covalent Bonds:** This bonding is strong and shares electrons between the atoms, making it a **covalent bond**.\n* **Polarity:** The oxygen atom is more electronegative than hydrogen, meaning it pulls the electrons closer to itself. This creates a slightly negative charge on the oxygen and a slightly positive charge on the hydrogens, making water a **polar molecule**. This polarity is key to many of water’s unique properties.\n\n---\n\n**Do you want to delve deeper into any aspect of this, such as:**\n\n*   Why water is so important for life?\n*   The properties of water due to its polarity (like surface tension)?",
  "done": true,
  "done_reason": "stop",
  "context": [
    105, 2364, 107, 3689, 563, 1813, 1603, 529, 236881, 106, 107, 105, 4368, 108, 17390, 236764, 71404, 12259, 236764,
    563, 20068, 3606, 236888, 1030, 236789, 236751, 1603, 872, 529, 1164, 5213, 13498, 4820, 66515, 108, 236829, 5213,
    154624, 568, 236814, 62902, 753, 2085, 659, 2462, 5213, 13498, 1018, 14514, 529, 13076, 810, 1813, 19544, 236761,
    107, 236829, 5213, 170701, 568, 236806, 62902, 753, 2085, 563, 2462, 5213, 811, 1018, 15639, 529, 12123, 810, 1813,
    19544, 236761, 108, 4324, 236764, 506, 7395, 6581, 573, 1813, 563, 5213, 236814, 238204, 236806, 84750, 236743, 108,
    1018, 8291, 236858, 236751, 496, 25890, 53121, 108, 236829, 5213, 236792, 107711, 53121, 7768, 563, 8254, 1056,
    1156, 13076, 14514, 6620, 607, 886, 12123, 15639, 236761, 107, 236829, 5213, 236780, 67568, 57790, 53121, 1174,
    41637, 563, 3188, 532, 12085, 16763, 1534, 506, 14514, 236764, 3043, 625, 496, 5213, 236755, 67568, 6620, 84750,
    107, 236829, 5213, 94229, 665, 53121, 669, 12123, 15639, 563, 919, 173969, 1280, 1082, 13076, 236764, 6590, 625,
    46714, 506, 16763, 12532, 531, 4850, 236761, 1174, 14004, 496, 8427, 5676, 5536, 580, 506, 12123, 532, 496, 8427,
    4414, 5536, 580, 506, 194152, 236764, 3043, 1813, 496, 5213, 47937, 19544, 84750, 1174, 63870, 563, 2307, 531, 1551,
    529, 1813, 236858, 236751, 4709, 5082, 236761, 108, 7243, 108, 1018, 6294, 611, 1461, 531, 92541, 19276, 1131, 1027,
    6084, 529, 672, 236764, 1288, 618, 53121, 108, 236829, 236743, 236743, 8922, 1813, 563, 834, 2132, 573, 1972,
    236881, 107, 236829, 236743, 236743, 669, 5082, 529, 1813, 2779, 531, 1061, 63870, 568, 5282, 3761, 16625, 20625
  ],
  "total_duration": 10396745846,
  "load_duration": 6274494427,
  "prompt_eval_count": 15,
  "prompt_eval_duration": 627555142,
  "eval_count": 240,
  "eval_duration": 3486209785
}
```

The service will be available for two hours before it gets taken down. Ensure you have enough NOS balance to cover this period; otherwise, you will be notified immediately.

Next up, we will go through the ins and outs of how to write a job, and the specifications you can customize for each job.
