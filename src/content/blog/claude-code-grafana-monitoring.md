---
title: "Monitoring Claude Code with OpenTelemetry and Grafana"
description: "Set up a complete monitoring stack for Claude Code using OpenTelemetry, Prometheus, and Grafana. Track usage, costs, token consumption, and productivity metrics with Docker."
publishDate: 2025-12-14
authors: ["claude-code"]
tags: ["tutorial", "monitoring", "opentelemetry", "grafana", "docker", "productivity"]
featured: true
draft: false
---

# Monitoring Claude Code with OpenTelemetry and Grafana

You're using Claude Code daily. Sessions add up. Tokens accumulate. PRs get created. But how much are you actually using it? What's the ROI? Which models cost the most? How productive is your team with AI assistance?

Without monitoring, these questions stay unanswered. You're flying blind on usage patterns, costs, and productivity gains.

**Claude Code ships with OpenTelemetry support.** You can track sessions, token consumption, costs, commits, lines of code changed, and active time—all with standard observability tools.

This tutorial shows you how to set up a complete monitoring stack using Docker: OpenTelemetry Collector, Prometheus, and Grafana. By the end, you'll have dashboards tracking every aspect of your Claude Code usage.

## What You'll Monitor

Claude Code's OpenTelemetry implementation provides two types of data:

### Metrics

**Usage Statistics:**
- `claude_code.session.count` - CLI sessions started
- `claude_code.commit.count` - Git commits created
- `claude_code.pull_request.count` - PRs created
- `claude_code.lines_of_code.count` - Lines modified (added/removed)

**Token and Cost Tracking:**
- `claude_code.token.usage` - Tokens consumed (input/output/cache read/cache creation)
- `claude_code.cost.usage` - Session cost in USD

**Productivity Metrics:**
- `claude_code.active_time.total` - Active usage time in seconds
- `claude_code.code_edit_tool.decision` - Tool permission decisions

**Standard Attributes** (attached to all metrics):
- `session.id` - Unique session identifier
- `app.version` - Claude Code version
- `user.account_uuid` - Account UUID
- `organization.id` - Organization UUID (when authenticated)
- `terminal.type` - Terminal application (iTerm.app, vscode, cursor, tmux, etc.)

### Events

**User Prompts** (`claude_code.user_prompt`):
- Prompt length and content (content redacted by default)

**Tool Results** (`claude_code.tool_result`):
- Tool name, success status, duration, errors
- Decision (accept/reject) and source (config, user_permanent, user_temporary)
- Tool-specific parameters

**API Interactions** (`claude_code.api_request` and `claude_code.api_error`):
- Model used, tokens consumed, cost, duration
- Error messages and status codes for failures

**Tool Decisions** (`claude_code.tool_decision`):
- Which tools were accepted or rejected
- Records tool name, decision, and source

### Privacy and Security

Claude Code's telemetry is **opt-in** and privacy-focused:

- **Explicit enablement required** - Disabled by default
- **No sensitive data** - API keys and file contents never included
- **Prompt redaction** - User prompts redacted by default (enable with `OTEL_LOG_USER_PROMPTS=1`)
- **Cardinality control** - Configure which attributes to include

## Architecture Overview

The monitoring stack has four components:

```
Claude Code → OpenTelemetry Collector → Prometheus → Grafana
```

**Claude Code**: Exports metrics and events via OTLP (OpenTelemetry Protocol)

**OpenTelemetry Collector**: Receives OTLP data, processes it, and exposes a Prometheus-compatible endpoint. Supports both gRPC (port 4317) and HTTP (port 4318) protocols.

**Prometheus**: Time-series database that scrapes metrics from the collector. Stores data for queries and historical analysis. Default retention: 90 days.

**Grafana**: Visualization platform for dashboards, charts, and alerts.

**Why not connect Claude Code directly to Prometheus?** Prometheus uses a pull model (scraping), while Claude Code uses a push model (OTLP). The OpenTelemetry Collector bridges this gap, converting OTLP to Prometheus's format.

## Prerequisites

Before starting, ensure you have:

