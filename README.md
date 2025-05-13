# Akave MCP Server

A Model Control Protocol (MCP) server that allows AI models to interact with Akave's S3-compatible storage. This server provides a set of tools for listing buckets, reading and writing objects, and generating signed URLs.

## Features

- List all buckets in Akave storage
- List objects in a bucket with optional prefix filtering
- Read object contents
- Write new objects
- Generate signed URLs for secure access

## Prerequisites

- Node.js 16+
- Access to an Akave account with:
  - Access Key ID
  - Secret Access Key
  - Endpoint URL

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/akave-mcp-js.git
cd akave-mcp-js
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Akave credentials:
```
AKAVE_ACCESS_KEY_ID=your_access_key
AKAVE_SECRET_ACCESS_KEY=your_secret_key
AKAVE_ENDPOINT_URL=your_endpoint_url
```

## Usage

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

For development with hot reloading:
```bash
npm run dev
```

## Available Tools

The server provides the following MCP tools:

1. `list_buckets`: List all buckets in Akave storage
2. `list_objects`: List objects in a bucket with optional prefix filtering
3. `get_object`: Read object contents from a bucket
4. `put_object`: Write a new object to a bucket
5. `get_signed_url`: Generate a signed URL for secure access to an object

## Development

1. Install development dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 