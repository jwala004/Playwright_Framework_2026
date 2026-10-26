# GitHub Copilot & Playwright MCP Server configuration on latest version

# Pre-requisites:
1. Node-Js
2. Vs Code
3. Github copilot Extension (Provides inline coding suggestions as you type)
4. Github Copilot Chat Extension (A companion extension that provides conversational AI)

# Option 1: Playwright MCP Server repo:- [Best Option]
==> But, we should be aware about other options as well, because of there are many other different mcp servers that we need 

https://github.com/microsoft/playwright-mcp


Option 2 - Install the Playwright MCP server using the VS Code CLI:

code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'


Option 3 - Manually put configurations in mcp.json
if the 'mcp.json' file is not created, then create it manually.


Option 4 - From VS Code  site - (From Browse MCP Servers option)
https://code.visualstudio.com/mcp


New MCP Server Configuration File  - C:\Users\WishInfinite\AppData\Roaming\Code\User\mcp.json

A basic prompt:
Goto xyz.com, click onto the selectors section under playground.

-> We can also select different models before executing our prompt(or clicking on Send button).