| Requirement | Details |
|------------|---------|
| **Docker** | Version 20.10+ |
| **Docker Compose** | Version 2.0+ |
| **Available Ports** | 3000, 4317, 4318, 8889, 9090, 13133, 55679 |
| **Disk Space** | ~1GB for 90 days of retention |

Verify Docker versions:

```bash
docker --version      # Should show 20.10+
docker compose version # Should show 2.0+
```

## Setup Part 1: Directory Structure

Create the project directory and required subdirectories:

```bash
# Create main project folder
mkdir claude-code-metrics-stack && cd claude-code-metrics-stack

# Create configuration directories
mkdir -p config/grafana/provisioning/datasources

# Create data directories for persistence
mkdir -p data/prometheus data/grafana

# Set permissions (Grafana and Prometheus run as specific users)
chmod -R 777 data/
```

Your directory structure should look like this:

```
claude-code-metrics-stack/
├── docker-compose.yml                    (to be created)
├── config/
│   ├── otel-collector-config.yaml        (to be created)
│   ├── prometheus.yml                    (to be created)
│   └── grafana/
│       └── provisioning/
│           └── datasources/
│               └── datasources.yml       (to be created)
└── data/
    ├── prometheus/                       (volume mount)
    └── grafana/                          (volume mount)
```

## Setup Part 2: OpenTelemetry Collector Configuration

Create the collector configuration file:

```bash
cat > config/otel-collector-config.yaml <<'EOF'
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
        cors:
          allowed_origins:
            - "*"

processors:
  batch:
    timeout: 10s
    send_batch_size: 1024

extensions:
  zpages:
    endpoint: 0.0.0.0:55679
  health_check:
    endpoint: 0.0.0.0:13133

exporters:
  prometheus:
    endpoint: 0.0.0.0:8889
    const_labels:
      source: otel-collector
  debug:
    verbosity: detailed

service:
  extensions: [zpages, health_check]
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus, debug]
EOF
```

**What this does:**

- **Receivers**: Accept OTLP data via gRPC (port 4317) and HTTP (port 4318) with CORS enabled
- **Processors**: Batch metrics (10-second timeout, max 1024 per batch) for efficient processing
- **Extensions**:
  - `zpages`: Debugging interface on port 55679
  - `health_check`: Health check endpoint on port 13133
- **Exporters**:
  - `prometheus`: Expose metrics on port 8889 for Prometheus to scrape with source label
  - `debug`: Log detailed information for troubleshooting
- **Service**: Enables extensions and routes metrics through receivers → processors → exporters

## Setup Part 3: Prometheus Configuration

Create the Prometheus configuration:

```bash
cat > config/prometheus.yml <<'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: []

rule_files: []

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
        labels:
          app: "prometheus"

  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:8889"]
        labels:
          app: "otel-collector"
          source: "claude-code-metrics"
    scrape_interval: 10s
    scrape_timeout: 5s
EOF
```

**Configuration details:**

- **Global interval**: 15 seconds between scrapes
- **Evaluation interval**: 15 seconds for rule evaluation
- **Alerting**: Empty alertmanagers config (can be configured later)
- **Rule files**: Empty (can add alerting rules later)
- **Scrape configs**:
  - Prometheus self-monitoring on localhost:9090
  - OpenTelemetry Collector on otel-collector:8889 with custom labels
  - 10-second scrape interval with 5-second timeout for collector

**Retention note**: Prometheus defaults to 15 days. The docker-compose.yml (next section) configures 90-day retention, balancing historical insight with disk efficiency. For longer retention, adjust to `--storage.tsdb.retention.time=365d` and add `--storage.tsdb.retention.size=50GB` to cap disk usage.

## Setup Part 4: Grafana Datasource Configuration

Create the Grafana datasource provisioning file:

```bash
cat > config/grafana/provisioning/datasources/datasources.yml <<'EOF'
apiVersion: 1

prune: false

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    uid: prometheus_claude_metrics
    url: http://prometheus:9090
    basicAuth: false
    editable: false
    isDefault: true
    jsonData:
      timeInterval: "10s"
      httpMethod: "POST"
EOF
```

**What this does:**

