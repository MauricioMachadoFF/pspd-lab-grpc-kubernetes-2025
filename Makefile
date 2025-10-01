# PSPD Lab - gRPC vs REST Microservices Management
# Academic comparison project with dual protocol implementation

# Configuration
PROJECT_NAME = pspd-lab-grpc-kubernetes-2025
DOCKER_REGISTRY ?= localhost:5000
VERSION ?= latest

# Service definitions
QR_REST_SERVICE = qr-generator-rest
URL_REST_SERVICE = url-shortener-rest
USER_MGMT_SERVICE = user-management-rest
ANALYTICS_SERVICE = analytics-rest

# Docker image names
QR_REST_IMAGE = $(DOCKER_REGISTRY)/$(QR_REST_SERVICE):$(VERSION)
URL_REST_IMAGE = $(DOCKER_REGISTRY)/$(URL_REST_SERVICE):$(VERSION)
USER_MGMT_IMAGE = $(DOCKER_REGISTRY)/$(USER_MGMT_SERVICE):$(VERSION)
ANALYTICS_IMAGE = $(DOCKER_REGISTRY)/$(ANALYTICS_SERVICE):$(VERSION)

# Ports configuration
QR_REST_PORT = 8082
URL_REST_PORT = 8083
USER_MGMT_PORT = 8080
ANALYTICS_PORT = 8081

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help build test clean up down restart logs status health install-deps

# Default target
help: ## Display this help message
	@echo "$(BLUE)PSPD Lab - gRPC vs REST Microservices Management$(NC)"
	@echo "$(YELLOW)Academic comparison project with dual protocol implementation$(NC)"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ================================
# DEVELOPMENT COMMANDS
# ================================

install-deps: ## Install dependencies for all REST services
	@echo "$(BLUE)Installing dependencies for all REST services...$(NC)"
	@cd services/rest/qr-generator && npm install
	@cd services/rest/url-shortener && npm install
	@cd services/rest/user-management && npm install
	@cd services/rest/analytics && npm install
	@echo "$(GREEN)✓ Dependencies installed for all 4 services$(NC)"

test: ## Run unit tests for all REST services
	@echo "$(BLUE)Running tests for all REST services...$(NC)"
	@cd services/rest/qr-generator && npm test
	@cd services/rest/url-shortener && npm test
	@cd services/rest/user-management && npm test || echo "$(YELLOW)⚠ User management tests not implemented yet$(NC)"
	@cd services/rest/analytics && npm test || echo "$(YELLOW)⚠ Analytics tests not implemented yet$(NC)"
	@echo "$(GREEN)✓ All tests completed$(NC)"

test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	@cd services/rest/qr-generator && npm run test:coverage
	@cd services/rest/url-shortener && npm run test:coverage
	@echo "$(GREEN)✓ Coverage reports generated$(NC)"

lint: ## Run linting for all services
	@echo "$(BLUE)Running linting checks...$(NC)"
	@cd services/rest/qr-generator && npm run lint || true
	@cd services/rest/url-shortener && npm run lint || true
	@echo "$(GREEN)✓ Linting completed$(NC)"

# ================================
# DOCKER BUILD COMMANDS
# ================================

build: build-qr-rest build-url-rest build-user-mgmt build-analytics ## Build all REST service images
	@echo "$(GREEN)✓ All REST services built successfully$(NC)"

build-qr-rest: ## Build QR Generator REST service image
	@echo "$(BLUE)Building QR Generator REST service...$(NC)"
	@docker build -t $(QR_REST_IMAGE) services/rest/qr-generator/
	@echo "$(GREEN)✓ QR Generator REST image built: $(QR_REST_IMAGE)$(NC)"

build-url-rest: ## Build URL Shortener REST service image
	@echo "$(BLUE)Building URL Shortener REST service...$(NC)"
	@docker build -t $(URL_REST_IMAGE) services/rest/url-shortener/
	@echo "$(GREEN)✓ URL Shortener REST image built: $(URL_REST_IMAGE)$(NC)"

build-user-mgmt: ## Build User Management service image
	@echo "$(BLUE)Building User Management service...$(NC)"
	@docker build -t $(USER_MGMT_IMAGE) services/rest/user-management/
	@echo "$(GREEN)✓ User Management image built: $(USER_MGMT_IMAGE)$(NC)"

