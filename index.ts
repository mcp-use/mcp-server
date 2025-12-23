import { markdown, MCPServer, text } from "mcp-use/server";
import { z } from "zod";

/**
 * mcp-use MCP Server
 * 
 * A comprehensive guide to building MCP servers with mcp-use.
 * This server provides:
 * - A detailed prompt with step-by-step instructions for creating MCP servers
 * - Resources demonstrating each MCP primitive (tools, resources, prompts, widgets)
 * - Utility tools for running and deploying MCP servers
 */
const server = new MCPServer({
  name: "mcp-use",
  version: "1.0.0",
  description: "helps Agents build mcp servers by providing tools and prompts for common paterns and best practices. Availble as http mcp server or Claude Skill",
  baseUrl: process.env.MCP_URL || "http://localhost:3000",
});

// ============================================================================
// PROMPT: How to Create an MCP Server
// ============================================================================

server.prompt(
  {
    name: "how-to-create-mcp-server",
    description: "Comprehensive step-by-step guide for creating an MCP server with mcp-use",
  },
  async () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `# How to Create an MCP Server with mcp-use

## Step 1: Bootstrap Your Project

**Always use \`npx create-mcp-use-app\` to bootstrap your MCP server project:**

\`\`\`bash
npx create-mcp-use-app my-mcp-server
cd my-mcp-server
\`\`\`

### Available Templates:
- **starter** - Basic MCP server with simple tools and resources
- **apps-sdk** - MCP server with OpenAI Apps SDK widget support (recommended for interactive UIs)
- **mcp-ui** - MCP server with MCP-UI framework support

Choose the template based on your needs:
\`\`\`bash
npx create-mcp-use-app my-mcp-server --template apps-sdk
\`\`\`

## Step 2: Project Structure

After scaffolding, your project will have this structure:

\`\`\`
my-mcp-server/
├── resources/           # React widget components (apps-sdk template)
│   └── example-widget.tsx
├── public/             # Static assets
├── index.ts            # Server entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md
\`\`\`

## Step 3: Define Tools

Tools are functions that the AI model can call to perform actions. Use Zod for schema validation:

\`\`\`typescript
import { MCPServer, text } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "my-server",
  version: "1.0.0",
  description: "My awesome MCP server"
});

// Simple tool
server.tool(
  {
    name: "greet-user",
    description: "Greets a user by name",
    schema: z.object({
      name: z.string().describe("The user's name"),
      formal: z.boolean().optional().describe("Use formal greeting")
    })
  },
  async ({ name, formal }) => {
    const greeting = formal ? \`Good day, \${name}\` : \`Hey \${name}!\`;
    return text(greeting);
  }
);
\`\`\`

## Step 4: Create Resources

Resources expose data that clients can read. They can be static or dynamic:

\`\`\`typescript
import { object, text, markdown } from "mcp-use/server";

// Static resource
server.resource(
  {
    uri: "config://settings",
    name: "Application Settings",
    description: "Current application configuration",
    mimeType: "application/json"
  },
  async () => {
    return object({
      theme: "dark",
      language: "en",
      version: "1.0.0"
    });
  }
);

// Dynamic resource with response helpers
server.resource(
  {
    uri: "docs://guide",
    name: "User Guide",
    description: "Complete user documentation",
    mimeType: "text/markdown"
  },
  async () => {
    return markdown(\`# User Guide\\n\\nWelcome to our app!\`);
  }
);
\`\`\`

### Response Helpers:
- \`text(string)\` - Plain text
- \`object(data)\` - JSON objects
- \`markdown(string)\` - Markdown content
- \`html(string)\` - HTML content
- \`image(buffer, mimeType)\` - Binary images

## Step 5: Add Prompts

Prompts are reusable templates for AI interactions:

\`\`\`typescript
server.prompt(
  {
    name: "code-review",
    description: "Generate a code review template",
    schema: z.object({
      language: z.string().describe("Programming language"),
      focusArea: z.string().optional().describe("Specific area to focus on")
    })
  },
  async ({ language, focusArea }) => {
    const focus = focusArea ? \` with focus on \${focusArea}\` : "";
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: \`Please review this \${language} code\${focus}. Check for:\\n- Code quality\\n- Best practices\\n- Potential bugs\\n- Performance issues\`
          }
        }
      ]
    };
  }
);
\`\`\`

## Step 6: Build and Run Locally

Use the provided npm/yarn scripts (user prefers yarn):

\`\`\`bash
# Development mode with hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start
\`\`\`

The server will run on port 3000 by default.

## Step 7: Test with Inspector

Access the built-in inspector UI at \`http://localhost:3000/inspector\` to:
- Test your tools interactively
- View available resources
- Try out prompts
- Debug responses

## Step 8: Test Locally with Tunneling (Before Deployment)

Before deploying, test your MCP server with ChatGPT or other MCP clients using tunneling:

### Option 1: Auto-tunnel (Easiest)
\`\`\`bash
mcp-use start --port 3000 --tunnel
\`\`\`

### Option 2: Separate tunnel
\`\`\`bash
# Terminal 1: Start your server
yarn start

# Terminal 2: Create tunnel
npx @mcp-use/tunnel 3000
\`\`\`

You'll get a public URL like:
\`\`\`
🌐 Public URL: https://happy-blue-cat.local.mcp-use.run/mcp
\`\`\`

**Important tunnel details:**
- Tunnels expire after **24 hours** of creation
- Inactive tunnels close after **1 hour** of inactivity
- Rate limit: 10 tunnel creations per IP per hour
- Maximum 5 active tunnels per IP

Use this URL to test with ChatGPT or other MCP clients before deploying.

**Learn more:** https://mcp-use.com/docs/tunneling

## Step 9: Deploy Your Server

### Option 1: Deploy to mcp-use Cloud (Recommended)

\`\`\`bash
yarn deploy
\`\`\`

**If deploy fails with authentication error:**
\`\`\`bash
npx mcp-use login
# Then try deploy again
yarn deploy
\`\`\`

### Option 2: Deploy to Supabase

See the deployment guide for other platforms at https://docs.mcp-use.com

## Step 10: Best Practices

1. **Use Zod schemas** for type-safe parameter validation
2. **Add descriptive names and descriptions** to help the AI understand your tools
3. **Handle errors gracefully** and return helpful error messages
4. **Use response helpers** (text, object, markdown) for cleaner code
5. **Test thoroughly** with the inspector before deploying
6. **Use tunneling** to test with real clients (ChatGPT) before deployment
7. **Version your server** and use semantic versioning
8. **Document your tools** with clear descriptions of inputs and outputs
9. **Keep tools focused** - one tool should do one thing well
10. **Use appropriate MIME types** for resources

## Widgets (Apps SDK Template)

If you used the apps-sdk template, widgets are automatically registered:

\`\`\`typescript
// resources/weather-widget.tsx
export const widgetMetadata = {
  description: "Display weather information",
  schema: z.object({
    city: z.string(),
    temperature: z.number()
  })
};

export default function WeatherWidget({ city, temperature }) {
  return (
    <div>
      <h2>{city}</h2>
      <p>{temperature}°C</p>
    </div>
  );
}
\`\`\`

The widget automatically becomes available as a tool and resource!

## Learn More

- Documentation: https://docs.mcp-use.com
- Examples: https://github.com/mcp-use/mcp-use/tree/main/examples
- Discord: https://mcp-use.com/discord
- GitHub: https://github.com/mcp-use/mcp-use

Happy building! 🚀`,
          },
        },
      ],
    };
  }
);

