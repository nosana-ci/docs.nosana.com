import OpenAI from "openai";
const openai = new OpenAI({
  baseUrl: "https://<nosana-job-id>.node.k8s.prd.nos.ci/v1"
});

const completion = await openai.chat.completions.create({
  // TODO: Change model to qwen model
  model: "gpt-4o",
  messages: [
    { role: "developer", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "Write a haiku about recursion in programming.",
    },
  ],
  store: true,
});

console.log(completion.choices[0].message);
