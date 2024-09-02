# About

**Expense Planner** is a decentralized application (dApp) powered by Cartesi Rollups technology.

It allows users to track expenses and plan daily tasks with the benefits of blockchain technology, ensuring data security, transparency, and decentralization.

## Getting Started

Below you'll find instructions on how to set up this dApp locally.

### Prerequisites

Ensure you have the following packages installed on your PC:

- **Node.js**, **npm**, **yarn**
- **Docker**
- **Cartesi CLI**
  - Install via: `npm install -g @cartesi/cli`

### Installation

#### Clone this repo

```bash
git clone https://github.com/Mistie-rious/expense-planner-dapp.git
```

#### Install NPM packages

```bash
yarn install
```

#### Build and run the dApp via Cartesi CLI

```bash
cartesi build
```

```bash
cartesi run
```

## Usage

Here you can find examples of dApp communication and resource consumption.

### Available Resources

#### Advanced Handlers

##### createTask

- **description**: Creates a new task.
- **param data**: `{taskName: string, dueDate: string}`

**data sample**

```json
{
  "action": "createTask",
  "data": {
    "taskName": "Buy groceries",
    "dueDate": "2024-09-10"
  }
}
```

**hex sample**

```text
0x7b22616374696f6e223a226372656174655461736b222c202264617461223a7b227461736b4e616d65223a224275792067726f636572696573222c202264756544617465223a22323032342d30392d3130227d7d
```

**interact**:

Via Cartesi CLI, access your terminal in another window and input these instructions:

```bash
cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase='test test test test test test test test test test test junk' \
    --input=0x7b22616374696f6e223a226372656174655461736b222c202264617461223a7b227461736b4e616d65223a224275792067726f636572696573222c202264756544617465223a22323032342d30392d3130227d7d
```

##### addExpense

- **description**: Adds an expense to the tracker.
- **param required**: `{category: string, amount: number}`
- **param not required**: `{description: string, date: string}`

**data sample**

```json
{
  "action": "addExpense",
  "data": {
    "category": "Groceries",
    "amount": 150,
    "description": "Weekly shopping",
    "date": "2024-09-01"
  }
}
```

**hex sample**

```text
0x7b22616374696f6e223a22616464457870656e7365222c202264617461223a7b2263617465676f7279223a2247726f636572696573222c2022616d6f756e74223a3135302c20226465736372697074696f6e223a225765656b6c792073686f7070696e67222c202264617465223a22323032342d30392d3031227d7d
```

**interact**:

Via Cartesi CLI, access your terminal in another window and input these instructions:

```bash
cartesi send generic \
    --dapp=0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e \
    --chain-id=31337 \
    --rpc-url=http://127.0.0.1:8545 \
    --mnemonic-passphrase='test test test test test test test test test test test junk' \
    --input=0x7b22616374696f6e223a22616464457870656e7365222c202264617461223a7b2263617465676f7279223a2247726f636572696573222c2022616d6f756e74223a3135302c20226465736372697074696f6e223a225765656b6c792073686f7070696e67222c202264617465223a22323032342d30392d3031227d7d
```

#### Inspect Handlers

##### getAllTasks

- **description**: Retrieves all tasks.

**returned hex sample**

```json
{
  "status": "Accepted",
  "exception_payload": null,
  "reports": [
    {
      "payload": "0x..."
    }
  ],
  "processed_input_count": 2
}
```

**converted payload sample**

```json
[
  {
    "id": "d8c04a7b-e207-4dfb-a1d2-c64e9d09c9e5",
    "taskName": "Buy groceries",
    "dueDate": "2024-09-10",
    "createdAt": 8034
  }
]
```

**interact**:

Access the Cartesi inspect endpoint on your browser:

```text
http://localhost:8080/inspect/getAllTasks
```

##### getExpenseById

- **description**: Retrieves an expense by a given ID.
- **param data**: `expense id (UUID)`

**returned hex sample**

```json
{
  "status": "Accepted",
  "exception_payload": null,
  "reports": [
    {
      "payload": "0x..."
    }
  ],
  "processed_input_count": 2
}
```

**converted payload sample**

```json
{
  "details": {
    "id": "3d359a94-becc-4b7d-aedf-4e395007802c",
    "category": "Groceries",
    "amount": 150,
    "description": "Weekly shopping",
    "date": "2024-09-01"
  }
}
```

**interact**:

Access the Cartesi inspect endpoint on your browser:

```text
http://localhost:8080/inspect/getExpenseById/$expenseId
```
