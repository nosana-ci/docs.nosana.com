FROM docker.io/vllm/vllm-openai:latest

WORKDIR /app

RUN apt-get update && apt-get remove -y python3-blinker 
RUN pip install open-webui==0.5.16
RUN open-webui serve &

RUN python3 -m vllm.entrypoints.openai.api_server --model deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B --served-model-name R1-Qwen-1.5B --port 9000 --max-model-len 130001

EXPOSE 9000
