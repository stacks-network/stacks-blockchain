import fc from "fast-check";
import {
  PoxCommand,
  Stacker,
  Stub,
  StxAddress,
  Wallet,
} from "./pox_CommandModel";
import { StackStxSigCommand_Err } from "./pox_StackStxSigCommand_Err";
import { StackStxAuthCommand_Err } from "./pox_StackStxAuthCommand_Err";
import { Simnet } from "@hirosystems/clarinet-sdk";
import { RevokeDelegateStxCommand_Err } from "./pox_RevokeDelegateStxCommand_Err";
import { DelegateStxCommand_Err } from "./pox_DelegateStxCommand_Err";

const POX_4_ERRORS = {
  ERR_STACKING_ALREADY_STACKED: 3,
  ERR_STACKING_ALREADY_DELEGATED: 20,
  ERR_DELEGATION_ALREADY_REVOKED: 34,
};

export function ErrCommands(
  wallets: Map<StxAddress, Wallet>,
  stackers: Map<StxAddress, Stacker>,
  network: Simnet,
): fc.Arbitrary<PoxCommand>[] {
  const cmds = [
    // StackStxAuthCommand_Err_Stacking_Already_Stacked_1
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
      },
    ) =>
      new StackStxAuthCommand_Err(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        function (
          this: StackStxAuthCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            stacker.isStacking &&
            !stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "StackStxAuthCommand_Err_Stacking_Already_Stacked_1",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_STACKING_ALREADY_STACKED,
      )
    ),
    // StackStxAuthCommand_Err_Stacking_Already_Stacked_2
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
      },
    ) =>
      new StackStxAuthCommand_Err(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        function (
          this: StackStxAuthCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            stacker.isStacking &&
            stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "StackStxAuthCommand_Err_Stacking_Already_Stacked_2",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_STACKING_ALREADY_STACKED,
      )
    ),
    // StackStxAuthCommand_Err_Stacking_Already_Delegated
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
      },
    ) =>
      new StackStxAuthCommand_Err(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        function (
          this: StackStxAuthCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            !stacker.isStacking &&
            stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "StackStxAuthCommand_Err_Stacking_Already_Delegated",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_STACKING_ALREADY_DELEGATED,
      )
    ),
    // StackStxSigCommand_Err_Stacking_Already_Stacked_1
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
      },
    ) =>
      new StackStxSigCommand_Err(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        function (
          this: StackStxSigCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            stacker.isStacking &&
            !stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "StackStxSigCommand_Err_Stacking_Already_Stacked_1",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_STACKING_ALREADY_STACKED,
      )
    ),
    // StackStxSigCommand_Err_Stacking_Already_Stacked_2
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
      },
    ) =>
      new StackStxSigCommand_Err(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        function (
          this: StackStxSigCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            stacker.isStacking &&
            stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "StackStxSigCommand_Err_Stacking_Already_Stacked_2",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_STACKING_ALREADY_STACKED,
      )
    ),
    // StackStxSigCommand_Err_Stacking_Already_Delegated
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
      },
    ) =>
      new StackStxSigCommand_Err(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        function (
          this: StackStxSigCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            !stacker.isStacking &&
            stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "StackStxSigCommand_Err_Stacking_Already_Delegated",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_STACKING_ALREADY_DELEGATED,
      )
    ),
    // RevokeDelegateStxCommand_Err_Delegation_Already_Revoked
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
    }).map((
      r: {
        wallet: Wallet;
      },
    ) =>
      new RevokeDelegateStxCommand_Err(
        r.wallet,
        function (
          this: RevokeDelegateStxCommand_Err,
          model: Readonly<Stub>,
        ): boolean {
          const stacker = model.stackers.get(this.wallet.stxAddress)!;
          if (
            model.stackingMinimum > 0 &&
            !stacker.hasDelegated
          ) {
            model.trackCommandRun(
              "RevokeDelegateStxCommand_Err_Delegation_Already_Revoked",
            );
            return true;
          } else return false;
        },
        POX_4_ERRORS.ERR_DELEGATION_ALREADY_REVOKED,
      )
    ),
    // DelegateStxCommand_Err_Stacking_Already_Delegated
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      delegateTo: fc.constantFrom(...wallets.values()),
      untilBurnHt: fc.integer({ min: 1 }),
      amount: fc.bigInt({ min: 0n, max: 100_000_000_000_000n }),
    })
      .map((
        r: {
          wallet: Wallet;
          delegateTo: Wallet;
          untilBurnHt: number;
          amount: bigint;
        },
      ) =>
        new DelegateStxCommand_Err(
          r.wallet,
          r.delegateTo,
          r.untilBurnHt,
          r.amount,
          function (
            this: DelegateStxCommand_Err,
            model: Readonly<Stub>,
          ): boolean {
            const stacker = model.stackers.get(this.wallet.stxAddress)!;
            if (
              model.stackingMinimum > 0 &&
              stacker.hasDelegated
            ) {
              model.trackCommandRun(
                "DelegateStxCommand_Err_Stacking_Already_Delegated",
              );
              return true;
            } else return false;
          },
          POX_4_ERRORS.ERR_STACKING_ALREADY_DELEGATED,
        )
      ),
  ];

  return cmds;
}
