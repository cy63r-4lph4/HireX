declare module "eth-ens-namehash" {
  const namehash: {
    hash(name: string): string;
    normalize(name: string): string;
  };
  export = namehash;
}
