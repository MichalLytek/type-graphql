export const version = "2.0.0" as string;

export const versionInfo = Object.freeze({
  major: 2 as number,
  minor: 0 as number,
  patch: 0 as number,
  preReleaseTag: null as string | null,
});

export const versionPeerDependencies = Object.freeze({
  "class-validator": ">=0.14.0" as string,
  graphql: "^16.6.0" as string,
});