// ============================================================================
// RESOURCES: MCP Primitive Examples
// ============================================================================

// Resource 1: Tools Example
server.resource(
  {
    uri: "mcp-use://examples/tools",
    name: "Tools Example",
    description: "Complete example of defining tools in an MCP server",
    mimeType: "text/markdown",
  },
  async () => {
    return markdown(`# Tools Example

Tools are executable functions that MCP servers expose to AI models.

## Basic Tool

\`\`\`typescript
import { MCPServer, text } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "example-server",
  version: "1.0.0"
});

server.tool(
  {
    name: "calculate-sum",
    description: "Calculate the sum of two numbers",
    schema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number")
    })
  },
  async ({ a, b }) => {
    return text(\`The sum is \${a + b}\`);
  }
);
\`\`\`

## Tool with Validation

\`\`\`typescript
server.tool(
  {
    name: "create-user",
    description: "Create a new user account",
    schema: z.object({
      email: z.string().email().describe("User email address"),
      age: z.number().min(18).max(120).describe("User age (18-120)"),
      role: z.enum(["admin", "user", "guest"]).describe("User role")
    })
  },
  async ({ email, age, role }) => {
    try {
      // Validation is automatic via Zod
      const user = { id: Math.random(), email, age, role };
      return object({
        success: true,
        user
      });
    } catch (error) {
      return text(\`Error: \${error.message}\`);
    }
  }
);
\`\`\`

## Tool with Widget (Apps SDK)

\`\`\`typescript
server.tool(
  {
    name: "show-weather",
    description: "Display weather information for a city",
    schema: z.object({
      city: z.string().describe("City name")
    }),
    widget: {
      name: "weather-display",  // Matches resources/weather-display.tsx
      invoking: "Fetching weather...",
      invoked: "Weather loaded"
    }
  },
  async ({ city }) => {
    const weatherData = await fetchWeather(city);
    
    return widget({
      props: {
        city,
        temperature: weatherData.temp,
        condition: weatherData.condition
      },
      output: text(\`Weather in \${city}: \${weatherData.temp}°C\`)
    });
  }
);
\`\`\`

## Error Handling

\`\`\`typescript
server.tool(
  {
    name: "divide-numbers",
    description: "Divide two numbers",
    schema: z.object({
      dividend: z.number(),
      divisor: z.number()
    })
  },
  async ({ dividend, divisor }) => {
    if (divisor === 0) {
      return text("Error: Cannot divide by zero");
    }
    return text(\`Result: \${dividend / divisor}\`);
  }
);
\`\`\`

## Key Points

- Use **descriptive names** for tools and parameters
- Add **.describe()** to all Zod schema fields
- Return appropriate response types (text, object, widget)
- Handle errors gracefully
- Keep tools focused on a single task
`);
  }
);