build-analytics: ## Build Analytics service image
	@echo "$(BLUE)Building Analytics service...$(NC)"
	@docker build -t $(ANALYTICS_IMAGE) services/rest/analytics/
	@echo "$(GREEN)✓ Analytics image built: $(ANALYTICS_IMAGE)$(NC)"

push: ## Push all images to registry
	@echo "$(BLUE)Pushing images to registry...$(NC)"
	@docker push $(QR_REST_IMAGE)
	@docker push $(URL_REST_IMAGE)
	@docker push $(USER_MGMT_IMAGE)
	@docker push $(ANALYTICS_IMAGE)
	@echo "$(GREEN)✓ All images pushed to registry$(NC)"

# ================================
# DOCKER COMPOSE COMMANDS
# ================================

up: build ## Start all REST services with docker-compose
	@echo "$(BLUE)Starting all REST services...$(NC)"
	@docker-compose -f docker-compose.rest.yml up -d
	@echo "$(GREEN)✓ All REST services are running$(NC)"
	@echo "$(YELLOW)Service URLs:$(NC)"
	@echo "  QR Generator REST:  http://localhost:$(QR_REST_PORT)"
	@echo "  URL Shortener REST: http://localhost:$(URL_REST_PORT)"
	@echo "  User Management:    http://localhost:$(USER_MGMT_PORT)"
	@echo "  Analytics:          http://localhost:$(ANALYTICS_PORT)"

down: ## Stop all REST services
	@echo "$(BLUE)Stopping all REST services...$(NC)"
	@docker-compose -f docker-compose.rest.yml down
	@echo "$(GREEN)✓ All REST services stopped$(NC)"

restart: down up ## Restart all REST services

logs: ## View logs from all services
	@echo "$(BLUE)Viewing logs from all services...$(NC)"
	@docker-compose -f docker-compose.rest.yml logs -f

logs-qr: ## View QR Generator service logs
	@docker-compose -f docker-compose.rest.yml logs -f $(QR_REST_SERVICE)

logs-url: ## View URL Shortener service logs
	@docker-compose -f docker-compose.rest.yml logs -f $(URL_REST_SERVICE)

logs-user: ## View User Management service logs
	@docker-compose -f docker-compose.rest.yml logs -f $(USER_MGMT_SERVICE)

logs-analytics: ## View Analytics service logs
	@docker-compose -f docker-compose.rest.yml logs -f $(ANALYTICS_SERVICE)

# ================================
# STANDALONE DOCKER COMMANDS
# ================================

run-qr-rest: build-qr-rest ## Run QR Generator REST service standalone
	@echo "$(BLUE)Starting QR Generator REST service...$(NC)"
	@docker run -d --name $(QR_REST_SERVICE) -p $(QR_REST_PORT):$(QR_REST_PORT) $(QR_REST_IMAGE)
	@echo "$(GREEN)✓ QR Generator REST service running on port $(QR_REST_PORT)$(NC)"

run-url-rest: build-url-rest ## Run URL Shortener REST service standalone
	@echo "$(BLUE)Starting URL Shortener REST service...$(NC)"
	@docker run -d --name $(URL_REST_SERVICE) -p $(URL_REST_PORT):$(URL_REST_PORT) $(URL_REST_IMAGE)
	@echo "$(GREEN)✓ URL Shortener REST service running on port $(URL_REST_PORT)$(NC)"

run-user-mgmt: build-user-mgmt ## Run User Management service standalone
	@echo "$(BLUE)Starting User Management service...$(NC)"
	@docker run -d --name $(USER_MGMT_SERVICE) -p $(USER_MGMT_PORT):$(USER_MGMT_PORT) $(USER_MGMT_IMAGE)
	@echo "$(GREEN)✓ User Management service running on port $(USER_MGMT_PORT)$(NC)"

run-analytics: build-analytics ## Run Analytics service standalone
	@echo "$(BLUE)Starting Analytics service...$(NC)"
	@docker run -d --name $(ANALYTICS_SERVICE) -p $(ANALYTICS_PORT):$(ANALYTICS_PORT) $(ANALYTICS_IMAGE)
	@echo "$(GREEN)✓ Analytics service running on port $(ANALYTICS_PORT)$(NC)"

