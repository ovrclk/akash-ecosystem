OWNER   := $(shell bash -c 'echo $$USER')
RANDOM  := $(shell bash -c 'echo $$RANDOM')
IMAGE   := akash-ecosystem
VERSION := $(shell git rev-parse --short HEAD)-$(RANDOM)

build: pack publish gen-sdl

pack:
	pack build ghcr.io/$(OWNER)/$(IMAGE) --builder heroku/buildpacks:20 --env "NODE_ENV=production" --cache-image ghcr.io/$(OWNER)/$(IMAGE):latest --publish

publish:
	docker tag ghcr.io/$(OWNER)/$(IMAGE):latest ghcr.io/$(OWNER)/$(IMAGE):$(VERSION)
	docker push ghcr.io/$(OWNER)/$(IMAGE):$(VERSION) 

run:
	docker run -it --rm -e NODE_ENV=production -p 8080:3000 ghcr.io/$(OWNER)/$(IMAGE)

gen-sdl:
	OWNER=$(OWNER) IMAGE=$(IMAGE) VERSION=$(VERSION) scripts/gen-sdl

.PHONY: build pack image push-image gen-sdl