# Setup Guide

Follow one setup path only: **Windows** or **WSL**.

## Windows Setup

### 1) Install required tools

- Install `Git for Windows`: [https://git-scm.com/download/win](https://git-scm.com/download/win)
- Install **NVM for Windows** (official project): [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
  - Download and run `nvm-setup.exe`

### 2) Verify NVM

Open a new **Command Prompt** or **PowerShell**:

```powershell
nvm version
```

### 3) Install and use Node.js version 24

```powershell
nvm install 24.0.0
nvm use 24.0.0
node -v
npm -v
```

### 4) Clone and open the project

```powershell
git clone git@github.com:RudraharanNivaethan/LankaHouses.git
cd LankaHouses
```

### 5) Install dependencies

```powershell
npm ci
cd backend && npm ci
cd ../frontend && npm ci
cd ..
```

### 6) Create env files

Create:

- `backend/.env`
- `frontend/.env`

Add values provided by your team.

### 7) Run the apps (2 terminals)

Terminal 1:

```powershell
cd backend
npm run dev
```

Terminal 2:

```powershell
cd frontend
npm run dev
```

## WSL Setup (Ubuntu)

### 1) Install required tools

```bash
sudo apt update
sudo apt install -y git curl
```

### 2) Install NVM (official nvm-sh repository)

```bash
git clone https://github.com/nvm-sh/nvm.git ~/.nvm
cd ~/.nvm
git checkout v0.40.3
```

Add NVM to your shell profile (`~/.bashrc`):

```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
source ~/.bashrc
```

Verify:

```bash
nvm --version
```

### 3) Clone and open the project

```bash
git clone git@github.com:RudraharanNivaethan/LankaHouses.git
cd LankaHouses
```

### 4) Install and use project Node version

This repo uses Node `v24` (`.nvmrc`):

```bash
nvm install
nvm use
node -v
npm -v
```

### 5) Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 6) Create env files

Create:

- `backend/.env`
- `frontend/.env`

Add values provided by your team.

### 7) Run the apps (2 terminals)

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## Optional checks (from project root)

```bash
npm run lint
npm run format:check
```
