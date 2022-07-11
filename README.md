# akash-ecosystem

Web application to browse and search projects powered by Akash Network. Build using Next.JS and Tailwind. This application is static during runtime and uses Airtable Base [Akash Ecosystem](https://airtable.com/shrrBXKJbvoawD8HS) as the canonical source for project data during build time.

## Run

The simplest way to run locally is using Docker:

```sh

docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/gosuri/akash-ecosystem

```
Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

Or start the deployment server using:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying to Akash

Outline to deploy on Akash:

1. Setup Buildpack locally.
1. Build Container Image.
1. Publish Container Image.
1. Generate SDL file.
1. Deploy on Akash.

**Pro Tip**: Running `make` will run steps 1-3.

### Install Buildpack

Install [Buildpacks](https://buildpacks.io) using Homebrew: 

```
brew install buildpacks/tap/pack
```
or manually:

```
(curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.27.0/pack-v0.27.0-linux.tgz" | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack)
```

### Setup Environment

1. The `OWNER` environment variable should be your GitHub user name.
1. `IMAGE` is the name of the container image for the build.
1. `VERSION` is the short Git version hash.

```
export OWNER=${USER}
export IMAGE=akash-ecosystem
```

### Build Container Image using Buildpacks

Use `make pack` to build the image or manually Build the image using Buildpacks with the Heroku build pack:

```

pack build ghcr.io/${OWNER}/${IMAGE} --builder heroku/buildpacks:20 --env "NODE_ENV=production"
```

Test the image by running docker locally.

```
docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/${OWNER}/${IMAGE}
```

Verify by visiting http://localhost:8080 in your browser

### Pushing Image to Github Registry

Check out the instructions in this [guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) for authenticating to Github Container Registry.


```
# push the latest version
docker push ghcr.io/${OWNER}/${IMAGE}:latest

# push the versioned image

export VERSION=$(git rev-parse --short HEAD)
docker tag ghcr.io/${OWNER}/${IMAGE}:latest ghcr.io/${OWNER}/${IMAGE}:${VERSION} 
docker push ghcr.io/${OWNER}/${IMAGE}:${VERSION} 
```

### Generating SDL

```
eval "cat <<EOF
$(<sdl.yml.tmpl)
EOF
" 2> /dev/null > sdl.yml
```

### Deploying on to Akash

Follow this [guide](https://docs.akash.network/guides/cli/detailed-steps) for deploying Akash using the generated SDL to create the Deployment transaction and send the manifest to the provider.

```
akash tx deployment create sdl.yml 
...
akash provider send-manifest sdl.yml --provider PROVIDER
```

### Using the CLI

#### Setup your environment

You need to set the below set of variables

| Variable | Description | TX | Recommended Value
| -- | -- | -- | --
| AKASH_HOME | Home directory for Akash Data | Create, Update | .akash
| AKASH_NODE | Akash RPC Node to connect to. [Cosmos Directory](https://cosmos.directory/akash/nodes) has a good set of public endpoints to use | Create, Update | https://rpc.prod.ewr1.akash.farm:443/token/YOOCH5OV/
| AKASH_GAS | Gas limit to set per-transaction; set to "auto" to calculate sufficient gas automatically | Create, Update | auto
| AKASH_GAS_ADJUSTMENT | Adjustment factor to be multiplied against the estimate returned by the tx simulation | Create, Update | 1.15
| AKASH_GAS_PRICES | Gas prices in decimal format to determine the transaction fee | Create, Update | 0.025uakt
| AKASH_SIGN_MODE | Signature mode | Create, Update | amino-json
| AKASH_CHAIN_ID | The network chain ID | Create, Update | akashnet-2
| AKASH_FROM | Name or address of private key with which to sign | Create, Update | AKASH_GITHUB_RUNNER
| AKASH_KEYRING_BACKEND | Select keyring's backend | Create, Update |  test
| AKASH_PROVIDER | Provider ID the deployment is present on | Update | akash1q7spv2cw06yszgfp4f9ed59lkka6ytn8g4tkjf
| AKASH_DSEQ | Deployment Sequence Number | Update | 5080238


Create an environment file `.akash.env` with the variables

```
cat > .akash.env <<EOF
export AKASH_HOME=.akash
export AKASH_NODE=https://rpc.prod.ewr1.akash.farm:443/token/YOOCH5OV/
export AKASH_GAS=auto
export AKASH_GAS_ADJUSTMENT=1.25
export AKASH_GAS_PRICES=0.025uakt
export AKASH_CHAIN_ID=akashnet-2
export AKASH_SIGN_MODE=amino-json
EOF

source .akash.env
```

You will need an AKT wallet to pay for the deployment. However, it is best practice to have two wallets, one for deployment with minimal funds for gas fees and one wallet with the funds that authorize the deploy wallet to use its funds.

### Setup Payment and Deploy Wallet

Generate your Deploy wallet if you do not have one using:

```sh
akash keys add deploy
```

You'll see an output similar to:

```
- name: deploy
  type: local
  address: akash1qpcfealqyc9l9e089qd6ka2a25yy664q2aglmx
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Awil3peyeAazEveyoHlrHLFOFrVi0tLSbn0PMQPlvyT2"}'
  mnemonic: ""


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

glue legal tomorrow puppy step gift clinic account happy devote wet again laundry canvas produce task fever cool alarm flush trigger pigeon rule surface
```

The last line is the mnemonic phrase that you should secure in a safe place. It is the only way to recover your account if you ever forget your password.

If you already have a deploy wallet, import using the below:

```sh
echo MNEMONIC_PHRASE | akash keys add --recover deploy
```

Replace `MNEMONIC_PHRASE` with your actual value. Example:

```sh
echo "glue legal tomorrow puppy step gift clinic account happy devote wet again laundry canvas produce task fever cool alarm flush trigger pigeon rule surface" | akash keys add --recover deploy
```

Generate your payment wallet using:

```sh
akash keys add payment
```

### Fund your Payment Wallet

Fund your `payment` wallet from a supported exchange. [Osmosis](https://app.osmosis.zone/?from=USDC&to=AKT) is a preferred Decentralized Exchange.

### Authorize Deploy Wallet with Payment Wallet

[Authorized Spend](https://docs.akash.network/features/authorized-spend) allows users to authorize spend of a set number of tokens from a source wallet to a destination, funded wallet using a feature called AuthZ with below command:

```sh
akash tx deployment authz grant DEPLOY_WALLET AMOUNT --from PAYMENT_WALLET
```

Replace `DEPLOY_WALLET`, `AMOUNT` and `PAYMENT_WALLET` with actual values. Example:

```sh
akash tx deployment authz grant akash1qpcfealqyc9l9e089qd6ka2a25yy664q2aglmx 50000000uakt --from payment
```

In the above example, I'm authorizing deploy wallet with address `akash1qpcfealqyc9l9e089qd6ka2a25yy664q2aglmx` to spend up to 50 AKT from my `payment` wallet.


### Create Deployment Transaction

Ensure your SDL file is ready; see the above sections on guides to build one.