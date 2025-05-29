# Akave MCP Server

A Model Context Protocol (MCP) server that enables AI models to interact with Akave's S3-compatible storage. This server provides a set of tools for managing your Akave storage buckets and objects through AI models like Claude and local LLMs.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). Think of MCP like a USB-C port for AI applications - it provides a standardized way to connect AI models to different data sources and tools.

## Features

- List and manage buckets
- Upload, download, and manage **objects**
- Generate signed URLs for secure access
- Support for both Claude and local LLMs (via Ollama)
- Simple configuration through JSON

## Prerequisites

- Node.js 16+
- Access to an Akave account with:
  - Access Key ID
  - Secret Access Key
  - Endpoint URL
- For local LLM support:
  - Go 1.23 or later  
  - [Ollama](https://ollama.ai) installed

## Quick Start

Create a configuration file (e.g., `mcp.json`):
```json
{
  "mcpServers": {
    "akave": {
      "command": "npx",
      "args": [
        "-y",
        "akave-mcp-js"
      ],
      "env": {
        "AKAVE_ACCESS_KEY_ID": "your_access_key",
        "AKAVE_SECRET_ACCESS_KEY": "your_secret_key",
        "AKAVE_ENDPOINT_URL": "your_endpoint_url"
      }
    }
  }
}
```

## Usage with Claude Desktop

1. Download and install [Claude for Desktop](https://claude.ai/download) (macOS or Windows)

2. Open Claude Desktop Settings:
   - Click on the Claude menu
   - Select "Settings..."
   - Click on "Developer" in the left-hand bar
   - Click on "Edit Config"

3. This will create/update the configuration file at:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

4. Add the Akave MCP server configuration to the file:
```json
{
  "mcpServers": {
    "akave": {
      "command": "npx",
      "args": [
        "-y",
        "akave-mcp-js"
      ],
      "env": {
        "AKAVE_ACCESS_KEY_ID": "your_access_key",
        "AKAVE_SECRET_ACCESS_KEY": "your_secret_key",
        "AKAVE_ENDPOINT_URL": "your_endpoint_url"
      }
    }
  }
}
```

5. Restart Claude Desktop

6. You should see a slider icon in the bottom left corner of the input box. Click it to see the available Akave tools.

## Usage with Local LLMs (Ollama)

1. Install MCPHost:
```bash
go install github.com/mark3labs/mcphost@latest
```

2. Start MCPHost with your preferred model using the same configuration file:
```bash
# Using default config location
mcphost -m ollama:mistral

# Or specify a custom config file
mcphost -m ollama:mistral --config /path/to/your/mcp.json

# For debugging
mcphost --debug -m ollama:mistral --config /path/to/your/mcp.json
```

You can use any Ollama model, for example:
- `ollama:mistral`
- `ollama:qwen2.5`
- `ollama:llama2`

## Available Tools

The server provides the following MCP tools:

1. `list_buckets`: List all buckets in your Akave storage
2. `list_objects`: List objects in a bucket with optional prefix filtering
3. `get_object`: Read object contents from a bucket
4. `put_object`: Write a new object to a bucket
5. `get_signed_url`: Generate a signed URL for secure access to an object
6. `update_object`: Update an existing object
7. `delete_object`: Delete an object from a bucket
8. `copy_object`: Copy an object to another location
9. `create_bucket`: Create a new bucket
10. `delete_bucket`: Delete a bucket
11. `get_bucket_location`: Get the region/location of a bucket
12. `list_object_versions`: List all versions of objects (if versioning enabled)

## Example Usage

### Listing Buckets
```bash
# The AI model will automatically use the list_buckets tool
List all my buckets
```

### Reading a File
```bash
# The AI model will use the get_object tool
Read the file 'example.md' from bucket 'my-bucket'
```

### Uploading a File
```bash
# The AI model will use the put_object tool
Upload the content 'Hello World' to 'greeting.txt' in bucket 'my-bucket'
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure your Akave credentials are correct in the MCP configuration
   - Check if the endpoint URL is accessible
   - Verify your network connection

2. **File Reading Issues**
   - For markdown files, ensure proper encoding
   - For binary files, use appropriate tools
   - Check file permissions

3. **Local LLM Issues**
   - Ensure Ollama is running
   - Verify model compatibility
   - Check MCPHost configuration
   - Use `--debug` flag for detailed logs

4. **Claude Desktop Issues**
   - Check logs at:
     - macOS: `~/Library/Logs/Claude/mcp*.log`
     - Windows: `%APPDATA%\Claude\logs\mcp*.log`
   - Ensure Node.js is installed globally
   - Verify the configuration file syntax
   - Try restarting Claude Desktop

## Contributing

Contributions are welcome! Please feel free to submit an issue or a pull request.

## Support

For issues and feature requests, please create an issue in the GitHub repository. 
