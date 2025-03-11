// openai.js
import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: "https://<nosana-job-id>.node.k8s.prd.nos.ci/v1"
});

const models = await openai.models.list();
console.log(models.data);

const completion = await openai.chat.completions.create({
  model: "R1-Qwen-1.5B",
  messages: [
    {
      role: "user",
      content: "Write a haiku about recursion in programming.",
    },
  ],
});

console.log(completion.choices[0].message.content);