// Resource 2: Resources Example
server.resource(
  {
    uri: "mcp-use://examples/resources",
    name: "Resources Example",
    description: "Complete example of defining resources in an MCP server",
    mimeType: "text/markdown",
  },
  async () => {
    return markdown(`# Resources Example

Resources expose data that clients can read. They can be static or dynamic.

## Static Resource

\`\`\`typescript
import { object, text, markdown } from "mcp-use/server";

server.resource(
  {
    uri: "app://config",
    name: "Application Config",
    description: "Application configuration settings",
    mimeType: "application/json"
  },
  async () => {
    return object({
      version: "1.0.0",
      environment: "production",
      features: {
        darkMode: true,
        analytics: false
      }
    });
  }
);
\`\`\`

## Dynamic Resource

\`\`\`typescript
server.resource(
  {
    uri: "stats://current",
    name: "Current Statistics",
    description: "Real-time system statistics",
    mimeType: "application/json"
  },
  async () => {
    const stats = await getSystemStats();
    return object({
      timestamp: new Date().toISOString(),
      cpu: stats.cpuUsage,
      memory: stats.memoryUsage,
      activeUsers: stats.activeUsers
    });
  }
);
\`\`\`

## Resource with Markdown

\`\`\`typescript
server.resource(
  {
    uri: "docs://api-guide",
    name: "API Documentation",
    description: "Complete API reference guide",
    mimeType: "text/markdown"
  },
  async () => {
    return markdown(\`
# API Documentation

## Authentication
All API requests require authentication...

## Endpoints
- GET /api/users - List all users
- POST /api/users - Create a new user
    \`);
  }
);
\`\`\`

## Resource Template (Parameterized)

\`\`\`typescript
server.resourceTemplate(
  {
    uriTemplate: "user://{userId}/profile",
    name: "User Profile",
    description: "Get user profile by ID",
    mimeType: "application/json"
  },
  async ({ userId }) => {
    const user = await fetchUser(userId);
    return object({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  }
);
\`\`\`

## Response Helpers

Available helpers for different content types:

\`\`\`typescript
import {
  text,      // Plain text
  object,    // JSON objects
  array,     // JSON arrays
  markdown,  // Markdown content
  html,      // HTML content
  xml,       // XML content
  css,       // CSS stylesheets
  javascript, // JavaScript code
  image,     // Binary images
  audio,     // Audio files
  binary,    // Raw binary data
  mix        // Multiple content types
} from "mcp-use/server";

// Text
return text("Hello, World!");

// Object
return object({ name: "John", age: 30 });

// Array
return array([1, 2, 3, 4, 5]);

// Markdown
return markdown("# Title\\n\\nContent here");

// HTML
return html("<h1>Hello</h1><p>World</p>");

// Image
const imageBuffer = await fs.readFile("image.png");
return image(imageBuffer, "image/png");
\`\`\`

## Key Points

- Use **clear URI schemes** (e.g., config://, docs://, user://)
- Choose **appropriate MIME types**
- Use **response helpers** for cleaner code
- Resources can be **dynamic** and fetch real-time data
- Use **resource templates** for parameterized URIs
`);
  }
);

