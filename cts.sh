#!/bin/bash

# CREATE TMUX SESSION

if [ -z "$1" ]; then
  echo "Usage: $0 <session_name>"
  exit 1
fi

SESSION_NAME=$1

# Check if a tmux session with the given name already exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "Session '$SESSION_NAME' already exists. Attaching to it..."
  tmux attach-session -t "$SESSION_NAME"
  exit 0
fi

tmux new-session -d -s "$SESSION_NAME" -n dev

tmux split-window -h -t "$SESSION_NAME:1"
tmux send-keys -t "$SESSION_NAME:1.1" 'cd packages/client' C-m
# tmux send-keys -t "$SESSION_NAME:1.1" 'pnpm dev' C-m
tmux send-keys -t "$SESSION_NAME:1.2" 'cd packages/server' C-m
# tmux send-keys -t "$SESSION_NAME:1.2" 'pnpm dev' C-m


tmux new-window -t "$SESSION_NAME:2" -n client
tmux send-keys -t "$SESSION_NAME:2" 'cd packages/client' C-m

tmux new-window -t "$SESSION_NAME:3" -n server
tmux send-keys -t "$SESSION_NAME:3" 'cd packages/server' C-m


tmux new-window -t "$SESSION_NAME:4" -n cli
tmux send-keys -t "$SESSION_NAME:4" 'cd packages/cli' C-m

tmux new-window -t "$SESSION_NAME:5" -n root

tmux select-window -t "$SESSION_NAME:1"

tmux attach-session -t "$SESSION_NAME"