stop-all: ## Stop all standalone containers
	@echo "$(BLUE)Stopping all standalone containers...$(NC)"
	@docker stop $(QR_REST_SERVICE) $(URL_REST_SERVICE) $(USER_MGMT_SERVICE) $(ANALYTICS_SERVICE) 2>/dev/null || true
	@docker rm $(QR_REST_SERVICE) $(URL_REST_SERVICE) $(USER_MGMT_SERVICE) $(ANALYTICS_SERVICE) 2>/dev/null || true
	@echo "$(GREEN)✓ All standalone containers stopped and removed$(NC)"

# ================================
# HEALTH CHECK COMMANDS
# ================================

health: ## Check health of all services
	@echo "$(BLUE)Checking health of all services...$(NC)"
	@echo "$(YELLOW)QR Generator REST:$(NC)"
	@curl -s http://localhost:$(QR_REST_PORT)/health | jq . 2>/dev/null || echo "$(RED)Service not responding$(NC)"
	@echo "$(YELLOW)URL Shortener REST:$(NC)"
	@curl -s http://localhost:$(URL_REST_PORT)/health | jq . 2>/dev/null || echo "$(RED)Service not responding$(NC)"
	@echo "$(YELLOW)User Management:$(NC)"
	@curl -s http://localhost:$(USER_MGMT_PORT)/health | jq . 2>/dev/null || echo "$(RED)Service not responding$(NC)"
	@echo "$(YELLOW)Analytics:$(NC)"
	@curl -s http://localhost:$(ANALYTICS_PORT)/health | jq . 2>/dev/null || echo "$(RED)Service not responding$(NC)"

status: ## Show status of all containers
	@echo "$(BLUE)Container Status:$(NC)"
	@docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=qr-generator-rest\|url-shortener-rest\|user-management-rest\|analytics-rest"

# ================================
# DEVELOPMENT ENVIRONMENT
# ================================

dev-up: ## Start services in development mode
	@echo "$(BLUE)Starting services in development mode...$(NC)"
	@cd services/rest/qr-generator && npm run dev &
	@cd services/rest/url-shortener && npm run dev &
	@echo "$(GREEN)✓ Development servers started$(NC)"
	@echo "$(YELLOW)Services running in development mode:$(NC)"
	@echo "  QR Generator:   http://localhost:$(QR_REST_PORT)"
	@echo "  URL Shortener:  http://localhost:$(URL_REST_PORT)"

dev-down: ## Stop development servers
	@echo "$(BLUE)Stopping development servers...$(NC)"
	@pkill -f "nodemon.*qr-generator" 2>/dev/null || true
	@pkill -f "nodemon.*url-shortener" 2>/dev/null || true
	@echo "$(GREEN)✓ Development servers stopped$(NC)"

# ================================
# PERFORMANCE TESTING
# ================================

load-test: ## Run load tests against all services (requires artillery or similar)
	@echo "$(BLUE)Running load tests...$(NC)"
	@echo "$(YELLOW)Note: Install artillery globally (npm install -g artillery) to run load tests$(NC)"
	@echo "Example commands:"
	@echo "  artillery quick --count 100 --num 10 http://localhost:$(QR_REST_PORT)/api/v1/qr/generate"
	@echo "  artillery quick --count 100 --num 10 http://localhost:$(URL_REST_PORT)/api/v1/url/shorten"

benchmark: ## Run performance benchmarks
	@echo "$(BLUE)Running performance benchmarks...$(NC)"
	@echo "$(YELLOW)QR Generator Performance:$(NC)"
	@ab -n 100 -c 10 http://localhost:$(QR_REST_PORT)/health 2>/dev/null || echo "Install apache2-utils for benchmarking"
	@echo "$(YELLOW)URL Shortener Performance:$(NC)"
	@ab -n 100 -c 10 http://localhost:$(URL_REST_PORT)/health 2>/dev/null || echo "Install apache2-utils for benchmarking"

# ================================
# CLEANUP COMMANDS
# ================================

clean: ## Clean up Docker images and containers
	@echo "$(BLUE)Cleaning up Docker resources...$(NC)"
	@docker-compose -f docker-compose.rest.yml down -v --remove-orphans 2>/dev/null || true
	@docker system prune -f
	@echo "$(GREEN)✓ Docker cleanup completed$(NC)"

