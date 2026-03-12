#!/usr/bin/env node
/**
 * Oh My Kiro - Worker Communication MCP Server
 * 
 * Provides simple file-based messaging between Kiro agents.
 * Messages are stored in .kiro/messages/ directory.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get working directory from env or use cwd
const WORK_DIR = process.env.OMK_WORK_DIR || process.cwd();
const MESSAGES_DIR = path.join(WORK_DIR, '.kiro', 'messages');

// Ensure messages directory exists
await fs.mkdir(MESSAGES_DIR, { recursive: true });

const server = new Server(
  {
    name: 'omk-messages',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'send_message',
        description: 'Send a message to another worker. Messages are stored in .kiro/messages/<recipient>/',
        inputSchema: {
          type: 'object',
          properties: {
            to: {
              type: 'string',
              description: 'Recipient worker name (e.g., "tester", "executor-2")',
            },
            message: {
              type: 'string',
              description: 'Message content',
            },
            metadata: {
              type: 'object',
              description: 'Optional metadata (e.g., file paths, status)',
              additionalProperties: true,
            },
          },
          required: ['to', 'message'],
        },
      },
      {
        name: 'read_messages',
        description: 'Read all messages for a worker. Messages are automatically deleted after reading.',
        inputSchema: {
          type: 'object',
          properties: {
            worker: {
              type: 'string',
              description: 'Worker name to read messages for',
            },
            keep: {
              type: 'boolean',
              description: 'Keep messages after reading (default: false)',
              default: false,
            },
          },
          required: ['worker'],
        },
      },
      {
        name: 'list_workers',
        description: 'List all workers that have message directories',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'send_message': {
        const { to, message, metadata = {} } = args as {
          to: string;
          message: string;
          metadata?: Record<string, unknown>;
        };

        // Create recipient directory
        const recipientDir = path.join(MESSAGES_DIR, to);
        await fs.mkdir(recipientDir, { recursive: true });

        // Write message
        const timestamp = Date.now();
        const messageFile = path.join(recipientDir, `${timestamp}.json`);
        const messageData = {
          message,
          metadata,
          timestamp,
          from: process.env.OMK_WORKER_ID || 'unknown',
        };

        await fs.writeFile(messageFile, JSON.stringify(messageData, null, 2));

        return {
          content: [
            {
              type: 'text',
              text: `Message sent to ${to}`,
            },
          ],
        };
      }

      case 'read_messages': {
        const { worker, keep = false } = args as {
          worker: string;
          keep?: boolean;
        };

        const workerDir = path.join(MESSAGES_DIR, worker);

        // Check if directory exists
        try {
          await fs.access(workerDir);
        } catch {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ messages: [] }),
              },
            ],
          };
        }

        // Read all message files
        const files = await fs.readdir(workerDir);
        const messages = await Promise.all(
          files
            .filter((f) => f.endsWith('.json'))
            .map(async (file) => {
              const filePath = path.join(workerDir, file);
              const content = await fs.readFile(filePath, 'utf-8');
              const data = JSON.parse(content);

              // Delete message after reading (unless keep=true)
              if (!keep) {
                await fs.unlink(filePath);
              }

              return data;
            })
        );

        // Sort by timestamp
        messages.sort((a, b) => a.timestamp - b.timestamp);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ messages, count: messages.length }),
            },
          ],
        };
      }

      case 'list_workers': {
        const entries = await fs.readdir(MESSAGES_DIR, { withFileTypes: true });
        const workers = entries
          .filter((e) => e.isDirectory())
          .map((e) => e.name);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ workers }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Oh My Kiro Message Server running');
