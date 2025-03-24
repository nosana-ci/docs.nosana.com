# Confidential Jobs on Nosana

Nosana supports running confidential jobs, providing mechanisms to securely execute jobs without exposing sensitive data or credentials publicly.

## Understanding Confidential Jobs

Nosana is fundamentally built for open access, meaning job definitions and their results are public by default. However, there are scenarios where you may want to execute compute jobs privately.

To address this, Nosana allows you to:

- Keep your job definitions off IPFS (public storage).
- Use secure, private methods to share job definitions directly between you (the client) and Nosana Hosts.

Confidential jobs leverage encrypted peer-to-peer connections, allowing sensitive input and output data to remain protected throughout the execution process.

## How Confidential Jobs Work

When posting a confidential job:

1. A Nosana Host initiates and spins up resources.
2. An encrypted peer-to-peer connection is established between you and the Nosana Host.
3. The confidential job definition is securely transferred directly from your filesystem to the Nosana Host.

## Confidential Job Example

### Authenticated Docker Hub Access

Consider a scenario where you want to securely pull a private Docker image from Docker Hub. The following Nosana job definition demonstrates how to specify Docker Hub credentials without exposing them publicly:

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
      "id": "<id>",
      "args": {
        "cmd": "",
        "image": "<docker-hub-user>/<image-name>",
        "authentication": {
          "docker": {
            "username": "<docker-hub-user>",
            "password": "<docker-hub-personal-access-token>"
          }
        }
      }
    }
  ]
}
```

To post the confidential job securely, use the following command, noting the `--confidential` flag:

:::warning
Do not forget to pass the `--confidential` flag, otherwise your job definition will be posted to the public.
:::

```bash
npx @nosana/cli job post \
  --file confidential.json \
  --market nvidia-3090 \
  --timeout 5 \
  --confidential
```

When reviewing the publicly posted job definition, you'll notice that the job definiton file has been entirely replaced with only necessary metadata.
The uploaded job definition, provides the instructions necessary for you to upload the confidential job definition.
This ensures that no sensitive information is exposed publicly. Only the job initiator can introspect the full job details locally.

```json
{
  "version": "0.1",
  "type": "container",
  "meta": { "trigger": "cli" },
  "logistics": {
    "send": { "type": "api-listen", "args": {} },
    "receive": { "type": "api-listen", "args": {} }
  },
  "ops": []
}
```

## Retrieving job results

For now the only way to retrieve the logs of the runtime is to keep the connection open with the Nosana host. This is done by passing the `--wait` flag. Here's an example, where we use the `--verbose` flag to get more information about the job posting.

```bash
npx @nosana/cli job post \
  --file confidential.json \
  --market nvidia-3090 \
  --timeout 5 \
  --confidential \
  --verbose \
  --wait
```