- **Auto-provisions** Prometheus as a datasource when Grafana starts
- **Prune**: Disabled to prevent auto-removal of manually added datasources
- **URL**: `http://prometheus:9090` (Docker service name)
- **Access mode**: `proxy` (Grafana server queries Prometheus, not the browser)
- **UID**: Unique identifier `prometheus_claude_metrics` for dashboard references
- **Editable**: Set to false to prevent accidental modification
- **Default**: Makes Prometheus the default datasource for new dashboards
- **Time interval**: Minimum query interval of 10 seconds
- **HTTP method**: Uses POST for queries (better for large queries)

## Setup Part 5: Docker Compose

Create the Docker Compose file that orchestrates all services:

```bash
cat > docker-compose.yml <<'EOF'
version: '3.8'

services:
  otel-collector:
    image: otel/opentelemetry-collector:0.99.0
    container_name: otel-collector
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./config/otel-collector-config.yaml:/etc/otel-collector-config.yaml:ro
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
      - "8889:8889"   # Prometheus scrape endpoint
      - "55679:55679" # zPages
      - "13133:13133" # Health check
    restart: unless-stopped
    networks:
      - claude-metrics-network

  prometheus:
    image: prom/prometheus:v3.8.0
    container_name: prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=90d"
      - "--web.console.libraries=/usr/share/prometheus/console_libraries"
      - "--web.console.templates=/usr/share/prometheus/consoles"
      - "--web.enable-lifecycle"
      - "--web.enable-remote-write-receiver"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./data/prometheus:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped
    depends_on:
      otel-collector:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:9090/-/healthy"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - claude-metrics-network

  grafana:
    image: grafana/grafana:12.3.0
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=http://localhost:3000
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-piechart-panel
    volumes:
      - ./config/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./data/grafana:/var/lib/grafana
    ports:
      - "3000:3000"
    restart: unless-stopped
    depends_on:
      prometheus:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - claude-metrics-network

networks:
  claude-metrics-network:
    driver: bridge
    name: claude-metrics-network
EOF
```

**Key configuration details:**

**OpenTelemetry Collector (v0.99.0):**
- Listens on ports 4317 (gRPC) and 4318 (HTTP) for Claude Code metrics
- Exposes Prometheus scrape endpoint on 8889
- zPages debugging interface on 55679
- Health check endpoint on 13133
- Read-only config mount for security

**Prometheus (v3.8.0):**
- 90-day data retention (`--storage.tsdb.retention.time=90d`)
- Persistent storage via `./data/prometheus` bind mount
- Lifecycle API enabled for configuration reloads
- Remote write receiver enabled for additional data sources
- Read-only config mount
- Health checks ensure readiness before Grafana starts

**Grafana (v12.3.0):**
- Default credentials: `admin` / `admin` (change immediately for non-local deployments)
- Auto-installs clock and pie chart panels
- Auto-provisions Prometheus datasource via read-only config
- Persistent storage for dashboards and settings
- Health check on `/api/health` endpoint

**Networking:**
- Dedicated bridge network `claude-metrics-network` isolates stack
- Services communicate via container names (otel-collector, prometheus, grafana)

**Dependencies:** Services start in order (collector → Prometheus → Grafana) with health checks ensuring readiness.

## Setup Part 6: Launch the Stack

Start all services:

```bash
# Launch containers in detached mode
docker compose up -d

# Watch logs from all services
docker compose logs -f
```

**Verify services are running:**

```bash
docker compose ps
```

You should see three containers with "Up" status.

**Test service health:**

- OpenTelemetry Collector health: `curl http://localhost:13133`
- Prometheus UI: Open `http://localhost:9090` in your browser
- Grafana UI: Open `http://localhost:3000` (login: admin/admin)

**Check logs for errors:**

```bash
# Collector logs
docker compose logs otel-collector

# Prometheus logs
docker compose logs prometheus

# Grafana logs
docker compose logs grafana
```

## Enable Claude Code Telemetry

Now that the monitoring stack is running, configure Claude Code to send metrics.

**Set environment variables** in your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# Enable telemetry
export CLAUDE_CODE_ENABLE_TELEMETRY=1

