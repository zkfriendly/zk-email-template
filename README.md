# Minimal ZK Email Circuit Integration

This project serves as a template for integrating ZK Email circuits. It provides a minimal setup for compiling, proving, and testing ZK circuits for email verification.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Circom (must be installed separately)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

## Key Commands

- **Generate inputs**: 
  ```
  npm run gen
  # or
  yarn gen
  ```
- **Compile circuits**: 
  ```
  npm run compile
  # or
  yarn compile
  ```
- **Setup**: 
  ```
  npm run setup
  # or
  yarn setup
  ```
- **Generate verification key**: 
  ```
  npm run vkey
  # or
  yarn vkey
  ```
- **Generate proof**: 
  ```
  npm run prove
  # or
  yarn prove
  ```
- **Run tests**: 
  ```
  npm test
  # or
  yarn test
  ```

## Project Structure

- `circuits/`: Contains Circom circuit definitions, including the email circuit
- `inputs/`: Input generation scripts for the circuits
- `tests/`: Test files for the circuits, including email circuit tests

## Email Circuit

The email circuit in this project is designed to verify email properties and generate an email commitment. Here's a brief overview:

- Located in: `circuits/email_circuit.circom`
- Main components:
  - Email header verification
  - Sender email extraction and commitment
  - Public key verification
- Outputs:
  - `userOpHash`: A hash representing the user operation that we are assuming this circuit is intended to prove(set to 0 in this example)
  - `emailCommitment`: A commitment to the sender's email address
  - `pubkeyHash`: Hash of the public key used for signature verification

The email commitment is a crucial output that allows for privacy-preserving verification of the sender's email address. It's calculated using a combination of the sender's email address and a salt, then hashed using the Poseidon hash function.

## Notes

- This project uses Circomkit for circuit compilation and proof generation.
- The `NODE_OPTIONS=--max_old_space_size=8192` is set for memory-intensive operations.
- Ensure that Circom is properly installed and accessible in your system's PATH before running the commands.

## License

MIT
