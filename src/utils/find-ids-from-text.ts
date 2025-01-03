type FeatureKey = "tickets";

export const findTicketIdsFromText = (key: FeatureKey, value: string) => {
  const regexPattern = new RegExp(`/${key}/[a-zA-Z0-9]+`, "g");
  const paths = value.match(regexPattern) || [];
  return paths.map((path) => path.replace(`/${key}/`, ""));
};
