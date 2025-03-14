"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import {
  ChevronLeft,
  Menu,
  X,
  Moon,
  Sun,
  Book,
  Clock,
  Users,
} from "lucide-react";
import type { Course } from "../page";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

// Sample course content for "Basics of Solidity"
const solidityCourse = {
  id: "basics-of-solidity",
  title: "Basics of Solidity",
  description:
    "Learn the fundamentals of Solidity programming and smart contract development for blockchain applications.",
  level: "Beginner" as "Beginner",
  duration: "4 weeks",
  lessonCount: 7,
  tags: ["solidity", "basics"],
  popularity: 1,
  image: "/images/solidity-basics.png",
  lessons: [
    {
      id: "intro-to-solidity",
      title: "Introduction to Solidity & Smart Contracts",
      content: `
# Lesson 1: Introduction to Solidity & Smart Contracts

Hey there, future blockchain developer! Welcome to the world of Solidity! If you've ever wondered, "What exactly is a smart contract, and why is everyone talking about it?"—you're in the right place. Let's break it down without any complex jargon and have some fun along the way.

## What is Solidity?

Imagine you are writing a magic spell, but instead of controlling mythical creatures, your spell controls money, ownership, and agreements on the blockchain. Solidity is the language used to write these spells (smart contracts).

It's similar to JavaScript but with some extra features. With Solidity, you can create self-executing agreements that nobody can change or tamper with—not even you after deploying them.

## What are Smart Contracts?

Now, let's talk about smart contracts.

Think of a smart contract as a vending machine.
* You put money in (send cryptocurrency).
* You select your snack (trigger a function).
* The vending machine checks if you inserted the correct amount (validates conditions).
* If yes, it automatically drops your snack (executes the function).

No shopkeeper is needed. No middleman. Just instant execution based on clear rules written in Solidity.

Another way to think about it:
* Normal contracts are written on paper and need lawyers to enforce them.
* Smart contracts are written in code and enforce themselves automatically.

Blockchain ensures nobody can cheat, because once a smart contract is deployed, it runs exactly as written.

## Use Cases of Smart Contracts

Now that we know what smart contracts are, let's check out where they're used in real life:

* Decentralized Finance (DeFi) – Borrow, lend, and trade crypto without banks.
* NFTs – Own unique digital art, music, or in-game items.
* Supply Chain – Track where products come from without trusting middlemen.
* Ticketing – Buy concert tickets that can't be counterfeited.
* Voting Systems – Fair elections without fraud.

Smart contracts remove middlemen and make processes more transparent. No trust issues, no hidden fees—just pure automation.

## Writing a Simple "Hello World" Smart Contract

Now, let's write our first Solidity program.

If you've coded before, you might remember that in most programming languages, the first thing we write is a "Hello, World!" program. It's like saying hello to the language.

Here's what it looks like in Solidity:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, World!";
}
\`\`\`

Breaking it down:
* \`pragma solidity ^0.8.0;\` → Tells the compiler which Solidity version to use.
* \`contract HelloWorld {}\` → Defines a smart contract named "HelloWorld".
* \`string public message = "Hello, World!";\` → A public variable storing the message.

What this contract does:
* It stores a "Hello, World!" message.
* Since the variable is public, anyone can read it.

Simple, right? You just wrote your first smart contract.

## Try It Yourself

Now, head over to our Solidity Code Editor and type it in. Hit Compile and see if it works.
* If there's an error, don't worry—our AI suggestions will help you fix it.
* If it compiles successfully, congrats! You've just taken your first step into blockchain development.

## What's Next?

In the next lesson, we'll explore Solidity's syntax and data types—it's like learning the alphabet before writing full sentences. Stay curious and keep experimenting. See you in Lesson 2!
      `,
    },
    {
      id: "solidity-syntax",
      title: "Solidity Syntax and Data Types",
      content: `
# Lesson 2: Solidity Syntax & Data Types

Welcome back, blockchain developer!  
Now that you've said Hello, World! in Solidity, let’s break down the language itself—kind of like understanding the grammar of a new language before writing full stories.

Solidity is simple, but it does have its own rules and structure. Let’s explore!

## 1. Structure of a Solidity Smart Contract

Think of a Solidity contract like a recipe.

A recipe has:
1. Title (Contract name)
2. Ingredients (State variables)
3. Instructions (Functions)

Here's a basic Solidity contract skeleton:

\`\`\`solidity
// Step 1: Declare the version
pragma solidity ^0.8.0;

// Step 2: Define the contract
contract MyFirstContract {
    
    // Step 3: Declare variables
    string public myMessage = "Hello, Solidity!";
    
    // Step 4: Write functions
    function setMessage(string memory newMessage) public {
        myMessage = newMessage;
    }
}
\`\`\`

### Breakdown:
- \`pragma solidity ^0.8.0;\` → Solidity version (like saying “we’re using the latest English dictionary”).
- \`contract MyFirstContract {}\` → The blueprint of our smart contract.
- \`string public myMessage = "Hello, Solidity!";\` → A public state variable storing a message.
- \`function setMessage(string memory newMessage) public {}\` → A function to change the message.

Easy, right? Now, let’s talk about data types—the building blocks of Solidity!

## 2. Solidity Data Types

In Solidity, we store and process data using different types. Think of them like different kinds of containers in a kitchen.

### a) Numbers (uint & int)
- \`uint\` (Unsigned Integer) – Whole numbers that are only positive (like 0, 1, 2, 100).
- \`int\` (Signed Integer) – Whole numbers that can be both positive & negative (like -5, 0, 42).

#### Example:
\`\`\`solidity
uint256 public positiveNumber = 42;  // Stores 42
int256 public negativeNumber = -42;  // Stores -42
\`\`\`

### b) Strings (Words & Sentences)
- \`string\` – Stores text, like a note in a diary.

#### Example:
\`\`\`solidity
string public name = "Solidity"; 
\`\`\`

Why use \`memory\`?  
When passing a string in a function, Solidity needs to know where to store it (temporarily or permanently). We’ll cover this later.

### c) Boolean (True/False)
- \`bool\` – Think of it as a light switch: ON (true) or OFF (false).

#### Example:
\`\`\`solidity
bool public isCodingFun = true;
\`\`\`

### d) Address (Wallet Address)
- \`address\` – Stores Ethereum wallet addresses (like a unique house address).

#### Example:
\`\`\`solidity
address public myWallet = 0x1234567890abcdef1234567890abcdef12345678;
\`\`\`

### e) Bytes (Raw Data)
- \`bytes\` – Stores raw data like a file or a secret code.

#### Example:
\`\`\`solidity
bytes32 public secretCode = "0xabcdef123456";
\`\`\`

Why use \`bytes\` instead of \`string\`?
- \`string\` is easier to read but costs more gas (expensive).
- \`bytes\` is cheaper and faster for short data.

## 3. Variables in Solidity

Variables in Solidity store data, but where they are stored matters!

### a) State Variables (Permanent Data)
- Stored permanently on the blockchain (like a file saved forever).
- Used inside a contract but outside functions.

#### Example:
\`\`\`solidity
contract Example {
    uint public myAge = 25; // Stored on the blockchain
}
\`\`\`

### b) Local Variables (Temporary Data)
- Only exist inside a function.
- Not stored on the blockchain (so they don't use gas).

#### Example:
\`\`\`solidity
contract Example {
    function addNumbers() public pure returns (uint) {
        uint a = 5; // Local variable
        uint b = 10;
        return a + b; // Returns 15
    }
}
\`\`\`

### c) Global Variables (Blockchain Data)
- Built-in variables in Solidity that store blockchain-related info.

Examples:
- \`msg.sender\` → The wallet address of the person interacting with the contract.
- \`block.timestamp\` → The timestamp of the current block.

#### Example:
\`\`\`solidity
contract Example {
    function getSender() public view returns (address) {
        return msg.sender; // Returns caller's address
    }
}
\`\`\`

## 4. Visibility Specifiers (Who Can See What?)

Visibility determines who can access a function or variable.

| Specifier  | Who Can Access?  |
|------------|----------------|
| \`public\`   | Anyone (inside & outside the contract)  |
| \`private\`  | Only inside the contract  |
| \`internal\` | Only inside the contract & child contracts  |
| \`external\` | Only outside the contract (other contracts can call it)  |

### Example of Visibility in Action
\`\`\`solidity
contract Example {
    uint public a = 1;  // Anyone can see
    uint private b = 2; // Only this contract can see
    uint internal c = 3; // This contract + child contracts
}
\`\`\`

## Hands-on Activity: Try It Yourself!

Now, open your Solidity Code Editor and play around with these concepts:
- Declare different data types and test them.
- Create a public, private, and internal variable and check access.
- Use \`msg.sender\` to check your wallet address.

If you get stuck, our AI suggestions will help you!

## What’s Next?

In Lesson 3, we’ll learn how to write functions & modifiers—because contracts without functions are like cars without engines!

Stay curious and keep experimenting. See you in the next lesson!
  `,
    },
    {
      id: "solidity-functions",
      title: "Functions & Modifiers",
      content: `
# Lesson 3: Functions & Modifiers

Welcome back, Solidity explorer!  
So far, you have learned about Solidity’s structure and data types. But a smart contract without functions is like a vending machine without buttons—it just sits there doing nothing.

Today, we are making our contracts interactive. Let’s dive into functions, parameters, return values, and modifiers in Solidity.

## 1. Writing Functions in Solidity

A function in Solidity is like a robot. You tell it what to do, and it follows your command.

Here's how we define a function:

\`\`\`solidity
function sayHello() public pure returns (string memory) {
    return "Hello, Solidity!";
}
\`\`\`

### Breaking it down:
- \`function sayHello()\` → Declares a function named \`sayHello\`.
- \`public\` → Anyone can call this function.
- \`pure\` → It does not read or modify blockchain data.
- \`returns (string memory)\` → It returns a string.
- \`return "Hello, Solidity!";\` → It sends back "Hello, Solidity!".

### Try It Yourself:
Copy this into your Solidity editor, compile it, and call the function.

## 2. View & Pure Functions

Functions in Solidity can be read-only or modify blockchain data.

| Function Type  | Reads Data? | Modifies Data? |
|---------------|------------|---------------|
| Regular Function | ✅ Yes | ✅ Yes |
| View Function | ✅ Yes | ❌ No |
| Pure Function | ❌ No | ❌ No |

### a) View Functions (Read-Only)
- Used when you only want to read blockchain data.
- Does not modify state variables.
- No gas fee if called externally.

#### Example:
\`\`\`solidity
contract Example {
    uint public myNumber = 10;

    function getNumber() public view returns (uint) {
        return myNumber;  // Just reading, no modification
    }
}
\`\`\`

### b) Pure Functions (No Data Interaction)
- Used when no blockchain data is needed.
- Does not read or modify any variables.
- No gas fee.

#### Example:
\`\`\`solidity
contract Example {
    function addNumbers(uint a, uint b) public pure returns (uint) {
        return a + b;  // Doesn't touch blockchain storage
    }
}
\`\`\`

## 3. Function Parameters & Return Values

A function can take inputs (parameters) and return outputs.

### a) Function with Parameters
Imagine a coffee machine where you can choose sugar levels.

\`\`\`solidity
contract CoffeeMachine {
    function makeCoffee(string memory sugarLevel) public pure returns (string memory) {
        return string(abi.encodePacked("Coffee with ", sugarLevel, " sugar"));
    }
}
\`\`\`

Calling \`makeCoffee("medium")\` returns \`"Coffee with medium sugar"\`.

**Why \`abi.encodePacked\`?**  
Solidity does not allow direct string concatenation, so \`abi.encodePacked\` is used to merge strings.

### b) Function with Return Values
A function can return one or more values.

\`\`\`solidity
contract Math {
    function multiply(uint a, uint b) public pure returns (uint product) {
        product = a * b;
    }
}
\`\`\`

Calling \`multiply(2,3)\` returns \`6\`.

### Try This:
Modify the function to return both sum and product of two numbers.

## 4. Function Modifiers (Setting Rules for Functions)

Modifiers are special rules that functions must follow before they execute.

Imagine you own a VIP nightclub. You do not want everyone to enter, so you need a bouncer (modifier) to check IDs before allowing access.

Modifiers do exactly this—they restrict access or add conditions before running a function.

### a) The onlyOwner Modifier (Restricting Access)
Let’s create a club owner rule where only the contract owner can run a function.

\`\`\`solidity
contract VIPClub {
    address public owner;

    constructor() {
        owner = msg.sender; // Sets the contract creator as owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }

    function shutDownClub() public onlyOwner {
        // Only owner can execute this
    }
}
\`\`\`

### Breaking it down:
- \`constructor()\` → Runs once when the contract is deployed, setting the owner.
- \`modifier onlyOwner()\` → Checks if \`msg.sender\` (caller) is the owner.
- \`require(msg.sender == owner, "You are not the owner!");\` → Throws an error if someone else tries.
- \`_;\` → This tells Solidity, "Run the function after this check passes."

Now, only the contract owner can call \`shutDownClub()\`.

### b) Creating a Custom Modifier (Only for VIP Members)
Let’s say we allow only certain wallet addresses to access a VIP party.

\`\`\`solidity
contract VIPParty {
    mapping(address => bool) public isVIP;

    function addVIP(address _vip) public {
        isVIP[_vip] = true;
    }

    modifier onlyVIP() {
        require(isVIP[msg.sender], "Sorry, you're not on the VIP list!");
        _;
    }

    function enterVIPParty() public onlyVIP returns (string memory) {
        return "Welcome to the VIP party!";
    }
}
\`\`\`

Calling \`addVIP(0x123...)\` adds an address to the VIP list. If a non-VIP calls \`enterVIPParty()\`, they get denied.

---

## Summary & Hands-on Practice

### Today, you learned:
✔ How to write Solidity functions (\`public\`, \`private\`, \`view\`, \`pure\`).  
✔ How to pass parameters and return values.  
✔ How to use modifiers to restrict functions (\`onlyOwner\`, \`onlyVIP\`).  

### Now, try these in your Solidity Code Editor:
- Create a **bank contract** where only the owner can withdraw funds.
- Write a function that adds two numbers and returns **both the sum and product**.
- Implement a **VIP ticketing system** where only selected wallets can buy tickets.

If you get stuck, AI suggestions will guide you.

## What’s Next?

In the next lesson, we will explore **Control Structures & Error Handling**—so you can make your smart contracts more robust.

See you there!
  `,
    },
    {
      id: "control-structures",
      title: "Control Structures and Error Handling",
      content:
        '# Lesson 4: Control Structures & Error Handling\n\nWelcome back, Solidity sorcerer!\nSo far, we’ve built smart contracts that can store data, use functions, and have rules (modifiers).\n\nBut what if we need decision-making? Like a vending machine that checks your balance before dispensing snacks.\n\nToday, we’ll learn about:\n* **Conditional statements** – Making decisions with if-else\n* **Loops** – Repeating actions with for, while, and do-while\n* **Error handling** – Preventing bugs and bad inputs with require, assert, and revert\n\n## 1. Conditional Statements (if-else)\n\nConditional statements let our contract make decisions, just like a traffic signal.\n\n### Example: A contract checking if a user is old enough to vote (18+).\n\n```solidity\ncontract Voting {\n    function canVote(uint age) public pure returns (string memory) {\n        if (age >= 18) {\n            return "You can vote!";\n        } else {\n            return "Sorry, you are too young!";\n        }\n    }\n}\n```\n\n**Example outputs:**\n* `canVote(20)` → "You can vote!"\n* `canVote(16)` → "Sorry, you are too young!"\n\n### else if – Multiple Conditions\n\n```solidity\ncontract GradeSystem {\n    function getGrade(uint score) public pure returns (string memory) {\n        if (score >= 90) {\n            return "A";\n        } else if (score >= 75) {\n            return "B";\n        } else if (score >= 50) {\n            return "C";\n        } else {\n            return "F";\n        }\n    }\n}\n```\n\n**Example outputs:**\n* `getGrade(85)` → "B"\n* `getGrade(40)` → "F"\n\n## 2. Loops in Solidity (Repeating Actions)\n\nLoops are useful when we need to repeat tasks without writing the same code multiple times.\n\n| **Loop Type**  | **How it Works**  |\n|---------------|------------------|\n| **for loop**   | Repeats a fixed number of times |\n| **while loop** | Runs while a condition is true |\n| **do-while loop** | Runs at least once, then checks the condition |\n\n### a) for Loop (Counting Repetitions)\n\n```solidity\ncontract Loops {\n    function sumFirstFive() public pure returns (uint sum) {\n        for (uint i = 1; i <= 5; i++) {\n            sum += i;  // Adds 1+2+3+4+5\n        }\n    }\n}\n```\n\n**Output:** `sumFirstFive()` returns `15` (1+2+3+4+5).\n\n### b) while Loop (Repeats Until Condition is False)\n\n```solidity\ncontract Countdown {\n    function countDown() public pure returns (string memory) {\n        uint i = 5;\n        string memory result = "";\n        \n        while (i > 0) {\n            result = string(abi.encodePacked(result, uint2str(i), " "));\n            i--;\n        }\n        \n        return result;\n    }\n}\n```\n\n**Output:** `"5 4 3 2 1 "`\n\n### c) do-while Loop (Always Runs at Least Once)\n\n```solidity\ncontract DoWhileExample {\n    function sayHello(uint count) public pure returns (string memory) {\n        string memory result = "";\n        do {\n            result = string(abi.encodePacked(result, "Hello! "));\n            count--;\n        } while (count > 0);\n        \n        return result;\n    }\n}\n```\n\n**Example outputs:**\n* `sayHello(3)` → `"Hello! Hello! Hello! "`\n* `sayHello(0)` → `"Hello! "` (Runs once before checking condition.)\n\n## 3. Error Handling (Preventing Bad Inputs & Bugs)\n\nSolidity provides three tools to prevent errors:\n* `require()` – Checks conditions before executing code.\n* `assert()` – Checks internal errors (should never fail).\n* `revert()` – Manually cancels a transaction.\n\n### a) require() (Checking Conditions First)\n\n```solidity\ncontract Bank {\n    mapping(address => uint) public balances;\n\n    function deposit() public payable {\n        require(msg.value >= 1 ether, "Minimum deposit is 1 ETH");\n        balances[msg.sender] += msg.value;\n    }\n}\n```\n\n### b) assert() (Checking Internal Logic)\n\n```solidity\ncontract SafeMath {\n    function subtract(uint a, uint b) public pure returns (uint) {\n        uint result = a - b;\n        assert(result <= a);  // Ensure subtraction is correct\n        return result;\n    }\n}\n```\n\n### c) revert() (Manual Error Handling)\n\n```solidity\ncontract VIPAccess {\n    mapping(address => bool) public isVIP;\n\n    function enterClub() public view returns (string memory) {\n        if (!isVIP[msg.sender]) {\n            revert("Access Denied: You are not a VIP!");\n        }\n        return "Welcome, VIP!";\n    }\n}\n```\n\n## Summary & Hands-on Practice!\n\n✔ if-else statements to make decisions.\n✔ for, while, and do-while loops to repeat actions.\n✔ require(), assert(), and revert() to handle errors safely.\n\n### Try These Challenges:\n✅ Write a function that checks if a number is even or odd.\n✅ Create a bank contract that allows only deposits of a minimum of 1 ETH.\n✅ Write a loop that calculates the factorial of a number.\n\nSee you in the next lesson!',
    },
    {
      id: "mappings-structs-arrays",
      title: "Mappings, Structs, and Arrays",
      content:
        '# Lesson 5: Mappings, Structs, and Arrays\n\nWelcome, Solidity explorer!\n\nSo far, we’ve written contracts with variables, functions, and logic—but where do we store data efficiently?\n\nImagine you\'re organizing a school:\n- **Arrays** = A list of students (Student #1, Student #2, etc.)\n- **Structs** = A student profile (name, age, grade, etc.)\n- **Mappings** = A phone book (Student Name → Phone Number)\n\nToday, we’ll learn:\n- **Arrays** – Storing multiple values in a list\n- **Structs** – Grouping different data types together\n- **Mappings** – Creating key-value pairs (like a dictionary)\n\n### 1. Arrays: Storing Multiple Items\nArrays are like shopping lists—a collection of items stored in order.\n\n#### Fixed-Size vs. Dynamic Arrays\n| Type | Description |\n|------|------------|\n| **Fixed Array** | Size cannot change (e.g., 5 students max). |\n| **Dynamic Array** | Size can grow/shrink (e.g., adding students dynamically). |\n\n#### a) Fixed-Size Arrays\n**Example: Store 3 favorite numbers**\n```solidity\ncontract FixedArray {\n    uint[3] public favoriteNumbers = [7, 42, 99];\n\n    function getNumber(uint index) public view returns (uint) {\n        return favoriteNumbers[index]; // Get a number from the array\n    }\n}\n```\n- `getNumber(1)` → 42 (since arrays start at index 0).\n\n#### b) Dynamic Arrays (Expandable Lists)\n**Example: A growing list of student names**\n```solidity\ncontract StudentList {\n    string[] public students;\n\n    function addStudent(string memory _name) public {\n        students.push(_name);\n    }\n\n    function getStudent(uint index) public view returns (string memory) {\n        return students[index];\n    }\n\n    function getTotalStudents() public view returns (uint) {\n        return students.length;\n    }\n}\n```\n- `addStudent("Alice")` → "Alice" added\n- `getTotalStudents()` → 1\n\n### 2. Structs: Custom Data Structures\nA struct is like a profile card—it holds multiple pieces of related data together.\n\n#### Example: Student Struct\n```solidity\ncontract StudentRegistry {\n    struct Student {\n        string name;\n        uint age;\n        string grade;\n    }\n\n    Student public exampleStudent = Student("Alice", 20, "A");\n\n    function createStudent(string memory _name, uint _age, string memory _grade) public pure returns (Student memory) {\n        return Student(_name, _age, _grade);\n    }\n}\n```\n- `createStudent("Bob", 22, "B")` → Returns Bob, 22, B\n\n#### Using Structs in an Array\n```solidity\ncontract StudentList {\n    struct Student {\n        string name;\n        uint age;\n    }\n\n    Student[] public students;\n\n    function addStudent(string memory _name, uint _age) public {\n        students.push(Student(_name, _age));\n    }\n\n    function getStudent(uint index) public view returns (string memory, uint) {\n        Student memory s = students[index];\n        return (s.name, s.age);\n    }\n}\n```\n- `addStudent("Charlie", 19)`\n- `getStudent(0)` → Returns "Charlie", 19\n\n### 3. Mappings: Key-Value Storage\nMappings are like a phone book—you provide a key (like a name) to get a value (like a phone number).\n\n| Key | Value |\n|-----|-------|\n| Alice | 10 ETH |\n| Bob | 5 ETH |\n| Charlie | 0 ETH |\n\nMappings are optimized for fast lookups, but you can’t loop through them directly.\n\n#### a) Simple Mapping\n```solidity\ncontract Wallet {\n    mapping(address => uint) public balances;\n\n    function setBalance(uint _amount) public {\n        balances[msg.sender] = _amount;\n    }\n\n    function getBalance() public view returns (uint) {\n        return balances[msg.sender];\n    }\n}\n```\n- `setBalance(100)` → Stores 100 for `msg.sender`\n- `getBalance()` → Returns 100\n\n#### b) Mapping Structs (Phone Book Example)\n```solidity\ncontract PhoneBook {\n    struct Contact {\n        string name;\n        string phoneNumber;\n    }\n\n    mapping(address => Contact) public contacts;\n\n    function addContact(string memory _name, string memory _phone) public {\n        contacts[msg.sender] = Contact(_name, _phone);\n    }\n\n    function getContact() public view returns (string memory, string memory) {\n        Contact memory c = contacts[msg.sender];\n        return (c.name, c.phoneNumber);\n    }\n}\n```\n- `addContact("Alice", "123-456")`\n- `getContact()` → "Alice", "123-456"\n\n### Summary & Hands-on Practice\nToday, we covered:\n- **Arrays** – Fixed & dynamic lists of data\n- **Structs** – Custom data structures\n- **Mappings** – Key-value pairs for fast lookups\n\n#### Try These Challenges:\n1. Create a library system where books are stored as structs inside an array.\n2. Make a mapping that keeps track of a user’s favorite color.\n3. Store a list of products with name, price, and stock availability.\n\n**What’s Next?**\nNext time, we’ll explore **Events & Smart Contract Interactions**—allowing contracts to communicate and log important actions.',
    },
    {
      id: "events-security",
      title: "Events & Smart Contract Security",
      content:
        '# Lesson 6: Events & Smart Contract Security\n\nWelcome back, Solidity explorer. Today, we are diving into **events**, which allow smart contracts to communicate with external applications, and **security**, which ensures contracts are protected from vulnerabilities.\n\n## Events: Let Your Contract Communicate\n\nEvents allow a smart contract to send messages that external applications, such as a frontend or another contract, can listen to and react to.\n\n### Example Scenarios:\n- A user sends Ether → A `Transfer` event is emitted.\n- A user places a bet → A `BetPlaced` event is emitted.\n\n### Declaring and Emitting Events\n#### Example: Bank Transaction Notifications\n```solidity\ncontract Bank {\n    event Deposit(address indexed user, uint amount); // Event declaration\n\n    function deposit() public payable {\n        emit Deposit(msg.sender, msg.value); // Emit event when function runs\n    }\n}\n```\nWhen the `deposit` function is called, the blockchain logs the event:\n```scss\nDeposit(address user, uint amount)\n```\nThe frontend can listen for this event and show a live notification.\n\n### Indexed Events for Faster Searching\nUsing `indexed` allows filtering specific users in event logs.\n```solidity\nevent Transfer(address indexed from, address indexed to, uint amount);\n```\nWith `indexed`, transactions can be quickly filtered by sender or receiver.\n\n## Common Solidity Vulnerabilities & How to Stay Safe\n\nSmart contracts **cannot be changed once deployed**, so mistakes can lead to **permanent loss of funds**. Below are common security risks and their solutions.\n\n### 1. Reentrancy Attack\nA hacker can repeatedly call a contract **before it updates balances**, draining funds.\n\n#### ❌ Vulnerable Contract:\n```solidity\ncontract BadVault {\n    mapping(address => uint) public balances;\n\n    function deposit() public payable {\n        balances[msg.sender] += msg.value;\n    }\n\n    function withdraw() public {\n        require(balances[msg.sender] > 0, "No funds");\n        (bool success, ) = msg.sender.call{value: balances[msg.sender]}("");\n        require(success, "Transfer failed");\n        balances[msg.sender] = 0; // Update balance AFTER transfer\n    }\n}\n```\n🚨 **Problem:** The attacker can repeatedly call `withdraw` before the balance is updated.\n\n#### ✅ Solution: Use the "Checks-Effects-Interactions" Pattern\n```solidity\nfunction withdraw() public {\n    uint amount = balances[msg.sender];\n    require(amount > 0, "No funds");\n\n    balances[msg.sender] = 0; // Update balance FIRST\n    (bool success, ) = msg.sender.call{value: amount}("");\n    require(success, "Transfer failed");\n}\n```\nThis ensures that the balance is cleared before making the external call, **preventing reentrancy**.\n\n### 2. Integer Overflow & Underflow\nIf numbers exceed their **maximum value (overflow)** or go **below zero (underflow)**, the contract may break.\n\n#### ❌ Vulnerable Contract:\n```solidity\ncontract BadMath {\n    uint8 public num = 255; // Max value for uint8\n\n    function add() public {\n        num += 1; // Overflow! Resets to 0\n    }\n}\n```\n#### ✅ Solution: Use SafeMath (or Solidity 0.8+, which has built-in checks)\n```solidity\nfunction add() public {\n    unchecked { num += 1; } // Use unchecked only if safe\n}\n```\nSolidity **0.8+ prevents overflows by default**, eliminating silent resets.\n\n### 3. SelfDestruct Function\nSome contracts include a `selfdestruct` function that, if **improperly secured**, allows **anyone to delete the contract permanently**.\n\n#### ❌ Vulnerable Contract:\n```solidity\ncontract BadContract {\n    function destroy() public {\n        selfdestruct(payable(msg.sender)); // Anyone can destroy the contract\n    }\n}\n```\n#### ✅ Solution: Restrict `selfdestruct` to the Owner\n```solidity\ncontract SafeContract {\n    address private owner;\n\n    constructor() {\n        owner = msg.sender;\n    }\n\n    function destroy() public {\n        require(msg.sender == owner, "Not the owner!"); // Only owner can call\n        selfdestruct(payable(owner));\n    }\n}\n```\nThis ensures **only the contract owner** can delete it.\n\n### 4. Access Control Flaws\nIf functions **are not restricted**, anyone can call them and modify critical contract variables.\n\n#### ❌ Vulnerable Contract:\n```solidity\ncontract BadOwner {\n    address public owner;\n\n    function changeOwner(address newOwner) public {\n        owner = newOwner; // Anyone can take over the contract\n    }\n}\n```\n#### ✅ Solution: Use an `onlyOwner` Modifier\n```solidity\ncontract SafeOwner {\n    address public owner;\n\n    constructor() {\n        owner = msg.sender;\n    }\n\n    modifier onlyOwner() {\n        require(msg.sender == owner, "Not the owner!");\n        _;\n    }\n\n    function changeOwner(address newOwner) public onlyOwner {\n        owner = newOwner; // Only owner can update\n    }\n}\n```\nThis ensures **only the original owner** can change ownership.\n\n## Best Practices for Secure Smart Contracts\n✅ Use `onlyOwner` or `require(msg.sender == owner)` for critical functions.\n✅ Always update balances **before making external calls** to prevent **reentrancy attacks**.\n✅ Use Solidity **0.8+ to avoid integer overflows**.\n✅ Emit **events** for important actions such as transfers and contract changes.\n✅ **Never expose** `selfdestruct` unless absolutely necessary.\n\n## Summary & Hands-on Practice\nToday, we covered:\n- **Events** – Solidity’s way of sending notifications.\n- **Reentrancy Attacks** – How to prevent funds from being drained.\n- **Integer Overflow/Underflow** – Avoiding silent math errors.\n- **SelfDestruct & Access Control** – Protecting contracts from unauthorized access.\n\n### 🔥 Challenges:\n1️⃣ Create a contract where users can buy tokens, **emitting an event** each time.\n2️⃣ Implement a **secure withdrawal function** that prevents **reentrancy**.\n3️⃣ Build a **vault contract** with `onlyOwner` to change security settings.\n\n## 🚀 Up Next: Solidity Inheritance & Smart Contract Structuring\nIn the next lesson, we will learn how **smart contracts inherit** from each other, similar to **parent-child relationships** in code.\n\n**Keep coding and continue making Solidity contracts more secure!**',
    },
    {
      id: "inheritance-advanced-concepts",
      title: "Inheritance & Advanced Concepts",
      content:
        '# Lesson 7: Inheritance & Advanced Concepts\n\nWelcome back, Solidity explorer! Today, we’re diving into **inheritance** (letting contracts share features), **interfaces & abstract contracts** (setting rules for others to follow), and an **introduction to the ERC-20 & ERC-721 token standards**.\n\n---\n\n### 1. Inheritance in Solidity: Like Parents & Children\nThink of Solidity inheritance like a family tree:\n- **Parent contracts (base contracts)** define general functions.\n- **Child contracts (derived contracts)** inherit those functions and can add or modify them.\n\n#### Example: Basic Inheritance\n```solidity\n// Parent Contract (Base Contract)\ncontract Animal {\n    string public species;\n\n    function setSpecies(string memory _species) public {\n        species = _species;\n    }\n}\n\n// Child Contract (Derived Contract)\ncontract Dog is Animal {\n    string public name;\n\n    function setName(string memory _name) public {\n        name = _name;\n    }\n}\n```\n**Explanation:**\n- `Dog` inherits all properties of `Animal`.\n- `Dog` can still add `setName()` (specific to Dog).\n\n#### Overriding Functions (Modifying Parent Behavior)\n```solidity\ncontract Animal {\n    function makeSound() public pure virtual returns (string memory) {\n        return "Some generic animal sound";\n    }\n}\n\ncontract Dog is Animal {\n    function makeSound() public pure override returns (string memory) {\n        return "Woof! Woof!";\n    }\n}\n```\n**Explanation:**\n- The `virtual` keyword in `Animal` allows overriding.\n- The `override` keyword in `Dog` changes the function’s behavior.\n\n---\n\n### 2. Interfaces & Abstract Contracts\nInterfaces and abstract contracts define rules for how other contracts should behave.\n\n#### **Interfaces: Must-Implement Rules**\n```solidity\ninterface Vehicle {\n    function start() external;\n    function stop() external;\n}\n\ncontract Car is Vehicle {\n    function start() external override {\n        // Code to start the car\n    }\n    function stop() external override {\n        // Code to stop the car\n    }\n}\n```\n**Explanation:**\n- `Vehicle` is an interface—any contract using it **must** implement `start()` and `stop()`.\n- `Car` follows the blueprint, ensuring every car has a way to start and stop.\n\n#### **Abstract Contracts: Partially Built Houses**\n```solidity\nabstract contract Bank {\n    function deposit() public virtual;\n    function withdraw() public virtual;\n}\n\ncontract MyBank is Bank {\n    function deposit() public override {\n        // Code for depositing money\n    }\n    function withdraw() public override {\n        // Code for withdrawing money\n    }\n}\n```\n**Explanation:**\n- `Bank` is abstract, meaning **it cannot be deployed alone**.\n- `MyBank` completes it by defining `deposit()` and `withdraw()`.\n\n---\n\n### 3. Working with ERC-20 & ERC-721 Standards\nSolidity has established standards for tokens, making them easy to integrate across platforms.\n\n#### **ERC-20: Fungible tokens** (identical & interchangeable, like USD or Bitcoin)\n##### Basic ERC-20 functions:\n- `totalSupply()` → Total tokens in existence\n- `balanceOf()` → Check token balance of an address\n- `transfer()` → Move tokens between users\n\n```solidity\ninterface IERC20 {\n    function totalSupply() external view returns (uint);\n    function balanceOf(address account) external view returns (uint);\n    function transfer(address recipient, uint amount) external returns (bool);\n}\n```\n**Every ERC-20 token must follow this standard.**\n\n#### **ERC-721: NFTs (Unique Digital Assets)**\n##### Basic ERC-721 functions:\n- `ownerOf(tokenId)` → Who owns this NFT?\n- `transferFrom()` → Move the NFT to someone else\n- `mint()` → Create a new NFT\n\n```solidity\ninterface IERC721 {\n    function ownerOf(uint tokenId) external view returns (address);\n    function transferFrom(address from, address to, uint tokenId) external;\n}\n```\n**Every NFT contract must include these functions.**\n\n---\n\n## Course Wrap-Up\n🎉 **Congratulations!** You now understand Solidity basics and can write smart contracts.\n\n### **Key Takeaways from the Course**\n✅ Solidity syntax & smart contract structure  \n✅ Variables, functions, and control structures  \n✅ Mappings, structs, and arrays  \n✅ Events & smart contract security  \n✅ Inheritance, interfaces, and ERC-20/ERC-721  \n\n### **Next Steps & Practice Challenges**\n🔹 **Build a bank contract** that inherits from a base contract.  \n🔹 **Create a simple ERC-20 token** with transfer functionality.  \n🔹 **Make an NFT contract** that mints unique digital collectibles.  \n\n📌 **In the next course, we’ll dive into deploying contracts on a real blockchain.**  \nKeep learning, keep building, and **welcome to the world of Web3!** 🚀\n',
    },
  ],
};