// Resource 3: Prompts Example
server.resource(
  {
    uri: "mcp-use://examples/prompts",
    name: "Prompts Example",
    description: "Complete example of defining prompts in an MCP server",
    mimeType: "text/markdown",
  },
  async () => {
    return markdown(`# Prompts Example

Prompts are reusable templates for AI model interactions.

## Simple Prompt

\`\`\`typescript
server.prompt(
  {
    name: "introduction",
    description: "Generate a friendly introduction"
  },
  async () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Introduce yourself as a helpful AI assistant"
          }
        }
      ]
    };
  }
);
\`\`\`

## Parameterized Prompt

\`\`\`typescript
server.prompt(
  {
    name: "code-review",
    description: "Generate a code review prompt",
    schema: z.object({
      language: z.string().describe("Programming language"),
      focusArea: z.string().optional().describe("What to focus on")
    })
  },
  async ({ language, focusArea }) => {
    const focus = focusArea ? \` Pay special attention to \${focusArea}.\` : "";
    
    return {
      messages: [
        {
          role: "system",
          content: {
            type: "text",
            text: \`You are an expert \${language} developer.\`
          }
        },
        {
          role: "user",
          content: {
            type: "text",
            text: \`Please review this code for quality, best practices, and bugs.\${focus}\`
          }
        }
      ]
    };
  }
);
\`\`\`

## Multi-Message Prompt

\`\`\`typescript
server.prompt(
  {
    name: "brainstorm-session",
    description: "Start a brainstorming session",
    schema: z.object({
      topic: z.string().describe("Topic to brainstorm about"),
      constraints: z.array(z.string()).optional().describe("Any constraints")
    })
  },
  async ({ topic, constraints = [] }) => {
    const constraintText = constraints.length 
      ? \`\\n\\nConstraints:\\n\${constraints.map(c => \`- \${c}\`).join('\\n')}\`
      : "";
    
    return {
      messages: [
        {
          role: "system",
          content: {
            type: "text",
            text: "You are a creative thinking partner who helps generate innovative ideas."
          }
        },
        {
          role: "user",
          content: {
            type: "text",
            text: \`Let's brainstorm ideas about: \${topic}\${constraintText}\`
          }
        },
        {
          role: "assistant",
          content: {
            type: "text",
            text: "I'd be happy to help brainstorm! Let me generate some initial ideas..."
          }
        }
      ]
    };
  }
);
\`\`\`

## Prompt with Context

\`\`\`typescript
server.prompt(
  {
    name: "bug-report",
    description: "Create a structured bug report",
    schema: z.object({
      component: z.string().describe("Component or feature name"),
      severity: z.enum(["low", "medium", "high", "critical"])
    })
  },
  async ({ component, severity }) => {
    return {
      messages: [
        {
          role: "system",
          content: {
            type: "text",
            text: "You are a QA engineer creating detailed bug reports."
          }
        },
        {
          role: "user",
          content: {
            type: "text",
            text: \`Create a bug report for \${component} with \${severity} severity.

Include:
1. Title (brief description)
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details
6. Additional context\`
          }
        }
      ]
    };
  }
);
\`\`\`

## Key Points

- Prompts return **message arrays** with roles (system, user, assistant)
- Use **system messages** to set context and persona
- **Parameterize** prompts with Zod schemas for flexibility
- Keep prompts **reusable** across different contexts
- Include **clear instructions** in the prompt text
`);
  }
);

