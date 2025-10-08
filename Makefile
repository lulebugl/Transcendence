build:
	docker compose -f infra/docker-compose.yml build

up:
	docker compose -f infra/docker-compose.yml up -d

clean:
	docker compose -f infra/docker-compose.yml down -v --remove-orphans --rmi all

down:
	docker compose -f infra/docker-compose.yml down

logs:
	docker compose -f infra/docker-compose.yml logs -f

re:
	make clean
	make build
	make up

