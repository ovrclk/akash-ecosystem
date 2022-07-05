OWNER   := $(shell bash -c 'echo $$USER')
RANDOM  := $(shell bash -c 'echo $$RANDOM')
IMAGE   := akash-ecosystem
VERSION := $(shell git rev-parse --short HEAD)-$(RANDOM)

build: pack image push-image

pack:
	pack build ghcr.io/$(OWNER)/$(IMAGE):$(VERSION) --builder heroku/buildpacks:20 --env "NODE_ENV=production"

image:
	docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/$(OWNER)/$(IMAGE):$(VERSION)

push-image:
	docker push ghcr.io/$(OWNER)/$(IMAGE):$(VERSION)

	# latest image optionally
	docker tag ghcr.io/$(OWNER)/$(IMAGE):$(VERSION) ghcr.io/$(OWNER)/$(IMAGE):latest
	docker push ghcr.io/$(OWNER)/$(IMAGE):latest

.PHONY: build pack image push-image