// Resource 4: Widgets Example
server.resource(
  {
    uri: "mcp-use://examples/widgets",
    name: "Widgets Example",
    description: "Complete example of creating widgets with OpenAI Apps SDK",
    mimeType: "text/markdown",
  },
  async () => {
    return markdown(`# Widgets Example (Apps SDK)

Widgets are interactive React components that enhance your MCP tools.

## Widget File Structure

Create widget files in the \`resources/\` folder:

\`\`\`
my-server/
├── resources/
│   ├── weather-display.tsx    # Widget component
│   └── styles.css             # Shared styles
└── index.ts
\`\`\`

## Simple Widget

\`\`\`typescript
// resources/weather-display.tsx
import { z } from "zod";

export const widgetMetadata = {
  description: "Display weather information",
  schema: z.object({
    city: z.string(),
    temperature: z.number(),
    condition: z.string()
  })
};

type Props = z.infer<typeof widgetMetadata.schema>;

export default function WeatherDisplay({ city, temperature, condition }: Props) {
  return (
    <div className="weather-card">
      <h2>{city}</h2>
      <div className="temperature">{temperature}°C</div>
      <p className="condition">{condition}</p>
    </div>
  );
}
\`\`\`

## Using Widget in a Tool

\`\`\`typescript
// index.ts
import { widget, text } from "mcp-use/server";

server.tool(
  {
    name: "get-weather",
    description: "Get weather for a city",
    schema: z.object({
      city: z.string()
    }),
    widget: {
      name: "weather-display",  // Matches filename
      invoking: "Fetching weather...",
      invoked: "Weather data loaded"
    }
  },
  async ({ city }) => {
    const data = await fetchWeather(city);
    
    return widget({
      props: {
        city,
        temperature: data.temp,
        condition: data.condition
      },
      output: text(\`Weather in \${city}: \${data.temp}°C, \${data.condition}\`)
    });
  }
);
\`\`\`

## Interactive Widget

\`\`\`typescript
// resources/todo-list.tsx
import { useState } from "react";
import { z } from "zod";

export const widgetMetadata = {
  description: "Interactive todo list",
  schema: z.object({
    initialTodos: z.array(z.object({
      id: z.string(),
      text: z.string(),
      completed: z.boolean()
    }))
  })
};

type Props = z.infer<typeof widgetMetadata.schema>;

export default function TodoList({ initialTodos }: Props) {
  const [todos, setTodos] = useState(initialTodos);
  
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <div key={todo.id} className="todo-item">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span className={todo.completed ? "completed" : ""}>
            {todo.text}
          </span>
        </div>
      ))}
    </div>
  );
}
\`\`\`

## Styled Widget

\`\`\`typescript
// resources/product-card.tsx
import { z } from "zod";
import "./styles.css";

export const widgetMetadata = {
  description: "Product card with image and details",
  schema: z.object({
    name: z.string(),
    price: z.number(),
    image: z.string().url(),
    rating: z.number().min(0).max(5)
  })
};

type Props = z.infer<typeof widgetMetadata.schema>;

export default function ProductCard({ name, price, image, rating }: Props) {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3>{name}</h3>
        <div className="product-rating">
          {"⭐".repeat(Math.round(rating))}
        </div>
        <p className="product-price">\${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
\`\`\`

## Key Points

- Widget files go in **resources/** folder
- Export **widgetMetadata** with description and Zod schema
- Widget name in tool must **match filename** (without .tsx)
- Props are **automatically typed** from the schema
- Use **shared styles** in resources/styles.css
- Widgets are **automatically registered** as tools and resources
- Return widgets using **widget()** helper function

## Widget Best Practices

1. Keep widgets **focused** and single-purpose
2. Use **TypeScript** for type safety
3. Style with **Tailwind CSS** or regular CSS
4. Make widgets **responsive** for different screen sizes
5. Handle **loading states** appropriately
6. Add **error boundaries** for robustness
7. Test widgets in the **Inspector UI**
`);
  }
);