# Configure OTLP exporters
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp

# Set protocol and endpoint
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

**Why these settings:**

- `CLAUDE_CODE_ENABLE_TELEMETRY=1`: Explicitly enables telemetry (opt-in)
- `OTEL_METRICS_EXPORTER=otlp`: Use OpenTelemetry Protocol for metrics
- `OTEL_LOGS_EXPORTER=otlp`: Use OTLP for events/logs
- `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`: Use HTTP protocol (port 4318)
- `OTEL_EXPORTER_OTLP_ENDPOINT`: Collector's HTTP endpoint

**Alternative: gRPC protocol**

If you prefer gRPC (port 4317):

```bash
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

**Apply configuration:**

```bash
# Reload shell configuration
source ~/.bashrc  # or source ~/.zshrc

# Verify variables are set
env | grep OTEL
env | grep CLAUDE_CODE_ENABLE_TELEMETRY
```

**Important:** Environment variables are only read when Claude Code starts. Restart any running Claude Code sessions for changes to take effect.

**Export intervals:**

- **Metrics**: Exported every 60 seconds (default)
- **Events/Logs**: Exported every 5 seconds (default)

To customize:

```bash
export OTEL_METRIC_EXPORT_INTERVAL=30000  # 30 seconds
export OTEL_LOGS_EXPORT_INTERVAL=10000    # 10 seconds
```

**Cardinality control** (optional):

Control which attributes are included to manage cardinality:

```bash
# Include session ID (default: true)
export OTEL_METRICS_INCLUDE_SESSION_ID=true

# Include app version (default: false)
export OTEL_METRICS_INCLUDE_VERSION=false

# Include account UUID (default: true)
export OTEL_METRICS_INCLUDE_ACCOUNT_UUID=true
```

**Custom resource attributes** (optional):

Add custom labels for filtering and grouping:

```bash
export OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123"
```

Note: Follows W3C Baggage spec—no spaces in values, use percent-encoding for special characters.

## Import Grafana Dashboard

With telemetry enabled and data flowing, set up the Grafana dashboard.

### Access Grafana

1. Open `http://localhost:3000` in your browser
2. Login with default credentials: `admin` / `admin`
3. Change the password when prompted (or skip for local testing)

### Import Dashboard from JSON

A community member created a comprehensive Claude Code dashboard. Import it:

