from openai import OpenAI

client = OpenAI(
    base_url="https://<nosana-job-id>.node.k8s.prd.nos.ci/v1",
    api_key="na"
)

# Use the following func to get the available models
# model_list = client.models.list()
# print(model_list)

chat_completion = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
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
