import crypto from "node:crypto";

export function getId(): string {
  const randomNumber = Math.random();
  const hash = crypto.createHash("sha256");
  hash.update(randomNumber.toString());
  return hash.digest("hex");
}

export function calculateAge(birthday: Date) {
  const ageDiffMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDiffMs); // Milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