// Resource 5: Complete Server Example
server.resource(
  {
    uri: "mcp-use://examples/complete-server",
    name: "Complete Server Example",
    description: "Full working example combining all MCP primitives",
    mimeType: "text/markdown",
  },
  async () => {
    return markdown(`# Complete MCP Server Example

A full example combining tools, resources, prompts, and widgets.

## Project Structure

\`\`\`
weather-mcp-server/
├── resources/
│   ├── weather-widget.tsx
│   └── styles.css
├── index.ts
├── package.json
└── tsconfig.json
\`\`\`

## Complete Implementation

\`\`\`typescript
// index.ts
import { MCPServer, widget, text, object, markdown } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "weather-server",
  version: "1.0.0",
  description: "Weather information MCP server",
  baseUrl: process.env.MCP_URL || "http://localhost:3000"
});

// ============================================================================
// TOOLS
// ============================================================================

// Tool 1: Get Current Weather
server.tool(
  {
    name: "get-weather",
    description: "Get current weather for a city",
    schema: z.object({
      city: z.string().describe("City name"),
      units: z.enum(["metric", "imperial"]).optional().describe("Temperature units")
    }),
    widget: {
      name: "weather-widget",
      invoking: "Fetching weather data...",
      invoked: "Weather data loaded"
    }
  },
  async ({ city, units = "metric" }) => {
    try {
      // Simulate API call
      const weather = {
        city,
        temperature: units === "metric" ? 22 : 72,
        condition: "Sunny",
        humidity: 65,
        windSpeed: units === "metric" ? 15 : 9,
        units
      };
      
      return widget({
        props: weather,
        output: text(
          \`Weather in \${city}: \${weather.temperature}°\${units === "metric" ? "C" : "F"}, \${weather.condition}\`
        )
      });
    } catch (error) {
      return text(\`Error fetching weather: \${error.message}\`);
    }
  }
);

// Tool 2: Get Weather Forecast
server.tool(
  {
    name: "get-forecast",
    description: "Get weather forecast for the next 5 days",
    schema: z.object({
      city: z.string().describe("City name"),
      days: z.number().min(1).max(5).optional().describe("Number of days (1-5)")
    })
  },
  async ({ city, days = 5 }) => {
    const forecast = Array.from({ length: days }, (_, i) => ({
      day: new Date(Date.now() + i * 86400000).toLocaleDateString(),
      high: 20 + Math.random() * 10,
      low: 10 + Math.random() * 10,
      condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)]
    }));
    
    return object({ city, forecast });
  }
);

// ============================================================================
// RESOURCES
// ============================================================================

// Resource 1: Supported Cities
server.resource(
  {
    uri: "weather://cities",
    name: "Supported Cities",
    description: "List of cities with weather data",
    mimeType: "application/json"
  },
  async () => {
    return object({
      cities: [
        { name: "London", country: "UK", code: "LON" },
        { name: "New York", country: "USA", code: "NYC" },
        { name: "Tokyo", country: "Japan", code: "TYO" },
        { name: "Paris", country: "France", code: "PAR" },
        { name: "Sydney", country: "Australia", code: "SYD" }
      ]
    });
  }
);

// Resource 2: API Documentation
server.resource(
  {
    uri: "weather://docs",
    name: "Weather API Documentation",
    description: "Complete API documentation",
    mimeType: "text/markdown"
  },
  async () => {
    return markdown(\`
# Weather API Documentation

## Available Tools

### get-weather
Get current weather conditions for a city.

**Parameters:**
- \\\`city\\\` (string, required): City name
- \\\`units\\\` (string, optional): "metric" or "imperial"

### get-forecast
Get weather forecast for upcoming days.

**Parameters:**
- \\\`city\\\` (string, required): City name
- \\\`days\\\` (number, optional): Number of days (1-5)

## Resources

### weather://cities
List of supported cities

### weather://docs
This documentation
    \`);
  }
);

// ============================================================================
// PROMPTS
// ============================================================================

// Prompt: Weather Analysis
server.prompt(
  {
    name: "analyze-weather",
    description: "Generate a weather analysis prompt",
    schema: z.object({
      city: z.string().describe("City to analyze"),
      purpose: z.string().optional().describe("Purpose of analysis")
    })
  },
  async ({ city, purpose }) => {
    const purposeText = purpose ? \` for \${purpose}\` : "";
    
    return {
      messages: [
        {
          role: "system",
          content: {
            type: "text",
            text: "You are a meteorologist providing weather analysis."
          }
        },
        {
          role: "user",
          content: {
            type: "text",
            text: \`Analyze the weather in \${city}\${purposeText}. Include temperature trends, precipitation probability, and recommendations.\`
          }
        }
      ]
    };
  }
);

// Start the server
server.listen().then(() => {
  console.log("Weather MCP server running");
});
\`\`\`

## Widget Component

\`\`\`typescript
// resources/weather-widget.tsx
import { z } from "zod";

export const widgetMetadata = {
  description: "Display weather information with visual styling",
  schema: z.object({
    city: z.string(),
    temperature: z.number(),
    condition: z.string(),
    humidity: z.number(),
    windSpeed: z.number(),
    units: z.enum(["metric", "imperial"])
  })
};

type Props = z.infer<typeof widgetMetadata.schema>;

export default function WeatherWidget({
  city,
  temperature,
  condition,
  humidity,
  windSpeed,
  units
}: Props) {
  const tempUnit = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "km/h" : "mph";
  
  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h2>{city}</h2>
        <p className="condition">{condition}</p>
      </div>
      
      <div className="weather-main">
        <div className="temperature">{temperature}{tempUnit}</div>
      </div>
      
      <div className="weather-details">
        <div className="detail">
          <span className="label">Humidity</span>
          <span className="value">{humidity}%</span>
        </div>
        <div className="detail">
          <span className="label">Wind</span>
          <span className="value">{windSpeed} {speedUnit}</span>
        </div>
      </div>
    </div>
  );
}
\`\`\`

## Usage

\`\`\`bash
# Install dependencies
yarn install

# Run in development
yarn dev

# Test in inspector
open http://localhost:3000/inspector

# Deploy
yarn deploy
\`\`\`

This complete example demonstrates:
- ✅ Multiple tools with different purposes
- ✅ Resources for static and dynamic data
- ✅ Parameterized prompts
- ✅ Interactive widgets
- ✅ Error handling
- ✅ Type safety with Zod
- ✅ Clean code organization
`);
  }
);

