# DeepSeek R1

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/4c31VE60bII?si=UWZN1sAenS7PSqea"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen>
</iframe>

## Introduction

A high-throughput and memory-efficient inference engine for running DeepSeek's R1-Qwen-1.5B model using vLLM. This template provides an OpenAI-compatible API server for the R1-Qwen-1.5B model, optimized for performance using vLLM. This model is based on Qwen2.5-Math-1.5B and fine-tuned with DeepSeek-R1 samples, offering efficient performance for lightweight deployments.

The advantage of using Nosana with DeepSeek R1 is that it simplifies the deployment process, allowing you to focus on model development and optimization.

## Quick Start

Can't wait to get started? Here's a quick guide to deploying the DeepSeek R1 model using the Nosana CLI.

### Using the Nosana Dashboard

For complete beginners, the easiest way to deploy the DeepSeek R1 model is through the Nosana Dashboard. The Dashboard provides a user-friendly interface that guides you through the deployment process step by step.

**Deploy this model now with [Nosana Dashboard](https://dashboard.nosana.com/jobs/create?templateId=deepseek-r1-qwen-1.5b)**

### Using Nosana CLI

Assuming you have the [Nosana CLI](https://github.com/nosana-ci/nosana-cli) installed and you have topped up your wallet with [SOL](https://solana.com/) and [NOS](https://nosana.com/token).

To get your wallet address, and top up your wallet:

```bash
npx @nosana/cli address
```

Deploy the DeepSeek R1 model using the following command:

```bash
npx @nosana/cli job post \
  --url https://github.com/nosana-ci/pipeline-templates/raw/refs/heads/main/templates/Deepseek-R1-Qwen-7B/job-definition.json \
  --market nvidia-4090 \
  --timeout 60 \
  --wait \
  --verbose
```

This will deploy the DeepSeek R1 model on the Nosana network using the specified job definition file.
You will see some output indicating the status of the deployment process, and once the job is successfully deployed, you can start using the model right away.

The model will be available for use at the Service URL provided in the output.
Which has the following format:

```text
Service will be exposed at https://<nosana-job-id>.node.k8s.prd.nos.ci
```

### Interacting with the Model

Now you can interact with the deployed model using the provided Service URL.
Use curl, Postman, or any other HTTP client to send requests to the model and receive responses.

```bash
curl https://<nosana-job-id>.node.k8s.prd.nos.ci/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
     "model": "R1-Qwen-7B",
     "messages": [{"role": "user", "content": "Tell me something about Nosana."}],
     "temperature": 0.7
   }'
```

## Pre-requisites

- [Node.JS](https://nodejs.org/en/download/)
- [Nosana CLI](https://docs.nosana.com/getting-started/installation)
- [Docker](https://docs.docker.com/get-docker/)
- [Postman](https://www.postman.com/downloads/)
- [curl](https://curl.se/)
- [Python](https://www.python.org/downloads/)

## Setup and Preparation

As mentioned in the prerequisites, you need to have the necessary software installed on your system.

## Nosana Job Specification

This is a standard Nosana Job Specification. With this you can define how a Nosana job will operate.
The most important parameters of the job specification are:

- `image`: The Docker image to use for the job.
- `cmd`: The command to run inside the container.
- `gpu`: Whether the job requires a GPU.
- `expose`: The port to expose for the service.

```json
{
  "version": "0.1",
  "type": "container",
  "meta": {
    "trigger": "dashboard"
  },
  "ops": [
    {
      "type": "container/run",
      "id": "vllm",
      "args": {
        "entrypoint": [],
        "cmd": [
          "/bin/sh",
          "-c",
          "python3",
          "-m vllm.entrypoints.openai.api_server",
          "--model deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
          "--served-model-name R1-Qwen-1.5B",
          "--port 9000",
          "--max-model-len 130000"
        ],
        "image": "docker.io/vllm/vllm-openai:latest",
        "gpu": true,
        "expose": 9000
      }
    }
  ]
}
```

## Containerization

## Deployment

## Managing the Deployment

## Monitoring the Deployment

## Retrieving and Reviewing the Results

## Wrap Up
