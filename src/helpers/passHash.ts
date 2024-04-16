import bcrypt from "bcrypt";

const encrypt = async (value: string) => {
  const saltRounds = 12;
  const hash = await bcrypt.hash(value, saltRounds);
  return hash;
};
const compare = async (password: string, savedPass: string) => {
  const comparePass = await bcrypt.compare(password, savedPass);
  return comparePass;
};
export default { compare, encrypt };
