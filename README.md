# Threema Chat Analyzer

<p align="center">
  <img src="docs/threema_logo.png" alt="Threema Chat Analyzer Logo" width="200"/>
</p>

<p align="center">
  <a href="https://github.com/maxiking445/threema-chat-analyzer/actions/workflows/release_version.yml">
    <img src="https://github.com/maxiking445/threema-chat-analyzer/actions/workflows/release_version.yml/badge.svg?branch=main" alt="Build Status">
  </a>
  <img src="https://img.shields.io/github/license/maxiking445/threema-chat-analyzer" alt="License">
  <img src="https://img.shields.io/github/v/release/maxiking445/threema-chat-analyzer" alt="Latest Release">
</p>

---
## Supported Versions
This tool has been tested and developed for Android/Threema exports.  IOS users are welcome to report whether the data export can be extracted and works or not. 

Versions:
- 6.3
## About

**Threema Chat Analyzer** is a tool to analyze exported Threema chats.

FEATURES:
- Message statistics
- Group statistics
- Offline analysis (your data is safe)

TODO:
- execute backend logic inside browser
- add chat search interface
- script to anonymze data
- suggestions are welcome

---

## How To Use

### How to export Data from Threema?
Detailed explanation how to create a data backup: [Threema Data Backup FAQ](https://threema.com/de/faq/data-backup)

### Via Docker (recommended)
Execute this to start frontend app in your selfhosted environment or local machine which runs docker.

 ```bash
docker run -d -p 5670:80 --name threema-chat-analyzer ghcr.io/maxiking445/threema-chat-analyzer:latest
```
You can now open [http://localhost:9090](http://localhost:9090)
### Build yourself 

 ```bash
docker build -t threema-chat-analyzer:latest .
docker compose up
```

### Start without Docker

Frontend&Backend
 ```bash
sudo ./start_application_linux.sh
```
