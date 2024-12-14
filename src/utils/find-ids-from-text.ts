export const findTicketIdsFromText = (key: string, value: string) => {
  const regexPattern = new RegExp(`/${key}/[a-zA-Z0-9]+`, "g");
  const paths = value.match(regexPattern) || [];
  return paths.map((path) => path.replace(`/${key}/`, ""));
};
