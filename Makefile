ENV_FILE := $(if $(wildcard infra/.env),infra/.env,$(if $(ENV),$(ENV),infra/.env.example))

build:
	pnpm install
# uncomment this to build everything 
# but frontend is quite slow because of babylonjs
# pnpm -r build 
	pnpm --filter @app/backend build
	docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) build $(filter-out $@,$(MAKECMDGOALS)) 

up:
	docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) up -d $(filter-out $@,$(MAKECMDGOALS))
restart:
	docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) restart $(filter-out $@,$(MAKECMDGOALS)) 
down:
	docker compose -f infra/docker-compose.yml --env-file $(ENV_FILE) down $(filter-out $@,$(MAKECMDGOALS)) 
stop:
	docker compose -f infra/docker-compose.yml stop $(filter-out $@,$(MAKECMDGOALS)) 
logs:
	docker compose -f infra/docker-compose.yml logs $(filter-out $@,$(MAKECMDGOALS))
exec:
	docker compose -f infra/docker-compose.yml exec $(filter-out $@,$(MAKECMDGOALS)) sh
clean:
	docker compose -f infra/docker-compose.yml down -v --remove-orphans --rmi all

re:
	rm -rf node_modules
	make clean
	make build
	make up

reload-nginx:
	@docker compose -f infra/docker-compose.yml exec nginx nginx -s reload

# to view db in the browser, it will be at local.drizzle.studio after starting studio
studio:
	@echo "... Starting Drizzle Studio at \033[34mhttps://local.drizzle.studio \033[0m..."
	@echo "\033[90m" && docker compose -f infra/docker-compose.yml exec backend sh -c "cd /app \
		&& npx --yes drizzle-kit@0.31.5 studio --host 0.0.0.0 --port 4983 \
		| sed '/local.drizzle.studio/d'" && echo "\033[0m"
