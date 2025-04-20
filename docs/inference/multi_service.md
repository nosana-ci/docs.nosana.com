# Multiple Services

Most Docker tutorials preach **one process per container**—and that _is_ the general best‑practice. But there are legitimate reasons to bundle services: co‑locating GPU workloads, avoiding cross‑container latency, or keeping costs and deployment complexity low.  
This guide shows **how to run _two_ services—vLLM (model server) and Open‑WebUI (chat UI)—inside a single image and deploy it on Nosana**.

---

## What Is a _Service_?

A **service** is any long‑running process that listens on a network port and responds to requests:

- vLLM inference server on **:9000**
- Postgres at **:5432**
- Nginx static site on **:80**

Modern applications usually orchestrate several such services working together.

See Docker’s [_Run multiple processes in a container_](https://docs.docker.com/engine/containers/multi-service_container/) guide for alternative supervisors.

---

## vLLM & Open-WebUI example

To showcase how to use the multiple services feature, we will be using [vLLM](https://docs.vllm.ai/en/latest/index.html) and [Open-WebUI](https://docs.openwebui.com/).

Why vLLM + Open‑WebUI?

vLLM is a GPU‑efficient inference engine that implements paged‑attention to stream tokens with minimal latency while squeezing more concurrent contexts into memory.

Open‑WebUI is a self‑hosted, OpenAI‑compatible chat interface featuring conversation history, roles, embeddings, and plug‑ins. Because it speaks the same REST dialect, anything that can hit the OpenAI API can talk to your local model through Open‑WebUI.

Combined, the pair lets you expose any Hugging Face model behind a polished chat UI in minutes—perfect for demos, internal tools, or edge deployments.

---

## Quick‑Start Template

An off‑the‑shelf example lives on the **Nosana Dashboard** → _Templates_ → **“Open‑WebUI and DeepSeek R1 Qwen 1.5B”**. Feel free to deploy it now, then return to learn how it works.

<https://dashboard.nosana.com/deploy>

---

## Build Your Own Image

In this example we will be setting up an LLM API server, using vLLM and Open-WebUI for the chat frontend.

### 1  Create `Dockerfile`

The Dockerfile is your build recipe. We start from Astral’s lightweight uv image (Python + a Rust‑powered package manager), create a dedicated virtual environment, install our two Python apps, expose their ports, and copy a wrapper script that keeps both services alive. Feel free to swap the base image (for example, nvidia/cuda) or pin exact package versions to guarantee reproducible builds.

```Dockerfile
FROM ghcr.io/astral-sh/uv:debian

ENV PATH="$PATH:/root/.local/bin"

# Create & activate virtual‑env
RUN uv venv /opt/venv
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python deps
RUN uv pip install open-webui jupyterlab

EXPOSE 8000 9000

# Wrapper script starts both services
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT ["/start.sh"]
```

### 2  Add a Wrapper Script `start.sh`

Docker expects its _PID 1_ to keep running; when it exits the container stops. A simple Bash wrapper launches both services then waits.

- `#!/usr/bin/env bash` - portable shebang to define environment.
- `set -euo pipefail` – plus strict‑mode flags so the script aborts on any error, uses undeclared vars, or failed pipe.
- Start vLLM in the background (`&`). We pass a model name, a friendly alias, and `--port 9000`.
- Start Open‑WebUI in the background (`&`) and point it at the local LLM endpoint via the `OPENAI_API_BASE_URL` env‑var. It listens on `8000`. <https://docs.openwebui.com/getting-started/env-configuration#openai_api_base_url>
- `wait -n` blocks until either child exits. Without it, Bash would exit immediately and Docker would kill the still‑running sibling.
- `exit $?` propagates the exit code of the first dying process so container status reflects the failing service.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Start the LLM server (background)
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B \
  --served-model-name R1-Qwen-1.5B \
  --port 9000 &

# Start WebUI and point it at the local LLM endpoint (background)
OPENAI_API_BASE_URL=http://127.0.0.1:9000/v1 open-webui serve --port 8000 &

# Wait for the *first* child to exit and mirror its status
wait -n
exit $?
```

:::warning
`wait -n` **is required**, it blocks until either child process exits, preventing Docker from killing your still‑running service. `exit $?` forwards the failing service’s status code.
:::

### 3  Build the Image

```sh
# In the same directory as Dockerfile & start.sh
# Tag the image so push works later

docker build -t <username>/<image-name>:latest .
```

### 4  Publish to a Registry

```sh
docker login # (first time only)

docker push <username>/<image-name>:latest
```

---

## Deploy on Nosana

1. **Write a job spec**—save the JSON below as `webui-deepseek.json`.

:::info
We expose **both** internal ports, so `expose` is an array.
:::

```json
{
  "ops": [
    {
      "id": "webui-deepseek",
      "args": {
        "image": "docker.io/<username>/<image-name>:latest",
        "gpu": true,
        "expose": [8000, 9000]
      },
      "type": "container/run"
    }
  ],
  "meta": {
    "trigger": "dashboard",
    "system_requirements": {
      "required_vram": 6
    }
  },
  "type": "container",
  "version": "0.1"
}
```

2. **Post the job** using `@nosana/cli` (install once with `npm i -g @nosana/cli`).

```sh
npx @nosana/cli job post \
  --file webui-deepseek.json \
  --market nvidia-3090 \
  --timeout 60
```

Nosana schedules the build on a GPU node, starts your container, and exposes the declared ports. Visit the WebUI endpoint shown in the dashboard and chat away!

---

## Troubleshooting

| Symptom                   | Likely Cause                                 | Fix                                                        |
| ------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Container exits instantly | `start.sh` finished before services started  | Ensure `wait -n` is the last foreground command            |
| Port already in use       | Host or other process bound to `8000`/`9000` | Change ports in `EXPOSE`, `start.sh`, and job spec         |
| GPU unavailable           | `"gpu": true` omitted or market mismatch     | Use a GPU market (e.g., `nvidia-3090`) and set `gpu: true` |

---

### Next Steps

- Swap in your own model weights: change the `vllm serve …` line.
- Add more services—update `start.sh` and `EXPOSE` as needed.
