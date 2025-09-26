# Post Jobs with Nosana API

Call Nosana's REST API directly using your API key for job management and credit operations.

[API reference](https://dashboard.k8s.prd.nos.ci/api/swagger#tag/credits).

## Get an API Key

You can create an API key from the Nosana dashboard.

1. Log in at `https://dashboard.nosana.com`
2. Go to `Account`
3. Find the `API Keys` section
4. Click `Create Key`

![API keys overview](../.vuepress/public/api_keys.png)

![Create API key](../.vuepress/public/create_key.png)

## API Examples

### Create a job with credits

```sh:no-line-numbers
export NOSANA_API_KEY="nos_xxx_your_api_key"

curl -s -X POST \
  -H "Authorization: Bearer $NOSANA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ipfsHash": "QmYourJobHash",
    "market": "7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq",
    "timeout": 1800
  }' \
  https://dashboard.k8s.prd.nos.ci/api/jobs/create-with-credits | jq .
```

### Extend a running job

```sh:no-line-numbers
curl -s -X POST \
  -H "Authorization: Bearer $NOSANA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jobAddress": "YourJobAddress",
    "extensionSeconds": 1800
  }' \
  https://dashboard.k8s.prd.nos.ci/api/jobs/extend-with-credits | jq .
```

### Stop a job

```sh:no-line-numbers
curl -s -X POST \
  -H "Authorization: Bearer $NOSANA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jobAddress": "YourJobAddress"
  }' \
  https://dashboard.k8s.prd.nos.ci/api/jobs/stop-with-credits | jq .
```

### Check credit balance

```sh:no-line-numbers
curl -s \
  -H "Authorization: Bearer $NOSANA_API_KEY" \
  https://dashboard.k8s.prd.nos.ci/api/credits/balance | jq .
```

Response:
```json
{
  "assignedCredits": 100.0,
  "reservedCredits": 10.0,
  "settledCredits": 5.0
}
```

**Note:** Available balance = assignedCredits - reservedCredits - settledCredits

