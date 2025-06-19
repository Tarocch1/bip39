export abstract class Coin {
  constructor(protected readonly seed: Buffer) {}

  abstract generate(): Promise<void>
}
