# akash-ecosystem

Web application to browse and search projects powered by Akash Network. Built using Next.JS and Tailwind. This application is static during runtime and uses Airtable Base [Akash Ecosystem](https://airtable.com/shrrBXKJbvoawD8HS) as the canonical source for project data during build time.

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

## Deploying to Production

This is a guide to containerizing [Next JS](https://nextjs.org/) application and deploying on [Akash](https://akash.network) in a non-custodial way. Akash is a permissionless and censorship-resistant cloud network that guarantees sovereignty over your data and applications. With Akash, you’re in complete control of all aspects of the life cycle of an application with no intermediary. Outline of Steps to deploy on Akash:

1. Setup Buildpack locally.
1. Build Container Image.
1. Publish Container Image.
1. Generate SDL file.
1. Deploy on Akash.

**Pro Tip**: Checkout the `Makefile` for tasks that automates the workflow. `make build` and `make deploy` cover steps 2-5.

## Before We Begin

This technical guide best suits a reader with basic Linux command line knowledge. The audience for this guide is intended for includes:

* Application developers with little or no systems administration experience want to deploy applications on the decentralized cloud.
* System administrators with little or no experience with infrastructure automation want to learn more.
* Infrastructure automation engineers that want to explore decentralized cloud.
* Anyone who wants to get a feel for the current state of the decentralized cloud ecosystem.

You will need the below set up before we begin:

1) Install Akash: Make sure to have the Akash client installed on your workstation, check [install guide](https://docs.akash.network/guides/cli/detailed-steps/part-1.-install-akash) for instructions.
1) Choose Your Akash Network: You'll need to know information about the network you're connecting your node to. See [Choosing a Network](https://docs.akash.network/guides/version) for how to obtain any network-related information.
1) Fund Your Account: You'll need a AKT wallet with funds to pay for your deployment. See the [funding guide](https://docs.akash.network/guides/cli/detailed-steps/part-3.-fund-your-account) creating a key and funding your account.
1) Install Docker: You'll need docker running on your workstation; follow this [guide](https://docs.docker.com/get-docker/)](https://docs.docker.com/get-docker/) to setup Docker on your workstation..
1) Setup Container Registry: To stage your containers to deploy onto Akash. We'll be using GitHub Container Registry in this guide. 
1) Setup Builpacks.io: Builpacks.io is a Cloud Native Buildpacks that transform your application source code into images that can run on any cloud. Install `pack` tool using this comprehensive [guide](https://buildpacks.io/docs/tools/pack/#install) or install using the below:

```sh
# using Homebrew
brew install buildpacks/tap/pack

# or download directly
(curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.27.0/pack-v0.27.0-linux.tgz" | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack)
```

### Build Container Image using Buildpacks

We will use `ghcr.io/OWNER/IMAGE`

1. The `OWNER` environment variable should be your GitHub user name. In my case `gosuri`
1. `IMAGE` is the name of the container image for the build. In ourcase we're deploying `akash-ecosystem`


```sh
export OWNER=${USER}
export IMAGE=akash-ecosystem
```

Use `make pack` to build the image or manually Build the image using Buildpacks with the Heroku build pack:

```sh
pack build ghcr.io/${OWNER}/${IMAGE} --builder heroku/buildpacks:20 --env "NODE_ENV=production"
```

Test the image by running docker locally.

```
docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/${OWNER}/${IMAGE}
```

Verify by visiting http://localhost:8080 in your browser

### Pushing Image to Github Registry

Check out the instructions in this [guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) for authenticating to Github Container Registry.

We use the Git short hash and a random postfix as the version to ensure the image is always new.


```
# set the verion
export VERSION=$(git rev-parse --short HEAD)-${RANDOM}


# tag the latest versioned image
docker tag ghcr.io/${OWNER}/${IMAGE}:latest ghcr.io/${OWNER}/${IMAGE}:${VERSION} 

# push the 'latest' and versioned images 
docker push ghcr.io/${OWNER}/${IMAGE}:latest
docker push ghcr.io/${OWNER}/${IMAGE}:${VERSION} 
```

### Generating SDL

```
eval "cat <<EOF
$(<sdl.yml.tmpl)
EOF
" 2> /dev/null > sdl.yml
```

## Deploying on to Akash

Follow this [guide](https://docs.akash.network/guides/cli/detailed-steps) for deploying Akash using the generated SDL to create the Deployment transaction and send the manifest to the provider.

```
akash tx deployment create sdl.yml 
...
akash provider send-manifest sdl.yml --provider PROVIDER
```

### Setup your environment

Please set the below set of environment variables

| Variable | Description | Recommended Value
| -- | -- | -- |
| AKASH_NODE | Akash RPC Node to connect to. [Cosmos Directory](https://cosmos.directory/akash/nodes) has a good set of public endpoints to use | `https://rpc.prod.ewr1.akash.farm:443/token/YOOCH5OV/`
| AKASH_GAS | Gas limit to set per-transaction; set to "auto" to calculate sufficient gas automatically | `auto`
| AKASH_GAS_ADJUSTMENT | Adjustment factor to be multiplied against the estimate returned by the tx simulation | `1.15`
| AKASH_GAS_PRICES | Gas prices in decimal format to determine the transaction fee | Create, Update | 0.025uakt
| AKASH_SIGN_MODE | Signature mode | `amino-json`
| AKASH_CHAIN_ID | The network chain ID | `akashnet-2`

Create an environment file `.akash/ENV` with the variables for easier operations using:

```
cat > .akash/ENV <<EOF
export AKASH_NODE=https://rpc.prod.ewr1.akash.farm:443/token/YOOCH5OV/
export AKASH_GAS=auto
export AKASH_GAS_ADJUSTMENT=1.25
export AKASH_GAS_PRICES=0.025uakt
export AKASH_CHAIN_ID=akashnet-2
export AKASH_SIGN_MODE=amino-json
EOF

source .akash/ENV
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

### Fund your Deploy Wallet for Gas

Send 10 AKT to your deploy wallet from your payment wallet for Gas.

```sh
akash tx send payment $(akash keys show deploy -a) 10000000uakt
```

### Generate Certificate

A certificate is required to deploy to Akash. [Generate and publish](https://docs.akash.network/guides/cli/detailed-steps/part-6.-create-your-certificate) one using the command below:

```sh
akash tx cert generate client --from deploy

akash tx cert publish client --from deploy
```

### Authorize Deploy Wallet with Payment Wallet

[Authorized Spend](https://docs.akash.network/features/authorized-spend) allows users to authorize spend of a set number of tokens from a source wallet to a destination, funded wallet using a feature called AuthZ with below command:

```sh
akash tx deployment authz grant DEPLOY_WALLET AMOUNT --from PAYMENT_WALLET
```

Replace `DEPLOY_WALLET`, `AMOUNT` and `PAYMENT_WALLET` with actual values. Example:

```sh
akash tx deployment authz grant $(akash keys show deploy -a) 50000000uakt --from payment
```

In the above example, I'm authorizing deploy wallet with address `akash1qpcfealqyc9l9e089qd6ka2a25yy664q2aglmx` to spend up to 50 AKT from my `payment` wallet.

You can verify the grant using:

```
akash query authz grants $(akash keys show payment -a) $(akash keys show deploy -a)
```

You should see a response similar to:

```
grants:
- authorization:
    '@type': /akash.deployment.v1beta2.DepositDeploymentAuthorization
    spend_limit:
      amount: "50000000"
      denom: uakt
  expiration: "2023-07-11T04:21:26Z"
pagination:
  next_key: null
  total: "0"
```

### Deployment Sequence (DSEQ)

Deployments on Akash are identified using a unique integer called deployment sequence (DSEQ). You can set the DSEQ in the deployment, or one will be generated for you. We will pre-set the DSEQ in this guide for simpler operations using a random number and save it `.akash/DSEQ`.

```sh
echo $(($(date +"%Y%m%d") + ${RANDOM})) > .akash/DSEQ
```

### Create Deployment Transaction

Ensure your SDL file is ready; see the above sections on guides to build one.

```sh
akash tx deployment create sdl.yml --dseq $(cat .akash/DSEQ) --from deploy --depositor-account $(akash keys show payment -a)
```

Optionally, you can list your deployment using:

```sh
akash query deployment list --state active --owner $(akash keys show deploy -a)
```

### Create Lease 

The command below will display the open bids for your deployment:

```sh
akash query market bid list --owner=$(akash keys show deploy -a) --dseq $(cat .akash/DSEQ) --state open
```

These bids will expire in about 5 minutes; pick a provider to create a lease. To simplify operations, save the provider in `.akash/PROVIDER` file:

```sh
echo "akash1lywpn4nkj37l2yqmrxaqdq485qz2auwats3qud" > .akash/PROVIDER
```

Create a lease with the provider using the below command:

```sh
akash tx market lease create --from deploy --dseq $(cat .akash/DSEQ) --provider $(cat .akash/PROVIDER)
```

### Upload Manifest

The next step is to send the deploy manifest to complete the deployment. Deploy manifest contains sensitive information you share with the provider, like the container image and the configuration variables. Run the below command to send the manifest:

```sh
akash provider send-manifest --provider $(cat .akash/PROVIDER) --dseq $(cat .akash/DSEQ) --from deploy sdl.yml 
```

### Check Lease Status

Each deployment on Akash has a unique URL that allows you to access the application.  You can access the endpoints by querying for the lease status.

Please note the deployment takes a few seconds to pull the container image and start the container, during which time you will receive a 503 error.

Check the latest status using the below command:

```sh
akash provider lease-status --provider $(cat .akash/PROVIDER) --dseq $(cat .akash/DSEQ) --from deploy
```

### Closing your Deployment (Optional)

Optionally, you can close the deployment using the below command:

```sh
akash tx deployment close --dseq $(cat .akash/DSEQ) --owner $(akash keys show deploy -a) --from deploy
```

### Updating your Deployment 

The below command updates the deployment when changes are in the SDL file. Run `make build` to rebuild the SDL with a new build.

```sh
make build # can skip if sdl file is manually updated

akash tx deployment update --dseq $(cat .akash/DSEQ) --from deploy sdl.yml
```

### Setting Github Actions to auto deploy on Git push

TBD