// ============================================================================
// TOOLS: Server Management
// ============================================================================

// Tool 1: Run Server
server.tool(
  {
    name: "run-server",
    description: "Run an MCP server locally for development and testing",
    schema: z.object({
      useYarn: z.boolean().optional().describe("Use yarn instead of npm (default: true)"),
      port: z.number().optional().describe("Port to run on (default: 3000)")
    })
  },
  async ({ useYarn = true, port = 3000 }) => {
    const packageManager = useYarn ? "yarn" : "npm";
    
    return text(`To run your MCP server locally:

**Development mode (with hot reload):**
\`\`\`bash
${packageManager} run dev
\`\`\`

**Production mode:**
\`\`\`bash
# First build
${packageManager} run build

# Then start
${packageManager} start
\`\`\`

**With custom port:**
\`\`\`bash
PORT=${port} ${packageManager} start
\`\`\`

**Test with tunneling (before deployment):**
\`\`\`bash
# Option 1: Auto-tunnel
mcp-use start --port ${port} --tunnel

# Option 2: Separate tunnel
${packageManager} start  # Terminal 1
npx @mcp-use/tunnel ${port}  # Terminal 2
\`\`\`

Your server will be available at:
- 🌐 MCP endpoint: http://localhost:${port}/mcp
- 🔍 Inspector UI: http://localhost:${port}/inspector
- 🔒 Tunnel URL: https://[subdomain].local.mcp-use.run/mcp (when using tunnel)

**Tunnel details:**
- Expires after 24 hours
- Closes after 1 hour of inactivity
- Use to test with ChatGPT before deploying

Learn more: https://mcp-use.com/docs/tunneling`);
  }
);