1. **Get the dashboard JSON**: Visit [https://gist.github.com/mikelane/f6c3a175cd9f92410aba06b5ac24ba54](https://gist.github.com/mikelane/f6c3a175cd9f92410aba06b5ac24ba54)

2. **Copy the raw JSON** from the gist

3. **In Grafana**:
   - Click **Dashboards** in left sidebar
   - Click **New** → **Import**
   - Paste the JSON in the "Import via panel json" box
   - Click **Load**
   - Select **Prometheus** as the datasource
   - Click **Import**

### Dashboard Panels

The imported dashboard includes these visualizations:

**Usage Statistics:**
- Total sessions tracked
- Total commits made via Claude Code
- Lines of code accepted from suggestions

**Token Analysis:**
- Input tokens consumed
- Output tokens consumed
- Cache read tokens (with notation: "saves money!")
- Cache creation tokens
- Token distribution by type (pie chart)
- Token usage by model over time

**Cost Monitoring:**
- Total API expenditure in USD
- Cost per 1,000 output tokens
- Cost breakdown by model (bar gauge)
- Cost accumulation trends (time-series)

**Productivity Metrics:**
- Active time for CLI vs. user interaction (time-series)
- Productivity Ratio (CLI time divided by user time)
- Peak leverage measurement
- Activity patterns comparing CLI and user engagement

**Visualizations:**
- Time-series charts with 5-minute intervals
- Pie charts for distribution analysis
- Bar gauges for comparative metrics
- Cache efficiency percentage gauge

**Dashboard settings:**
- Default timeframe: 1 hour
- Auto-refresh enabled
- Tags: claude, productivity, ai, development

### Wait for Data

After starting your first Claude Code session with telemetry enabled, wait 60-90 seconds for initial data export. Refresh the dashboard to see metrics appear.

## Understanding the Metrics

Here's what each metric tells you:

### Session Metrics

**`claude_code.session.count`**
- **What it measures**: Number of CLI sessions started
- **Why it matters**: Track adoption and usage frequency
- **Example query**: `rate(claude_code_session_count_total[5m])` - Sessions per second over 5 minutes

### Token Metrics

**`claude_code.token.usage`**
- **What it measures**: Tokens consumed (input, output, cache read, cache creation)
- **Why it matters**: Understand API consumption and identify optimization opportunities
- **Attributes**: Model, token type (input/output/cacheRead/cacheCreation)
- **Cache savings note**: Cache read tokens are cheaper than input tokens—high cache read percentages reduce costs

**Token types:**
- **Input tokens**: User prompts and context sent to the API
- **Output tokens**: Model responses (most expensive)
- **Cache read tokens**: Reused cached context (saves money!)
- **Cache creation tokens**: Initial cache population

### Cost Metrics

**`claude_code.cost.usage`**
- **What it measures**: Estimated session cost in USD
- **Why it matters**: Budget tracking and ROI calculation
- **Attributes**: Model (different models have different pricing)
- **Dashboard calculation**: Cost per 1,000 output tokens for efficiency comparison

### Productivity Metrics

**`claude_code.lines_of_code.count`**
- **What it measures**: Lines added/removed via Claude Code
- **Why it matters**: Quantify output and code changes
- **Use case**: Calculate lines of code per session or per hour

**`claude_code.commit.count`**
- **What it measures**: Git commits created via Claude Code
- **Why it matters**: Track completed work units
- **Combined metric**: Commits per session = quality indicator

**`claude_code.pull_request.count`**
- **What it measures**: PRs created via Claude Code
- **Why it matters**: Measure feature/fix delivery rate

**`claude_code.active_time.total`**
- **What it measures**: Total active time in seconds
- **Why it matters**: Track actual usage time and calculate productivity metrics
- **Dashboard usage**: The Grafana dashboard uses this to calculate productivity ratios and compare activity patterns

### Tool Decision Metrics

**`claude_code.code_edit_tool.decision`**
- **What it measures**: Code editing tool permission decisions (accept/reject)
- **Why it matters**: Understand friction points in workflow
- **Attributes**: Tool (Edit, Write, NotebookEdit), decision (accept/reject), language (programming language), source

## Verification & Troubleshooting

### Check Data is Flowing

**1. Verify Claude Code is sending metrics:**

Start a Claude Code session and run a simple task (e.g., ask a question). Wait 60 seconds for the export interval.

**2. Check OpenTelemetry Collector logs:**

```bash
docker compose logs otel-collector | grep -i metrics
```

You should see log entries about received metrics.

**3. Query Prometheus directly:**

Open `http://localhost:9090`, go to **Graph**, and query:

```promql
claude_code_session_count_total
```

If working, you'll see data points. If empty, metrics aren't reaching Prometheus.

**4. Check Grafana:**

Open your dashboard. If panels show "No data," investigate using steps below.

### Common Issues

#### Issue 1: "No Data" in Dashboard

**Symptoms**: Grafana panels display "No data" despite Claude Code sessions running.

**Causes & Solutions:**

1. **Environment variables not loaded**
   - **Check**: `env | grep OTEL` in the terminal where you run Claude Code
   - **Fix**: Reload shell config (`source ~/.bashrc`) and restart Claude Code

2. **Claude Code not restarted**
   - **Issue**: Environment variables are only read at launch
   - **Fix**: Exit all Claude Code sessions and start fresh

3. **Export interval not elapsed**
   - **Wait**: 60-90 seconds for initial metrics export
   - **Check**: Run a longer Claude Code session (2+ minutes)

4. **Wrong protocol or endpoint**
   - **Check**: Verify `OTEL_EXPORTER_OTLP_ENDPOINT` matches the protocol
     - HTTP: `http://localhost:4318`
     - gRPC: `http://localhost:4317`
   - **Test endpoint**: `curl -v http://localhost:4318/v1/metrics`

5. **Collector not receiving data**
   - **Check logs**: `docker compose logs otel-collector | grep -i error`
   - **Common error**: Protocol mismatch (gRPC endpoint with HTTP protocol)

#### Issue 2: Connection Refused

**Symptoms**: "Connection refused" errors in Claude Code or collector logs.

**Causes & Solutions:**

1. **Services not running**
   - **Check**: `docker compose ps` shows all services "Up"
   - **Fix**: `docker compose up -d`

2. **Port conflicts**
   - **Check**: `netstat -an | grep 4318` or `lsof -i :4318`
   - **Fix**: Stop conflicting service or change port in docker-compose.yml

3. **Firewall blocking**
   - **Check**: Test with `curl http://localhost:4318`
   - **Fix**: Allow ports 3000, 4317, 4318, 8889, 9090 in firewall

4. **Wrong endpoint in environment variables**
   - **Inside Docker**: Container names work (`http://otel-collector:4318`)
   - **Outside Docker (Claude Code)**: Use `localhost` (`http://localhost:4318`)

#### Issue 3: Prometheus Not Scraping

**Symptoms**: Prometheus shows "No data" but collector logs show metrics received.

**Causes & Solutions:**

1. **Scrape target down**
   - **Check**: Open `http://localhost:9090/targets`
   - **Look for**: `otel-collector` target status (should be "UP")
   - **Fix**: If "DOWN," check collector health: `curl http://localhost:13133`

2. **Wrong target configuration**
   - **Check**: `config/prometheus.yml` has `targets: ["otel-collector:8889"]`
   - **Fix**: Restart Prometheus: `docker compose restart prometheus`

3. **Collector not exposing Prometheus endpoint**
   - **Test**: `curl http://localhost:8889/metrics`
   - **Fix**: Verify `config/otel-collector-config.yaml` has prometheus exporter on 8889

#### Issue 4: High Memory Usage

**Symptoms**: Prometheus or collector consuming excessive memory.

**Causes & Solutions:**

1. **Too many metrics/high cardinality**
   - **Reduce session IDs**: `export OTEL_METRICS_INCLUDE_SESSION_ID=false`
   - **Disable version**: `export OTEL_METRICS_INCLUDE_VERSION=false`

2. **Long retention period**
   - **Adjust**: Change `--storage.tsdb.retention.time=90d` to `30d` in docker-compose.yml
   - **Cap size**: Add `--storage.tsdb.retention.size=50GB`

3. **Batch size too large**
   - **Edit**: `config/otel-collector-config.yaml` → reduce `send_batch_size` from 1024 to 512

### Debugging Tips

**Enable debug logging in collector:**

Add to `config/otel-collector-config.yaml` under `exporters`:

```yaml
exporters:
  debug:
    verbosity: detailed
```

Restart collector: `docker compose restart otel-collector`

**Query raw Prometheus metrics:**

```bash
# See all Claude Code metrics
curl http://localhost:9090/api/v1/label/__name__/values | grep claude_code

# Query specific metric
curl 'http://localhost:9090/api/v1/query?query=claude_code_session_count_total'
```

**Test OTLP endpoint manually:**

```bash
# HTTP endpoint
curl -v -X POST http://localhost:4318/v1/metrics \
  -H "Content-Type: application/x-protobuf"

# Should return 200 or 400 (not connection refused)
```

**Check Grafana datasource:**

1. Go to **Configuration** → **Data Sources** → **Prometheus**
2. Click **Save & Test**
3. Should show green "Data source is working"

## Production Considerations

If deploying this stack beyond local development, consider these best practices:

### Security

**Change default credentials immediately:**

Edit `docker-compose.yml` before first deployment:

```yaml
grafana:
  environment:
    - GF_SECURITY_ADMIN_USER=your-admin-user
    - GF_SECURITY_ADMIN_PASSWORD=your-secure-password
```

**Use environment variables for secrets:**

```yaml
grafana:
  environment:
    - GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER}
    - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
```

Create `.env` file (add to `.gitignore`):

```
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=secure-password-here
```

**Secure endpoints:**

- Don't expose ports publicly without authentication
- Use reverse proxy (nginx, Traefik) with HTTPS
- Enable Grafana auth (LDAP, OAuth, SAML) for teams

**Authentication for OTLP endpoint:**

If deploying the collector remotely, add authentication headers:

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer your-token-here"
```

Configure collector to validate tokens.

### Data Persistence

**Use named volumes instead of bind mounts** for better Docker management:

```yaml
volumes:
  prometheus_data:
  grafana_data:

services:
  prometheus:
    volumes:
      - prometheus_data:/prometheus
  grafana:
    volumes:
      - grafana_data:/var/lib/grafana
```

**Backup Grafana dashboards:**

```bash
# Export dashboard JSON
curl -u admin:password http://localhost:3000/api/dashboards/db/claude-code-metrics \
  > dashboard-backup.json
```

**Backup Prometheus data:**

Enable admin API in docker-compose.yml:

```yaml
prometheus:
  command:
    - '--web.enable-admin-api'
```

Create snapshot:

```bash
curl -X POST http://localhost:9090/api/v1/admin/tsdb/snapshot?skip_head=false
```

### Resource Limits

Adjust based on usage:

**For teams (5-10 users):**

```yaml
otel-collector:
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 1G

prometheus:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 4G
```

**Query performance tuning:**

Add to Prometheus command:

```yaml
prometheus:
  command:
    - '--query.timeout=2m'
    - '--query.max-concurrency=20'
```

### Monitoring the Monitoring Stack

Add health check endpoints to your monitoring:

```bash
# Check all services
docker compose ps

# Memory and CPU usage
docker stats

# Prometheus health
curl http://localhost:9090/-/healthy

# Collector health
curl http://localhost:13133
```

**Set up alerts** for stack health (Prometheus down, disk full, high memory).

### Enterprise Configuration

For organization-wide deployment, use administrator configuration via managed settings:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.company.com:4317",
    "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer company-token"
  }
}
```

Distribute via MDM with high precedence (users cannot override).

**Dynamic authentication** for token refresh:

```json
{
  "otelHeadersHelper": "/bin/generate_opentelemetry_headers.sh"
}
```

Script outputs valid JSON:

```bash
#!/bin/bash
echo "{\"Authorization\": \"Bearer $(get-token.sh)\", \"X-API-Key\": \"$(get-api-key.sh)\"}"
```

**Limitation**: Headers fetched at startup only. Use OpenTelemetry Collector as proxy for frequent refresh scenarios.

## What You've Built

You now have a complete monitoring stack tracking:

- **Usage patterns**: Sessions, commits, PRs, lines of code
- **Token consumption**: Input, output, cache reads, cache creation
- **Cost tracking**: Total spend and per-model breakdown
- **Productivity metrics**: CLI time vs. user time, leverage ratios
- **Tool decisions**: What gets accepted or rejected

The stack runs entirely in Docker with persistent storage, health checks, and production-ready configurations.

**Next steps:**

1. **Set up alerts**: Configure Grafana alerts for budget thresholds, unusual token spikes, or errors
2. **Customize dashboards**: Add panels for team-specific metrics or custom attributes
3. **Analyze patterns**: Use data to optimize workflows, model selection, and caching strategies
4. **Calculate ROI**: Compare Claude Code costs against productivity gains (commits/hour, lines/hour)

## Resources

**Official Documentation:**
- [Claude Code Monitoring Guide](https://code.claude.com/docs/en/monitoring-usage)
- [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification)

**Community Resources:**
- [Grafana Dashboard JSON](https://gist.github.com/mikelane/f6c3a175cd9f92410aba06b5ac24ba54)
- [Docker Setup Guide](https://sealos.io/blog/claude-code-metrics)

**Additional Guides:**
- [Claude Code ROI Measurement Templates](https://github.com/anthropics/claude-code-monitoring-guide) (Docker, Prometheus, reporting templates)
- [Claude Code Monitoring on Amazon Bedrock](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock/blob/main/assets/docs/MONITORING.md)

---

**Questions or issues?** Share feedback in the [Claude Code GitHub discussions](https://github.com/anthropics/claude-code/discussions).
