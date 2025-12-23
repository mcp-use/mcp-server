# mcp-use MCP Server & Claude Code Plugin

mcp-use MCP server helps Agents build mcp servers by providing tools and prompts for common paterns and best practices.
Availble as http mcp server or Claude Skill

## 🚀 Quick Install

### MCP Server (Works with All Clients)

**One-Click Install:**

[![Add to Cursor](https://img.shields.io/badge/Add%20to-Cursor-blue?style=for-the-badge)](cursor://anysphere.cursor-deeplink/mcp/install?config=eyJ1cmwiOiJodHRwczovL21jcC11c2UuY29tL21jcCIsImhlYWRlcnMiOnt9fQ%3D%3D&name=mcp-use)
[![Add to VS Code](https://img.shields.io/badge/Add%20to-VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code)](vscode:mcp/install?%7B%22url%22%3A%22https%3A%2F%2Fmcp-use.com%2Fmcp%22%2C%22name%22%3A%22mcp-use%22%2C%22type%22%3A%22http%22%7D)

**Claude Code CLI:**

```bash
claude mcp add --transport http "mcp-use" "https://mcp-use.com/mcp"
```

**Gemini CLI:**

```bash
gemini mcp add --transport http "mcp-use" "https://mcp-use.com/mcp"
```

**Codex CLI:**

Add to your `~/.codex/config.toml`:

```toml
[mcp_servers.mcp-use]
url = "https://mcp-use.com/mcp"
```

### Claude Code Skill/Plugin

The mcp-use plugin includes a Skill that helps you build MCP servers directly in Claude Code.

**Install via plugin marketplace:**

```bash
/plugin marketplace add mcp-use/mcp-skill
/plugin install mcp-use@marketplace
```

**Or use the project-level Skill:**

The Skill is automatically available when working in this repository at `.claude/skills/mcp-server-builder/`.

```bash
curl -o ./skills/mcp-skill.md https://raw.githubusercontent.com/mcp-use/mcp-use-server/
```

/_ Downloads the mcp-skill directly into the ./skills directory _/

---

## 📦 What's Included

### MCP Server Features

The mcp-use MCP server provides:

#### 🛠️ **Tools**

- `run-server` - Instructions for running MCP servers locally (dev/production modes, tunneling)
- `deploy-server` - Deployment guidance with authentication troubleshooting

#### 📚 **Resources**

- `mcp-use://examples/tools` - Complete tool examples with Zod validation and widgets
- `mcp-use://examples/resources` - Resource examples (static, dynamic, templates)
- `mcp-use://examples/prompts` - Parameterized prompt templates
- `mcp-use://examples/widgets` - Apps SDK widget creation
- `mcp-use://examples/complete-server` - Full working server combining all primitives

#### 💬 **Prompt**

- `how-to-create-mcp-server` - Comprehensive step-by-step guide covering:
  - Bootstrapping with `npx create-mcp-use-app`
  - Template selection (starter, apps-sdk, mcp-ui)
  - Defining tools, resources, and prompts
  - Testing with inspector and tunneling
  - Deployment to mcp-use cloud
  - Best practices and common patterns

---

## 🔧 Local Development (This Server)

This is a working MCP server built with mcp-use. You can run it locally to test or modify.

**Install dependencies:**

```bash
yarn install
```

**Development mode (hot reload):**

```bash
yarn dev
```

**Production mode:**

```bash
yarn build
yarn start
```

**Inspector UI:**

Access at `http://localhost:3000/inspector` to:

- Test the "how-to-create-mcp-server" prompt
- View all example resources
- Try the run-server and deploy-server tools

**Test with tunneling:**

```bash
# Option 1: Auto-tunnel
mcp-use start --port 3000 --tunnel

# Option 2: Separate tunnel
yarn start                    # Terminal 1
npx @mcp-use/tunnel 3000      # Terminal 2
```

---

## 📖 Documentation & Resources

- **mcp-use Documentation**: https://docs.mcp-use.com
- **Examples**: https://github.com/mcp-use/mcp-use/tree/main/examples
- **Tunneling Guide**: https://mcp-use.com/docs/tunneling
- **Discord Community**: https://mcp-use.com/discord
- **GitHub Repository**: https://github.com/mcp-use/mcp-use

---

## 🏗️ Project Structure

```
mcp-use/
├── .claude-plugin/
│   └── plugin.json          # Claude Code plugin manifest
├── skills/                   # Claude Code Skills
│   └── mcp-server-builder/
│       └── SKILL.md         # Comprehensive MCP server building guide
├── resources/                # Apps SDK widget components
│   └── product-search-result/
├── public/                   # Static assets
│   └── fruits/
├── index.ts                  # MCP server implementation
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                # This file
```

---

## 📝 License

MIT

---

## 🔗 Connect

- **Website**: https://mcp-use.com
- **Documentation**: https://docs.mcp-use.com
- **GitHub**: https://github.com/mcp-use/mcp-use
- **Discord**: https://mcp-use.com/discord

---

Built with ❤️ using [mcp-use](https://mcp-use.com) - The modern framework for building MCP servers.