// Tool 2: Deploy Server
server.tool(
  {
    name: "deploy-server",
    description: "Deploy an MCP server to production. Run 'npx mcp-use login' first if you get auth errors.",
    schema: z.object({
      useYarn: z.boolean().optional().describe("Use yarn instead of npm (default: true)"),
      platform: z.enum(["mcp-use-cloud", "supabase", "other"]).optional().describe("Deployment platform")
    })
  },
  async ({ useYarn = true, platform = "mcp-use-cloud" }) => {
    const packageManager = useYarn ? "yarn" : "npm";
    
    let instructions = `# Deploy Your MCP Server\n\n`;
    
    if (platform === "mcp-use-cloud") {
      instructions += `## Deploy to mcp-use Cloud (Recommended)

**Step 1: Login (if not already logged in)**
\`\`\`bash
npx mcp-use login
\`\`\`

**Step 2: Deploy**
\`\`\`bash
${packageManager} run deploy
\`\`\`

**If deployment fails with authentication error:**
\`\`\`bash
# Run login command
npx mcp-use login

# Then try deploy again
${packageManager} run deploy
\`\`\`

**After successful deployment:**
- ✅ You'll receive a public URL for your MCP server
- ✅ The server is automatically scaled and monitored
- ✅ HTTPS is enabled by default
- ✅ Zero-downtime deployments

**Deployment URL format:**
\`https://your-server-name.mcp-use.com/mcp\`

Use this URL to connect from ChatGPT, Claude, or other MCP clients.`;
    } else if (platform === "supabase") {
      instructions += `## Deploy to Supabase

**Step 1: Install Supabase CLI**
\`\`\`bash
npm install -g supabase
\`\`\`

**Step 2: Initialize Supabase**
\`\`\`bash
supabase init
\`\`\`

**Step 3: Deploy as Edge Function**
\`\`\`bash
supabase functions deploy mcp-server
\`\`\`

See full guide: https://docs.mcp-use.com/typescript/server/deployment/supabase`;
    } else {
      instructions += `## Deploy to Custom Platform

For other deployment platforms:
- **Vercel**: Use \`vercel deploy\`
- **Netlify**: Use \`netlify deploy\`
- **Railway**: Use \`railway up\`
- **Docker**: Build and deploy container

See deployment docs: https://docs.mcp-use.com/typescript/server/deployment`;
    }
    
    return text(instructions);
  }
);

// ============================================================================
// START SERVER
// ============================================================================

server.listen().then(() => {
  console.log(`mcp-use MCP server running
  
This server provides:
- 📖 Comprehensive guide prompt: "how-to-create-mcp-server"
- 📚 Example resources for all MCP primitives
- 🛠️  Tools for running and deploying servers

Access the inspector at /inspector to test all features!`);
});
