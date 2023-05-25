# Squid SDK PoC

Proof of concept of the [Squid SDK](https://github.com/0xsquid/squid-sdk)

## Getting started

### Setting up the environment

1. Clone the Squid Core repo and install dependencies

```bash
git clone https://github.com/0xsquid/squid-core.git && cd ./squid-core && mv packages/contracts/secret.example.json packages/contracts/secret.json && yarn install
```

2. Start the Axelar development environment server

```bash
cd ./packages/contracts && yarn axelar:local
```

3. Open a new terminal and start the Squid API

```bash
cd ./packages/api && yarn dev
```

### Starting the Frontend development server

1. Clone this repo

```bash
git clone https://github.com/GenaroIBC/squid-sdk-poc.git && cd ./squid-sdk-poc
```

2. Rename the `.env.example` file to `.env.local` and add your local wallet's private key

```
mv .env.example .env.local && echo 'VITE_LOCAL_WALLET_PRIVATE_KEY=<YOUR_TEST_WALLET_PRIVATE_KEY>' >> .env.local
```

3. Install dependencies and start the development server

```bash
yarn install && yarn dev
```

Open your browser at [http://localhost:5173](http://localhost:5173) and start playing!
