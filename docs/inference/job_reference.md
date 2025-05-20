# Job Definition Schema

Nosana job definitions outline how tasks execute on Nosana's decentralized GPU network. Jobs are defined via structured JSON objects detailing commands, images, environment, resources, and container configurations.

---

## Example Job Definition Structure

Below there is an example job definition file that can be used as a base. For the full JSON schema for how this would work, go to [JSON Schema](#json-schema-for-job-definition)

```json
{
  "version": "0.1",
  "type": "container",
  "meta": {
    "trigger": "cli",
    "system_resources": {
      "required_vram": 18
    }
  },
  "global": {
    "image": "ubuntu",
    "gpu": true,
    "entrypoint": "/bin/bash",
    "env": {
      "MY_VAR": "value"
    },
    "work_dir": "/workspace"
  },
  "ops": [
    {
      "id": "my-operation",
      "type": "container/run",
      "args": {
        "cmd": ["echo", "hello world"],
        "resources": [
          {
            "type": "S3",
            "url": "https://models.example.com",
            "target": "/data/"
          }
        ],
        "authentication": {
          "docker": {
            "username": "myDockerUser",
            "password": "myDockerPass"
          }
        }
      }
    }
  ]
}
```

## Validation

The [`@nosana/sdk`](https://github.com/nosana-ci/nosana-sdk/) provides a method to validate Nosana Job Definitions, `validateJobDefinition`. Below you can see an example on how to use it:

```typescript
import { validateJobDefinition } from '@nosana/sdk';

const hello_world_job_definition = {
  version: '0.1',
  type: 'container',
  ops: [
    {
      type: 'container/run',
      id: 'hello-world',
      args: {
        cmd: 'echo hello world',
        image: 'ubuntu',
      },
    },
  ],
};

const result = validateJobDefinition(hello_world_job_definition);
if (!result.success) {
  console.error(result.errors);
}
```

## Field Definitions

### 🔹 **Top-Level Fields**

| Field     | Type            | Required? | Description                                       |
| --------- | --------------- | --------- | ------------------------------------------------- |
| `version` | `string`        | ✅        | Job definition schema version (currently `"0.1"`) |
| `type`    | `"container"`   | ✅        | Specifies the execution type                      |
| `meta`    | `object`        | ❌        | Job metadata like trigger type and resources      |
| `global`  | `object`        | ❌        | Defaults applied globally across all operations   |
| `ops`     | `Ops` (`Array`) | ✅        | Ordered operations/tasks for execution            |

---

### 🔹 **Meta**

Specifies execution triggers and system resources:

```json
"meta": {
  "trigger": "cli",
  "system_resources": { "required_vram": 18 }
}
```

| Field              | Type                             | Description                               |
| ------------------ | -------------------------------- | ----------------------------------------- |
| `trigger`          | `"cli"` or `"dashboard"`         | Job origin trigger type                   |
| `system_resources` | `Record<string, string\|number>` | System-level constraints (e.g., GPU VRAM) |

---

### 🔹 **Global Defaults**

Defaults applied across all operations unless explicitly overridden:

```json
"global": {
  "image": "ubuntu",
  "gpu": true,
  "entrypoint": "/bin/bash",
  "env": { "KEY": "value" },
  "work_dir": "/workspace"
}
```

| Field        | Type                 | Description                   |
| ------------ | -------------------- | ----------------------------- |
| `image`      | `string`             | Default Docker image          |
| `gpu`        | `boolean`            | Default GPU requirement       |
| `entrypoint` | `string \| string[]` | Default Docker entrypoint     |
| `env`        | `object`             | Default environment variables |
| `work_dir`   | `string`             | Default working directory     |

---

### 🔹 **Operations (`ops`)**

Defines tasks within the job:

```json
"ops": [{
  "id": "unique-id",
  "type": "container/run",
  "args": {
    "cmd": ["command", "arg1"],
    "resources": [],
    "authentication": {}
  }
}]
```

| Field  | Required? | Description                                      |
| ------ | --------- | ------------------------------------------------ |
| `id`   | ✅        | Unique identifier per operation                  |
| `type` | ✅        | `"container/run"` or `"container/create-volume"` |
| `args` | ✅        | Operation-specific arguments                     |

---

### 🔹 **Operation Args**

`container/run` type arguments:

| Field            | Type                      | Required? | Description                                                         |
| ---------------- | ------------------------- | --------- | ------------------------------------------------------------------- |
| `image`          | `string`                  | ✅        | Docker image, It is recommended to put the URL to the Docker Image. |
| `cmd`            | `string \| string[]`      | ❌        | Commands to execute                                                 |
| `gpu`            | `boolean`                 | ❌        | GPU requirement                                                     |
| `expose`         | `number \| ExposedPort[]` | ❌        | Ports exposed                                                       |
| `resources`      | `Resource[]`              | ❌        | External data sources                                               |
| `authentication` | `{docker: DockerAuth}`    | ❌        | Docker registry authentication                                      |

#### cmd

The `cmd` array is important to illustrate, because there are is nuance in how to use it.
If you are familiar with how to use the `cmd` property in Docker, you should already have an idea of how this property works.

##### String based CMD

When the first element of the array is the whole command, such as:
`"gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app"`
Bash will be used as the shell to interpret this command.

##### Array based CMD

Another option is to put each command and every flag as it's own element in an array:
`["/bin/sh", "-c", gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]`

With the array based notation, we are able to specify the shell we want to use.
Note that most often you will need to append `-c` flag after `/bin/sh`

You can read more about how to use the `cmd` property by going to the [Docker Documentation](https://docs.docker.com/reference/dockerfile/#cmd).

---

### 🔹 **Resources**

External sources loaded into the container:

:::danger
When using credentials please be mindful, and use the confidential jobs feature.
Please read [Confidential Jobs on Nosana](./confidential.md) to learn how to post jobs confidentially to Nosana without leaking your secrets.
:::

**S3 resource example:**

You can read more about how to use S3 resources at [S3 Resources in Nosana](./s3_resources.md)

```json
{
  "type": "S3",
  "url": "https://storage.example.com/models",
  "target": "/data/",
  "files": ["model.bin"],
  "IAM": {
    "ACCESS_KEY_ID": "key",
    "SECRET_ACCESS_KEY": "secret"
  }
}
```

**Hugging Face resource example:**

You can read more about how to use Hugging Face resources at [HuggingFace Resources](./loading_resources.md)

```json
{
  "type": "HF",
  "repo": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
  "target": "/data-models/"
}
```

---

### 🔹 **Docker Authentication**

Authenticate to private Docker registries:

```json
"authentication": {
  "docker": {
    "username": "user",
    "password": "pass",
    "email": "optional",
    "server": "optional registry URL"
  }
}
```

---

## JSON Schema for Job Definition

Below you can find an exhaustive schema for the job definition file.

````json
## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Nosana Job Definition Schema",
  "type": "object",
  "required": ["version", "type", "ops"],
  "properties": {
    "version": {
      "type": "string",
      "const": "0.1"
    },
    "type": {
      "type": "string",
      "enum": ["container"]
    },
    "logistics": {
      "type": "object",
      "properties": {
        "send": { "$ref": "#/definitions/logisticsType" },
        "receive": { "$ref": "#/definitions/logisticsType" }
      },
      "additionalProperties": false
    },
    "meta": {
      "type": "object",
      "properties": {
        "trigger": { "type": "string", "enum": ["cli", "dashboard"] },
        "system_resources": {
          "type": "object",
          "additionalProperties": {
            "type": ["string", "number"]
          }
        }
      },
      "additionalProperties": true
    },
    "global": { "$ref": "#/definitions/global" },
    "ops": {
      "type": "array",
      "items": { "$ref": "#/definitions/operation" },
      "minItems": 1
    }
  },
  "additionalProperties": false,
  "definitions": {
    "logisticsType": {
      "type": "object",
      "required": ["type", "args"],
      "properties": {
        "type": { "enum": ["api", "api-listen"] },
        "args": {
          "type": "object",
          "properties": {
            "endpoint": { "type": "string", "format": "uri" }
          },
          "required": ["endpoint"],
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "global": {
      "type": "object",
      "properties": {
        "image": { "type": "string" },
        "gpu": { "type": "boolean" },
        "entrypoint": {
          "oneOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }]
        },
        "env": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        },
        "work_dir": { "type": "string" }
      },
      "additionalProperties": false
    },
    "operation": {
      "type": "object",
      "required": ["id", "type", "args"],
      "properties": {
        "id": { "type": "string" },
        "type": { "enum": ["container/run", "container/create-volume"] },
        "args": {
          "type": "object",
          "required": ["image"],
          "properties": {
            "image": { "type": "string" },
            "cmd": {
              "oneOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }]
            },
            "gpu": { "type": "boolean" },
            "expose": {
              "oneOf": [{ "type": "number" }, { "type": "array", "items": { "$ref": "#/definitions/exposedPort" } }]
            },
            "entrypoint": {
              "oneOf": [{ "type": "string" }, { "type": "array", "items": { "type": "string" } }]
            },
            "env": {
              "type": "object",
              "additionalProperties": { "type": "string" }
            },
            "work_dir": { "type": "string" },
            "output": { "type": "string" },
            "required_vram": { "type": "number" },
            "resources": {
              "type": "array",
              "items": { "$ref": "#/definitions/resource" }
            },
            "authentication": {
              "type": "object",
              "properties": {
                "docker": { "$ref": "#/definitions/dockerAuth" }
              },
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "exposedPort": {
      "type": "object",
      "required": ["port"],
      "properties": {
        "port": { "type": "number" },
        "type": { "enum": ["web", "api", "webapi", "websocket", "none"] },
        "health_checks": {
          "type": "array",
          "items": { "$ref": "#/definitions/healthCheck" }
        }
      },
      "additionalProperties": false
    },
    "healthCheck": {
      "oneOf": [
        {
          "type": "object",
          "required": ["type", "path", "method", "expected_status"],
          "properties": {
            "type": { "const": "http" },
            "path": { "type": "string" },
            "method": { "enum": ["GET", "POST", "PUT", "DELETE"] },
            "expected_status": { "type": "number" },
            "headers": {
              "type": "object",
              "additionalProperties": { "type": "string" }
            },
            "body": {}
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": ["type", "expected_response"],
          "properties": {
            "type": { "const": "websocket" },
            "expected_response": { "type": "string" }
          },
          "additionalProperties": false
        }
      ]
    },
    "dockerAuth": {
      "type": "object",
      "required": ["username", "password"],
      "properties": {
        "username": { "type": "string" },
        "password": { "type": "string" },
        "email": { "type": "string" },
        "server": { "type": "string" }
      },
      "additionalProperties": false
    },
    "resource": {
      "type": "object",
      "required": ["type", "target"],
      "properties": {
        "type": { "enum": ["S3", "HF"] },
        "url": { "type": "string", "format": "uri" },
        "target": { "type": "string" },
        "repo": { "type": "string" },
        "files": { "type": "array", "items": { "type": "string" } },
        "bucket": { "type": "string" },
        "IAM": {
          "type": "object",
          "properties": {
            "ACCESS_KEY_ID": { "type": "string" },
            "SECRET_ACCESS_KEY": { "type": "string" },
            "REGION": { "type": "string" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    }
  }
}
````

```

```
