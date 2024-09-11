import { WitnessTester } from "circomkit";
import { circomkit } from "./common";
import circuits from "../circuits.json";
import { getEmailSender, getInputs } from "../inputs/email_circuit/generate";
import { promisify } from "util";
import fs from "fs";
import { calculateEmailAddrCommit } from "./common/utils";
import { assert } from "@zk-email/helpers";

describe("EmailCircuit", () => {
  let circuit: WitnessTester<
    [
      "emailHeader",
      "emailHeaderLength",
      "pubkey",
      "signature",
      "senderEmailIdx",
      "accountCode"
    ],
    ["userOpHash", "emailCommitment", "pubkeyHash"]
  >;

  before(async () => {
    circuit = await circomkit.WitnessTester(
      `email_circuit`,
      circuits.email_circuit
    );
  });

  it("should pass with correct witness", async () => {
    const emailFilePath = "./tests/emls/header.eml";
    const emailRaw = await promisify(fs.readFile)(emailFilePath, "utf8");
    const senderEmail = await getEmailSender(emailRaw);
    const inputs = await getInputs(emailFilePath);
    const circuitInput = {
      emailHeader: inputs.emailHeader.map((x) => BigInt(x)),
      emailHeaderLength: BigInt(inputs.emailHeaderLength),
      pubkey: inputs.pubkey.map((x) => BigInt(x)),
      signature: inputs.signature.map((x) => BigInt(x)),
      senderEmailIdx: BigInt(inputs.senderEmailIdx),
      accountCode: BigInt(0),
    };

    const expectedOutput = {
      userOpHash: BigInt(0),
      emailCommitment: await calculateEmailAddrCommit("", senderEmail),
      pubkeyHash:
        6632353713085157925504008443078919716322386156160602218536961028046468237192n,
    };

    const witness = await circuit.calculateWitness(circuitInput);

    console.log(JSON.stringify(witness, null, 2));

    assert(witness[1] == expectedOutput.userOpHash, "userOpHash mismatch");
    assert(
      witness[2] === expectedOutput.emailCommitment,
      "emailCommitment mismatch"
    );
    assert(witness[3] === expectedOutput.pubkeyHash, "pubkeyHash mismatch");
  });
});
