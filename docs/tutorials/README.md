# Checklist

Use the following checklist to ensure you include all critical elements when you write your own version:

1. **Introduction**
   - [ ] Give a concise overview of Model type and Model implementation. For example: LLMs and DeepSeek.
     - [ ] Give an overview of the different DeepSeek models, and how they can be used for different tasks.
   - [ ] Briefly explain Nosana and why it’s relevant.
   - [ ] Link to template on the Dashboard, if available.
2. **Prerequisites**
   - [ ] List software installations (Nosana CLI, Docker, Postman, etc.).
   - [ ] Mention configuration or environment requirements.
3. **Setup & Preparation**
   - [ ] Describe file/folder structure (if relevant).
   - [ ] Outline any data sources or example audio files.
4. **Nosana Job Specification**
   - [ ] Show the essential fields (name, image, command, input/output volumes).
   - [ ] Highlight any necessary parameters (e.g., GPU requirements, if any).
5. **Containerize using Docker**
   - [ ] Provide a Dockerfile or Docker Compose example.
   - [ ] Explain how to build and push the Docker image to a registry.
6. **Running the Job**
   - [ ] Explain how to run the job locally
   - [ ] Provide the command-line instructions to submit the job to the network.
   - [ ] Include tips for verifying submission success (e.g., logs, job status).
7. **Job Monitoring**
   - [ ] Detail how to check job progress (e.g., `nosana logs <job-id>`).
   - [ ] Mention how to handle errors or warnings.
8. **Retrieving and Reviewing Results**
   - [ ] Provide commands to download outputs.
   - [ ] Explain how to interpret or post-process the transcription results.
9. **Wrap-Up**
   - [ ] Recap the workflow and benefits.
   - [ ] Suggest next steps or advanced customization.

## Resources
