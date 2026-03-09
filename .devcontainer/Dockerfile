FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

USER node

# Install Claude Code using native binary installer
RUN curl -fsSL https://claude.ai/install.sh | bash

ENV PATH="/home/node/.local/bin:${PATH}"
