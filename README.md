# akash-ecosystem

Web app to display projects in the Akash Ecosystem.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying to Akash

### Install Buildpack

Install Buildpack using Homebrew: 

```
brew install buildpacks/tap/pack
```

or manually:
```
(curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.27.0/pack-v0.27.0-linux.tgz" | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack)
```

### Build Container Image using Buildpack

Set the `OWNER` environment variable to your GitHub user name.

```
export OWNER=gosuri
```

Build the image using Heroku build pack

```
pack build ghcr.io/gosuri/akash-ecosystem --builder heroku/buildpacks:20 --env NODE_ENV=production
```

Test the image by running docker locally.

```
docker run -it --rm -e NODE_ENV=production -p 8080:3000 gosuri/akash-ecosystem
```

Verify by visiting http://localhost:8080 in your browser

### Pushing Image to Github Registry

Check out the instructions in this [guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) for authenticating

```
docker push ghcr.io/gosuri/akash-ecosystem
```