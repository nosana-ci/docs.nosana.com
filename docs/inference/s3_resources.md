# S3 Resources

Loading external model files or datasets into your Nosana deployment is often as simple as pointing to an S3‑compatible bucket (AWS S3, Cloudflare R2, MinIO, etc.). Nosana fetches any declared resources **before** the job starts, so your data is already available when the container’s `cmd` runs.

---

## Why S3?

- **Universal** – Nearly every cloud provider speaks the S3 API.
- **Scalable** – Ideal for multi‑gigabyte checkpoints or image datasets.
- **Secure** – Fine‑grained IAM policies let you share read‑only keys.

---

## Anatomy of a `resources` object

| Field    | Required | Description                                                                                                                  |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `type`   | ✔︎      | Storage provider identifier. Use `"S3"` for any S3‑compatible endpoint.                                                      |
| `url`    | ✔︎      | HTTPS link to a single object **or** a folder‑like prefix.                                                                   |
| `target` | ✔︎      | Absolute path inside the container where Nosana will place the downloaded files.                                             |
| `bucket` | ◯        | Bucket name as recognised by the S3 API. Needed when your provider uses the same hostname for multiple buckets.              |
| `IAM`    | ◯        | Object that holds temporary credentials for private buckets (_`ACCESS_KEY_ID`_, _`SECRET_ACCESS_KEY`_, optional _`REGION`_). |
| `files`  | ◯        | Array of file names (relative to `url`) to download when you only need a subset.                                             |

> **Tip — Mix & Match:** You can combine several `resources` entries (S3, HuggingFace, Git, etc.) in the same job definition. Nosana downloads them in parallel.

---

## Example 1 – Public bucket

### Job definition (`s3-public.json`)

```json
{
  "version": "0.1",
  "meta": { "trigger": "cli" },
  "type": "container",
  "ops": [
    {
      "id": "huggingface",
      "type": "container/run",
      "args": {
        "cmd": ["ls", "/data-models"],
        "gpu": true,
        "image": "ubuntu",
        "resources": [
          {
            "type": "S3",
            "url": "https://models.nosana.io/test",
            "target": "/data-models/"
          }
        ]
      }
    }
  ]
}
```

### Field breakdown

| Property        | Purpose                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `type` = `"S3"` | Treat the link as S3‑compatible storage.                                |
| `url`           | Prefix that contains the files to download (public, so no credentials). |
| `target`        | Destination inside the container.                                       |

---

## Example 2 – Private bucket with IAM

### Job definition (`s3-private.json`)

```json
{
  "version": "0.1",
  "meta": { "trigger": "cli" },
  "type": "container",
  "ops": [
    {
      "id": "huggingface",
      "type": "container/run",
      "args": {
        "cmd": ["ls", "/data-models"],
        "gpu": true,
        "image": "ubuntu",
        "resources": [
          {
            "type": "S3",
            "url": "https://ai.r2.cloudflarestorage.com/ai-model/entrypoint",
            "bucket": "ai-model",
            "target": "/data-models/",
            "IAM": {
              "REGION": "",
              "ACCESS_KEY_ID": "",
              "SECRET_ACCESS_KEY": ""
            }
          }
        ]
      }
    }
  ]
}
```

### Field breakdown

| Property                        | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `type`                          | Always `"S3"`.                                                  |
| `url`                           | HTTPS endpoint to your object or prefix.                        |
| `bucket`                        | Bucket name required by some providers (e.g. Cloudflare R2).    |
| `target`                        | Where the files land inside the container.                      |
| `IAM`                           | Temporary credentials Nosana injects at runtime.                |
| &nbsp;&nbsp;`REGION`            | Region string (needed for AWS, empty for most R2/MinIO setups). |
| &nbsp;&nbsp;`ACCESS_KEY_ID`     | Access‑key half of the pair.                                    |
| &nbsp;&nbsp;`SECRET_ACCESS_KEY` | Secret‑key half.                                                |

:::warning
To post Nosana Deployments confidentially, please read [Confidential Jobs](./confidential.md)
:::

---

## Example 3 – Selecting specific files

### Job definition (`s3-select-files.json`)

```json
{
  "version": "0.1",
  "meta": { "trigger": "cli" },
  "type": "container",
  "ops": [
    {
      "id": "huggingface",
      "type": "container/run",
      "args": {
        "cmd": ["ls", "/data-models"],
        "gpu": true,
        "image": "ubuntu",
        "resources": [
          {
            "type": "S3",
            "url": "https://pub-5bc58981af9f42659ff8ada57bfea92c.r2.dev/controlnets",
            "files": ["control_v11e_sd15_ip2p_fp16.safetensors"],
            "target": "/data-models/"
          }
        ]
      }
    }
  ]
}
```

### Field breakdown

| Property | Purpose                                                   |
| -------- | --------------------------------------------------------- |
| `type`   | `"S3"`.                                                   |
| `url`    | Public prefix that contains many checkpoints.             |
| `files`  | Whitelist of files to fetch (everything else is skipped). |
| `target` | Destination folder in the container.                      |

---

## Deploying a job

```bash
npx @nosana/cli job post \
  --file s3-public.json      # or s3-private.json / s3-select-files.json
  --market nvidia-3090       # GPU market to rent
  --timeout 10               # minutes
```

Nosana will:

1. Spin up a worker with the requested GPU.
2. Download each `resources` entry in parallel.
3. Mount them at the specified `target` paths.
4. Execute your `cmd`.

---

## Troubleshooting

| Symptom                             | Likely cause                                                          |
| ----------------------------------- | --------------------------------------------------------------------- |
| **`403 Forbidden`** during download | Wrong credentials or bucket policy.                                   |
| Job stuck at **“Downloading…”**     | Very large file – consider transfer acceleration or splitting files.  |
| **Files missing** in `/data-models` | Typo in `url` or `files` list.                                        |
| **CUDA OOM** later on               | Model is larger than the selected GPU’s VRAM. Choose a bigger market. |

---

## Next steps

- Combine S3 and HuggingFace entries in one job.
- Browse more examples in the [Nosana documentation](https://docs.nosana.com).
