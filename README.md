# akash-ecosystem

Web application to browse and search projects powered by Akash Network. Build using Next.JS and Tailwind. This application is static during runtime and uses Airtable Base [Akash Ecosystem](https://airtable.com/shrrBXKJbvoawD8HS) as the canonical source for project data during build time.

## Run

The simplest way to run locally is using Docker:

```sh
docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/gosuri/akash-treasury
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

Install Buildpack using Homebrew: 

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

Build the image using the Heroku build pack

```
export VERSION=$(git rev-parse --short HEAD)
pack build ghcr.io/${OWNER}/${IMAGE}:${VERSION} --builder heroku/buildpacks:20 --env "NODE_ENV=production"
```

Test the image by running docker locally.

```
docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/${OWNER}/${IMAGE}:${VERSION}
```

Verify by visiting http://localhost:8080 in your browser

### Pushing Image to Github Registry

Check out the instructions in this [guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) for authenticating to Github Container Registry.

```
docker push ghcr.io/${OWNER}/${IMAGE}:${VERSION}

# latest image optionally
docker tag ghcr.io/${OWNER}/${IMAGE}:${VERSION} ghcr.io/${OWNER}/${IMAGE}:latest
docker push ghcr.io/${OWNER}/${IMAGE}:latest
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