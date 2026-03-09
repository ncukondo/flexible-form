FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install tmux
USER root
RUN apt-get update && apt-get install -y tmux && rm -rf /var/lib/apt/lists/*

USER node

# Configure tmux
COPY --chown=node:node .tmux.conf /home/node/.tmux.conf

# Install Claude Code using native binary installer
RUN curl -fsSL https://claude.ai/install.sh | bash

ENV PATH="/home/node/.local/bin:${PATH}"