// Define lesson type
interface Lesson {
  id: string;
  title: string;
  content: string;
}
type ThemeMode = "dark" | "light";

// Define full course type with lessons
interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

// Course data object - in a real application, this would come from an API
const coursesData: { [key: string]: CourseWithLessons } = {
  "basics-of-solidity": solidityCourse,
  // Other courses would be added here with their lessons
};

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = React.use(
    params as unknown as Promise<{ id: string }>
  );
  const id = unwrappedParams.id;

  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  // Get current lesson index
  const currentLessonIndex =
    course?.lessons.findIndex((l) => l.id === currentLesson?.id) ?? 0;

  useEffect(() => {
    // Fetch course data based on the route id
    if (id) {
      const foundCourse = coursesData[id];
      if (foundCourse) {
        setCourse(foundCourse);

        // Set initial lesson
        if (lessonId) {
          const lesson = foundCourse.lessons.find((l) => l.id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
          } else {
            setCurrentLesson(foundCourse.lessons[0]);
          }
        } else {
          setCurrentLesson(foundCourse.lessons[0]);
        }
      }
    }
  }, [id, lessonId]);

  // Handle lesson change
  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Update URL - note the change in how navigation works
    router.push(`/courses/${id}?lessonId=${lesson.id}`);
  };

  // Get difficulty color based on level
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-400 bg-green-400/20";
      case "Intermediate":
        return "text-blue-400 bg-blue-400/20";
      case "Advanced":
        return "text-violet-400 bg-violet-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 px-6 border-b border-violet-900/30 backdrop-blur-sm bg-gray-900/60">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/courses"
              className="mr-4 text-gray-400 hover:text-violet-400 transition-colors"
              aria-label="Back to courses"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">{course.title}</h1>
            <span
              className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(
                course.level
              )}`}
            >
              {course.level}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Button - purely decorative in this implementation */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition-colors duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r border-violet-900/30 flex-shrink-0 transition-all duration-300 lg:translate-x-0 absolute lg:relative z-20 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-sm overflow-hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-violet-900/30">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-white">Course Content</h2>
              <span className="bg-violet-900/30 text-violet-400 text-xs font-medium px-2 py-0.5 rounded-full">
                {course.lessonCount} lessons
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {course.duration}
            </div>
          </div>
          <nav className="p-3 h-full overflow-y-auto">
            {course.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-300 ${
                  currentLesson.id === lesson.id
                    ? "bg-violet-900/30 text-white"
                    : "hover:bg-gray-800/60 text-gray-300"
                }`}
                onClick={() => handleLessonChange(lesson)}
              >
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                      currentLesson.id === lesson.id
                        ? "bg-violet-700 text-white"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">{lesson.title}</span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-10 h-[calc(100vh-4rem)]">
          {/* Backdrop overlay when sidebar is open on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Course progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-gray-400">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </h2>
                <div className="flex items-center">
                  <Book className="w-4 h-4 mr-1 text-violet-400" />
                  <span className="text-sm text-violet-400">
                    {Math.round(
                      ((currentLessonIndex + 1) / course.lessons.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-violet-600 h-1.5 rounded-full"
                  style={{
                    width: `${
                      ((currentLessonIndex + 1) / course.lessons.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Title card */}
            <div className="bg-gray-900/60 border border-violet-900/30 rounded-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                {currentLesson.title}
              </h1>
              <p className="text-gray-400">
                Learn at your own pace and master the concepts
              </p>
            </div>

            {/* Markdown content */}
            <article className="prose prose-invert prose-violet max-w-none bg-gray-900/60 border border-violet-900/30 rounded-lg p-6">
              <div className="markdown-body">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold mb-4 text-violet-400"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-bold mt-8 mb-4 text-violet-400"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-bold mt-6 mb-3 text-violet-400"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-gray-300" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="ml-6 mb-4 list-disc text-gray-300"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="ml-6 mb-4 list-decimal text-gray-300"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 text-gray-300" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-violet-400 underline hover:text-violet-300"
                        {...props}
                      />
                    ),
                    code: ({ node, className, ...props }) => {
                      const isInline =
                        !className || !className.includes("language-");
                      return isInline ? (
                        <code
                          className="px-1 py-0.5 rounded text-sm bg-gray-800 text-gray-300"
                          {...props}
                        />
                      ) : (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto">
                          <code
                            className={`block text-sm text-gray-300 ${className}`}
                            {...props}
                          />
                        </div>
                      );
                    },
                  }}
                >
                  {currentLesson.content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentLessonIndex > 0 ? (
                <button
                  className="px-4 py-2 rounded-lg transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() =>
                    handleLessonChange(course.lessons[currentLessonIndex - 1])
                  }
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous Lesson
                </button>
              ) : (
                <div></div> // Empty div to maintain the space for flexbox
              )}

              {currentLessonIndex < course.lessons.length - 1 && (
                <button
                  className="px-4 py-2 rounded-lg transition-colors bg-violet-700 hover:bg-violet-600 text-white flex items-center ml-auto"
                  onClick={() =>
                    handleLessonChange(course.lessons[currentLessonIndex + 1])
                  }
                >
                  Next Lesson
                  <ChevronLeft className="w-5 h-5 ml-2 rotate-180" />
                </button>
              )}
            </div>

            {/* Additional info card */}
            <div className="mt-8 bg-gray-900/60 border border-violet-900/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                Learning Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-violet-900/30 mr-3">
                    <Book className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Documentation</h4>
                    <p className="text-sm text-gray-400">
                      Access official resources and references
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-violet-900/30 mr-3">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Community</h4>
                    <p className="text-sm text-gray-400">
                      Join discussions and get help from others
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
