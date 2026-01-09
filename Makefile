ENV_FILE := $(if $(wildcard infra/.env),infra/.env,$(if $(ENV),$(ENV),infra/.env.example))

build:
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) build $(filter-out $@,$(MAKECMDGOALS))
build-nocache:
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) build --no-cache $(filter-out $@,$(MAKECMDGOALS))
up:
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) up -d $(filter-out $@,$(MAKECMDGOALS))
restart:
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) build $(filter-out $@,$(MAKECMDGOALS)) 
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) up -d $(filter-out $@,$(MAKECMDGOALS)) 
down:
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) down $(filter-out $@,$(MAKECMDGOALS)) 
stop:
	@docker compose -f infra/docker-compose.yml stop $(filter-out $@,$(MAKECMDGOALS)) 
logs:
	@docker compose -f infra/docker-compose.yml logs -f $(filter-out $@,$(MAKECMDGOALS))
exec:
	@docker compose -f infra/docker-compose.yml exec $(filter-out $@,$(MAKECMDGOALS)) sh
install:
	npm install services/backend/
	npm install services/frontend/
prune-db:
	rm -rf services/backend/database/app.db
	rm -rf services/backend/drizzle/*
clean:
	rm -rf services/backend/dist
	rm -rf services/frontend/dist
	docker compose -f infra/docker-compose.yml down -v --remove-orphans --rmi all

reload-nginx:
	@docker compose -f infra/docker-compose.yml exec nginx nginx -s reload

seed-db:
	@docker compose -f infra/docker-compose.yml exec backend sh -c "cd /app/services/backend && pnpm db:seed"
	
prune:
	docker system prune -a

# Usage: make seed-blockchain <count>
ARGS := $(filter-out seed-blockchain,$(MAKECMDGOALS))
.PHONY: seed-blockchain $(ARGS)
$(ARGS):

seed-blockchain:
	@if [ -z "$(ARGS)" ]; then \
		echo "Usage: make seed-blockchain <count>"; exit 1; \
	fi
	@docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) exec backend sh -c \
		"cd /app/services/backend && MATCH_SEED_COUNT=$(ARGS) pnpm chain:seed-matches"

hard-reset:
	make down
	make prune
	make prune-db
	make clean
	rm -rf node_modules
	rm -rf services/backend/node_modules
	rm -rf services/frontend/node_modules
	rm -rf services/backend/package-lock.json
	rm -rf services/frontend/package-lock.json
run:
	make build
	make up

re:
	rm -rf node_modules
	make clean
	make build
	make up

# to view db in the browser, it will be at local.drizzle.studio after starting studio
studio:
	@echo "... Starting Drizzle Studio at \033[34mhttps://local.drizzle.studio \033[0m..."
	echo "\033[90m" && \
	    docker compose -f infra/docker-compose.yml exec -d backend sh -c "cd /app/services/backend \
	    && npx drizzle-kit studio --host 0.0.0.0 --port 4983" \
		&& echo "\033[0m" 
