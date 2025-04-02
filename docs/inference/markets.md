# GPU Markets

Nosana offers a variety of GPU markets tailored to different needs. Below is a comprehensive list of available NVIDIA GPU markets.

- **Market Name**: Type of NVIDIA GPU available.
- **Address of Market**: Address to use with the `--market` flag in the `nosana job post` command.

For real-time updates on prices, job timeouts, queue lengths, and more, visit the [Nosana explorer](https://dashboard.nosana.com/markets).

## CLI commands

Or it is also possible to retrieve market information through the `@nosana/cli`

### List Markets

```sh:no-line-numbers
nosana market list
```

#### Output

```sh:no-line-numbers
  _   _
 | \ | | ___  ___  __ _ _ __   __ _
 |  \| |/ _ \/ __|/ _` | '_ \ / _` |
 | |\  | (_) \__ \ (_| | | | | (_| |
 |_| \_|\___/|___/\__,_|_| |_|\__,_|


Markets
┌─────────────────────────────┬─────────────────────┬────────────────────────────────────────────────┐
│            name             │        slug         │                    address                     │
├─────────────────────────────┼─────────────────────┼────────────────────────────────────────────────┤
│  Market Enterprise 8xA5000  │   nvidia-8x-a5000   │  3XGECQon74HQwPJuZjgCwqdQ5Nt3wktZ9fcavcDN9qB2  │
│         Market 3060         │     nvidia-3060     │  7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq  │
│         Market 3070         │     nvidia-3070     │  RXP7JK8MTY4uPJng4UjC9ZJdDDSG6wGr8pvVf3mwgXF   │
│         Market 3080         │     nvidia-3080     │  7RepDm4Xt9k6qV5oiSHvi8oBoty4Q2tfBGnCYjFLj6vA  │
│         Market 3090         │     nvidia-3090     │  CA5pMpqkYFKtme7K31pNB1s62X2SdhEv1nN9RdxKCpuQ  │
│         Market 4060         │     nvidia-4060     │  47LQHZwT7gfVoBDYnRYhsYv6vKk8a1oW3Y3SdHAp1gTr  │
│         Market 4070         │     nvidia-4070     │  EzuHhkrhmV98HWzREsgLenKj2iHdJgrKmzfL8psP8Aso  │
│         Market 4080         │     nvidia-4080     │  77wdaAuYVxBW5u2QiqddkAzoBZ5cuKxH9ZCbx5HfFUb2  │
│         Market 4090         │     nvidia-4090     │  97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf  │
│        Market A5000         │    nvidia-a5000     │  4uBye3vJ1FAYukDdrvqQ36MZZZxqW3o8utWu8fyomRuN  │
│      Market 6000/A6000      │  nvidia-6000-a6000  │  EjryZ6XEthz3z7nnLfjXBYafyn7VyHgChfbfM47LfAao  │
│         Market A40          │     nvidia-a40      │  BLqSzPzcXMX5gseNXE4Ma45f31Eo6tNFVYoRmPG7kxP2  │
│         Market A100         │     nvidia-a100     │  GLJHzqRN9fKGBsvsFzmGnaQGknUtLN1dqaFR8n3YdM22  │
│         Market H100         │     nvidia-h100     │  Crop49jpc7prcgAcS82WbWyGHwbN5GgDym3uFbxxCTZg  │
│        Market Laptop        │    nvidia-laptop    │  3EWVbggirRpDY2npzPDA7k21yzwz5wgwGxVVv6zCnRpa  │
│      Market 4000/A4000      │  nvidia-4000-a4000  │  7fnuvPYzfd961iRDPRgMSKLrUf1QjTGnn7viu3P12Zuc  │
│      Market A100 40GB       │  nvidia-a100-40gb   │  F3aGGSMb73XHbJbDXVbcXo7iYM9fyevvAZGQfwgrnWtB  │
└─────────────────────────────┴─────────────────────┴────────────────────────────────────────────────┘
```

### Market Info

```sh:no-line-numbers
nosana market get nvidia-3060
```

#### Output

```sh:no-line-numbers
  _   _
 | \ | | ___  ___  __ _ _ __   __ _
 |  \| |/ _ \/ __|/ _` | '_ \ / _` |
 | |\  | (_) \__ \ (_| | | | | (_| |
 |_| \_|\___/|___/\__,_|_| |_|\__,_|

Network:                mainnet
Name:                   Market 3060
Slug:                   nvidia-3060
Address:                7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq
SFT collection:         EriVoySzVWF4NtNxQFCFASR4632N9sh9YumTjkhGkkgL
Job price:              0.000043 NOS/s
Job timeout:            120 minutes
Job expiration:         24 hours
Queue type:             Node Queue
Nodes in queue:         23
GPU Types:
┌──────────────────────────────┐
│            Values            │
├──────────────────────────────┤
│   NVIDIA GeForce RTX 3060    │
│  NVIDIA GeForce RTX 3060 Ti  │
└──────────────────────────────┘

Required Docker Images:
┌───────────────────────────────────────────────┐
│                    Values                     │
├───────────────────────────────────────────────┤
│        docker.io/laurensv/nosana-frpc         │
│  registry.hub.docker.com/nosana/stats:v1.0.4  │
└───────────────────────────────────────────────┘

Required Remote Resources
[]
```

### Using the `--market` Flag

To post a job on Nosana, use the following command format:

```sh:no-line-numbers
nosana job post --market <Market_Address | Market_Slug>
```

Example:

```sh:no-line-numbers
nosana job post --market 3XGECQon74HQwPJuZjgCwqdQ5Nt3wktZ9fcavcDN9qB2

# OR

nosana job post --market nvidia-3060
```

## Links to GPU markets at the Nosana Explorer

| Market Name         |  Address | Description |
|---------------------|----------|-------------|
| [Market Enterprise](https://dashboard.nosana.com/markets/3XGECQon74HQwPJuZjgCwqdQ5Nt3wktZ9fcavcDN9qB2)   |   3XGECQon74HQwPJuZjgCwqdQ5Nt3wktZ9fcavcDN9qB2   | High-performance GPUs for enterprise-level tasks. |
| [Market 4070](https://dashboard.nosana.com/markets/EzuHhkrhmV98HWzREsgLenKj2iHdJgrKmzfL8psP8Aso)         |   EzuHhkrhmV98HWzREsgLenKj2iHdJgrKmzfL8psP8Aso   | Mid-range GPUs suitable for gaming and development. |
| [Market Laptop](https://dashboard.nosana.com/markets/3EWVbggirRpDY2npzPDA7k21yzwz5wgwGxVVv6zCnRpa)       |   3EWVbggirRpDY2npzPDA7k21yzwz5wgwGxVVv6zCnRpa   | GPUs optimized for laptop use, balancing power and efficiency. |
| [Market A100](https://dashboard.nosana.com/markets/GLJHzqRN9fKGBsvsFzmGnaQGknUtLN1dqaFR8n3YdM22)         |   GLJHzqRN9fKGBsvsFzmGnaQGknUtLN1dqaFR8n3YdM22   | High-end GPUs for AI and deep learning applications. |
| [Market 3060](https://dashboard.nosana.com/markets/7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq)         |   7AtiXMSH6R1jjBxrcYjehCkkSF7zvYWte63gwEDBcGHq   | Budget-friendly GPUs for casual use and entry-level gaming. |
| [Market 4000/A4000](https://dashboard.nosana.com/markets/7fnuvPYzfd961iRDPRgMSKLrUf1QjTGnn7viu3P12Zuc)   |   7fnuvPYzfd961iRDPRgMSKLrUf1QjTGnn7viu3P12Zuc   | Versatile GPUs suitable for a wide range of tasks. |
| [Market 3080](https://dashboard.nosana.com/markets/7RepDm4Xt9k6qV5oiSHvi8oBoty4Q2tfBGnCYjFLj6vA)         |   7RepDm4Xt9k6qV5oiSHvi8oBoty4Q2tfBGnCYjFLj6vA   | High-performance gaming GPUs. |
| [Market A40](https://dashboard.nosana.com/markets/BLqSzPzcXMX5gseNXE4Ma45f31Eo6tNFVYoRmPG7kxP2)          |   BLqSzPzcXMX5gseNXE4Ma45f31Eo6tNFVYoRmPG7kxP2   | Professional-grade GPUs for rendering and simulations. |
| [Market 4080](https://dashboard.nosana.com/markets/77wdaAuYVxBW5u2QiqddkAzoBZ5cuKxH9ZCbx5HfFUb2)         |   77wdaAuYVxBW5u2QiqddkAzoBZ5cuKxH9ZCbx5HfFUb2   | Next-gen GPUs for high-end gaming and development. |
| [Market 6000/A6000](https://dashboard.nosana.com/markets/EjryZ6XEthz3z7nnLfjXBYafyn7VyHgChfbfM47LfAao)   |   EjryZ6XEthz3z7nnLfjXBYafyn7VyHgChfbfM47LfAao   | Top-tier GPUs for intensive workloads and simulations. |
| [Market H100](https://dashboard.nosana.com/markets/Crop49jpc7prcgAcS82WbWyGHwbN5GgDym3uFbxxCTZg)         |   Crop49jpc7prcgAcS82WbWyGHwbN5GgDym3uFbxxCTZg   | Cutting-edge GPUs for AI and machine learning. |
| [Market 4060](https://dashboard.nosana.com/markets/47LQHZwT7gfVoBDYnRYhsYv6vKk8a1oW3Y3SdHAp1gTr)         |   47LQHZwT7gfVoBDYnRYhsYv6vKk8a1oW3Y3SdHAp1gTr   | Affordable GPUs with good performance for budget builds. |
| [Market 4090](https://dashboard.nosana.com/markets/97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf)         |   97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf   | Top-of-the-line GPUs for the ultimate gaming experience. |
| [Market 3090](https://dashboard.nosana.com/markets/CA5pMpqkYFKtme7K31pNB1s62X2SdhEv1nN9RdxKCpuQ)         |   CA5pMpqkYFKtme7K31pNB1s62X2SdhEv1nN9RdxKCpuQ   | High-performance GPUs for gaming and professional tasks. |
| [Market 3070](https://dashboard.nosana.com/markets/RXP7JK8MTY4uPJng4UjC9ZJdDDSG6wGr8pvVf3mwgXF)          |   RXP7JK8MTY4uPJng4UjC9ZJdDDSG6wGr8pvVf3mwgXF    | GPUs offering a good balance of performance and cost. |
| [Market A5000](https://dashboard.nosana.com/markets/4uBye3vJ1FAYukDdrvqQ36MZZZxqW3o8utWu8fyomRuN)        |   4uBye3vJ1FAYukDdrvqQ36MZZZxqW3o8utWu8fyomRuN   | High-performance GPUs for professional workloads. |
