export interface ProblemStatement {
  title: string;
  description: string;
  requirements: string[];
  hints: string[];
}
export function getInitialCodeTemplate(lessonId: string): string {
  switch (lessonId) {
    case "solidity-functions":
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    // TODO: Define owner variable

    constructor() {
        // TODO: Set owner to message sender
    }

    // TODO: Create onlyOwner modifier

    // TODO: Implement deposit function (payable)

    // TODO: Implement withdraw function with onlyOwner modifier
}`;

    case "solidity-syntax":
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    // TODO: Define name, symbol, and totalSupply variables

    // TODO: Create balanceOf mapping

    // TODO: Define Transfer event

    constructor() {
        // TODO: Initialize variables and assign all tokens to creator
    }

    // TODO: Implement transfer function
}`;

    case "control-structures":
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // TODO: Create mapping for vote counts
    
    // TODO: Create array to store candidate list
    
    // TODO: Create mapping to track if an address has already voted

    // TODO: Implement function to register candidates
    
    // TODO: Implement function to cast votes
    
    // TODO: Implement function to get vote count for a candidate
}`;

    default:
      return `// Start coding your solution here\n`;
  }
}

export const problemStatements: { [key: string]: ProblemStatement } = {
  "solidity-functions": {
    title: "Bank Contract Challenge",
    description:
      "Create a simple bank contract where only the owner can withdraw funds.",
    requirements: [
      "Contract should have an 'owner' variable set to message sender in constructor",
      "Include a 'deposit' function that anyone can call",
      "Create a 'withdraw' function that only the owner can call",
      "Use a modifier called 'onlyOwner' to restrict access to the withdraw function",
    ],
    hints: [
      "Remember to use 'msg.sender' to identify the transaction sender",
      "The 'payable' keyword allows functions to receive Ether",
      "Use 'require()' in your modifier to check conditions",
    ],
  },
  "solidity-syntax": {
    title: "Token Contract Challenge",
    description: "Create a simple token contract with basic functionality.",
    requirements: [
      "Contract should have a 'name', 'symbol', and 'totalSupply' variables",
      "Implement a 'balanceOf' mapping to track user balances",
      "Create a 'transfer' function that allows users to send tokens",
      "Emit a 'Transfer' event when tokens are transferred",
    ],
    hints: [
      "Use 'string' type for name and symbol",
      "Use 'uint256' for totalSupply and balances",
      "Make sure to check for sufficient balance before transfers",
      "Remember to update balances correctly during transfers",
    ],
  },
  "control-structures": {
    title: "Voting Contract Challenge",
    description:
      "Create a basic voting contract where users can vote for candidates.",
    requirements: [
      "Contract should have a mapping to store vote counts for each candidate",
      "Include a function to register candidates",
      "Create a function for users to cast votes",
      "Implement a view function to get vote count for a candidate",
    ],
    hints: [
      "Use mappings to associate candidates with vote counts",
      "Consider using an array to store the list of candidates",
      "Remember to prevent users from voting multiple times",
      "Use require() to validate inputs",
    ],
  },
};
