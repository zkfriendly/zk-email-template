import fs from "fs";
import { promisify } from "util";
import { generateEmailVerifierInputs } from "@zk-email/helpers";

export const EMAIL_HEADER_MAX_BYTES = 1024;

export type TxAuthCircuitInput = {
  emailHeader: string[];
  emailHeaderLength: string;
  pubkey: string[];
  signature: string[];
  senderEmailIdx: string;
  accountCode: string;
};

export async function getEmailSender(rawEmail: string): Promise<string> {
  const selectorBuffer = Buffer.from("from:");
  let senderEmailIdx =
    Buffer.from(rawEmail).indexOf(selectorBuffer) + selectorBuffer.length;
  senderEmailIdx =
    Buffer.from(rawEmail).slice(senderEmailIdx).indexOf(Buffer.from("<")) +
    senderEmailIdx +
    1;
  const senderEmailEndIdx =
    Buffer.from(rawEmail).slice(senderEmailIdx).indexOf(Buffer.from(">")) +
    senderEmailIdx;
  return rawEmail.slice(senderEmailIdx, senderEmailEndIdx);
}

export async function getInputs(
  emailFilePath: string
): Promise<TxAuthCircuitInput> {
  const emailRaw = await promisify(fs.readFile)(emailFilePath, "utf8");
  const emailInputs = await generateEmailVerifierInputs(emailRaw, {
    ignoreBodyHashCheck: true,
    maxHeadersLength: EMAIL_HEADER_MAX_BYTES,
  });

  const data = emailInputs.emailHeader!.map((x) => Number(x));

  const selectorBuffer = Buffer.from("from:");
  let senderEmailIdx =
    Buffer.from(data).indexOf(selectorBuffer) + selectorBuffer.length;
  senderEmailIdx =
    Buffer.from(data).slice(senderEmailIdx).indexOf(Buffer.from("<")) +
    senderEmailIdx +
    1;

  const inputs: TxAuthCircuitInput = {
    ...emailInputs,
    senderEmailIdx: senderEmailIdx.toString(),
    accountCode: "",
  };

  return inputs;
}

export async function generate(emailFilePath: string) {
  const inputs = await getInputs(emailFilePath);

  // write to default.json file
  const outputFilePath = emailFilePath.replace(".eml", ".json");
  await promisify(fs.writeFile)(
    outputFilePath,
    JSON.stringify(inputs, null, 2)
  );
}
