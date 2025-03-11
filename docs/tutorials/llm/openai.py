# openai_nosana.py

from openai import OpenAI

client = OpenAI(
    base_url="https://<nosana-job-id>.node.k8s.prd.nos.ci/v1",
)

# Use the following func to get the available models
# model_list = client.models.list()
# print(model_list)

chat_completion = client.chat.completions.create(
    model="R1-Qwen-1.5B",
    messages=[
        {
            "role": "user",
            "content": "Explain superconductors like I'm five years old"
        }
    ],
    stream=True,
)

for chunk in chat_completion:
    print(chunk.choices[0].delta.content or "", end="")