clean-all: clean ## Complete cleanup including node_modules
	@echo "$(BLUE)Performing complete cleanup...$(NC)"
	@cd services/rest/qr-generator && rm -rf node_modules package-lock.json 2>/dev/null || true
	@cd services/rest/url-shortener && rm -rf node_modules package-lock.json 2>/dev/null || true
	@docker rmi $(QR_REST_IMAGE) $(URL_REST_IMAGE) $(USER_MGMT_IMAGE) $(ANALYTICS_IMAGE) 2>/dev/null || true
	@echo "$(GREEN)✓ Complete cleanup finished$(NC)"

reset: clean-all install-deps build ## Reset entire environment

# ================================
# UTILITY COMMANDS
# ================================

show-services: ## Show all service information
	@echo "$(BLUE)REST Services Configuration:$(NC)"
	@echo "$(YELLOW)Academic Comparison Services (equivalent gRPC functionality):$(NC)"
	@echo "  QR Generator REST:     Port $(QR_REST_PORT) - Equivalent to gRPC QR service"
	@echo "  URL Shortener REST:    Port $(URL_REST_PORT) - Equivalent to gRPC URL service"
	@echo ""
	@echo "$(YELLOW)Extended Production Services (REST only):$(NC)"
	@echo "  User Management:       Port $(USER_MGMT_PORT) - Authentication & profiles"
	@echo "  Analytics Dashboard:   Port $(ANALYTICS_PORT) - Data aggregation & reporting"
	@echo ""
	@echo "$(BLUE)Total Architecture: 1 Gateway + 2 gRPC + 4 REST services$(NC)"

show-endpoints: ## Show all service endpoints
	@echo "$(BLUE)Service Endpoints:$(NC)"
	@echo ""
	@echo "$(YELLOW)QR Generator REST (Port $(QR_REST_PORT)):$(NC)"
	@echo "  POST   /api/v1/qr/generate     - Generate single QR code"
	@echo "  POST   /api/v1/qr/batch        - Generate QR batch"
	@echo "  POST   /api/v1/qr/upload       - Upload data for QR processing"
	@echo "  GET    /api/v1/qr/:id          - Get QR code by ID"
	@echo "  DELETE /api/v1/qr/:id          - Delete QR code"
	@echo "  GET    /health                 - Health check"
	@echo ""
	@echo "$(YELLOW)URL Shortener REST (Port $(URL_REST_PORT)):$(NC)"
	@echo "  POST   /api/v1/url/shorten     - Shorten URL"
	@echo "  GET    /api/v1/url/:code       - Resolve short URL"
	@echo "  GET    /api/v1/url/:code/stats - Get click statistics"
	@echo "  POST   /api/v1/url/bulk        - Bulk URL shortening"
	@echo "  GET    /health                 - Health check"
	@echo ""
	@echo "$(YELLOW)User Management (Port $(USER_MGMT_PORT)):$(NC)"
	@echo "  Placeholder service - Full implementation pending"
	@echo ""
	@echo "$(YELLOW)Analytics (Port $(ANALYTICS_PORT)):$(NC)"
	@echo "  Placeholder service - Full implementation pending"

# ================================
# DOCUMENTATION
# ================================

docs: ## Generate API documentation
	@echo "$(BLUE)Generating API documentation...$(NC)"
	@echo "$(YELLOW)API Documentation locations:$(NC)"
	@echo "  QR Generator:   http://localhost:$(QR_REST_PORT)/"
	@echo "  URL Shortener:  http://localhost:$(URL_REST_PORT)/"
	@echo "$(GREEN)✓ Access running services for interactive API documentation$(NC)"

# ================================
# ACADEMIC COMPARISON HELPERS
# ================================

compare-setup: ## Set up environment for gRPC vs REST comparison
	@echo "$(BLUE)Setting up academic comparison environment...$(NC)"
	@echo "$(YELLOW)This will start REST services for comparison with gRPC services$(NC)"
	@make build
	@make up
	@echo "$(GREEN)✓ REST services ready for academic comparison$(NC)"
	@echo ""
	@echo "$(BLUE)Next steps for comparison study:$(NC)"
	@echo "1. Start equivalent gRPC services"
	@echo "2. Run performance tests on both implementations"
	@echo "3. Compare latency, throughput, and resource usage"
	@echo "4. Document findings in performance comparison report"