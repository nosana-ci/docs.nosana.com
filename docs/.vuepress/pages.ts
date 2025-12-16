export default [
  {
    text: 'About',
    icon: 'lightbulb',
    prefix: '/about/',
    collapsible: true,
    children: ['intro', 'background', 'roadmap', 'glossary', 'community'],
  },
  {
    text: 'Host GPUs',
    icon: 'server',
    prefix: '/hosts/',
    collapsible: true,
    children: ['grid', 'grid-ubuntu', 'grid-run', 'troubleshoot'],
  },
  {
    text: 'Run Inference (CLI)',
    icon: 'rocket',
    prefix: '/inference/',
    collapsible: true,
    children: [
      'quick_start',
      'writing_a_job',
      {
        text: 'Examples',
        prefix: '/inference/examples/',
        collapsible: true,
        children: [
          'hello_world',
          'jupyter',
          'open_webui',
          'stable',
          'whisper',
          'ollama',
          'tinyllama',
          'multi_job',
          'vllm',
          'lmdeploy',
        ],
      },
    ],
  },

  {
    text: 'Wallet',
    icon: 'wallet',
    prefix: '/wallet/',
    collapsible: true,
    children: ['token', 'key'],
  },
  {
    text: 'Protocols',
    icon: 'cubes',
    prefix: '/protocols/',
    collapsible: true,
    children: ['start', 'staking', 'rewards', 'pools', 'jobs', 'nodes', 'token'],
  },
];
