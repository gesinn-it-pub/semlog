.PHONY: ci
ci: lint format-check test

.PHONY: lint
lint:
	npm run lint

.PHONY: format
format:
	npm run format

.PHONY: format-check
format-check:
	npm run format:check

.PHONY: test
test:
	npm test
