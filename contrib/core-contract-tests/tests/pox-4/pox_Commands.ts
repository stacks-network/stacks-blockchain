import fc from "fast-check";
import { Real, Stub, StxAddress, Wallet } from "./pox_CommandModel";
import { GetStackingMinimumCommand } from "./pox_GetStackingMinimumCommand";
import { GetStxAccountCommand } from "./pox_GetStxAccountCommand";
import { StackStxCommand } from "./pox_StackStxCommand";
import { DelegateStxCommand } from "./pox_DelegateStxCommand";
import { DelegateStackStxCommand } from "./pox_DelegateStackStxCommand";
import { Simnet } from "@hirosystems/clarinet-sdk";
import { Cl, cvToValue, OptionalCV, UIntCV } from "@stacks/transactions";
import { RevokeDelegateStxCommand } from "./pox_RevokeDelegateStxCommand";
import { AllowContractCallerCommand } from "./pox_AllowContractCallerCommand";
import { DelegateStackIncreaseCommand } from "./pox_DelegateStackIncreaseCommand";

export function PoxCommands(
  wallets: Map<StxAddress, Wallet>,
  network: Simnet,
): fc.Arbitrary<Iterable<fc.Command<Stub, Real>>> {
  const cmds = [
    // GetStackingMinimumCommand
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
    }).map((
      r: {
        wallet: Wallet;
      },
    ) =>
      new GetStackingMinimumCommand(
        r.wallet,
      )
    ),
    // StackStxCommand
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      authId: fc.nat(),
      period: fc.integer({ min: 1, max: 12 }),
      margin: fc.integer({ min: 1, max: 9 }),
      currentCycle: fc.constant(currentCycle(network)),
    }).map((
      r: {
        wallet: Wallet;
        authId: number;
        period: number;
        margin: number;
        currentCycle: number;
      },
    ) =>
      new StackStxCommand(
        r.wallet,
        r.authId,
        r.period,
        r.margin,
        r.currentCycle,
      )
    ),
    // DelegateStxCommand
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      delegateTo: fc.constantFrom(...wallets.values()),
      untilBurnHt: fc.integer({ min: 1 }),
      amount: fc.bigInt({ min: 0n, max: 100_000_000_000_000n }),
    }).map((
      r: {
        wallet: Wallet;
        delegateTo: Wallet;
        untilBurnHt: number;
        amount: bigint;
      },
    ) =>
      new DelegateStxCommand(
        r.wallet,
        r.delegateTo,
        r.untilBurnHt,
        r.amount,
      )
    ),
    // RevokeDelegateStxCommand
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
    }).map((
      r: {
        wallet: Wallet;
      },
    ) =>
      new RevokeDelegateStxCommand(
        r.wallet,
      )
    ),
    // DelegateStackStxCommand
    fc.record({
      operator: fc.constantFrom(...wallets.values()),
      startBurnHt: fc.integer({
        min: currentCycleFirstBlock(network),
        max: nextCycleFirstBlock(network),
      }),
      period: fc.integer({ min: 1, max: 12 }),
    }).chain((r) => {
      // Determine available stackers based on the operator
      const availableStackers = r.operator.poolMembers.length > 0
        ? r.operator.poolMembers
        : [r.operator.stxAddress];

      return fc.record({
        stacker: fc.constantFrom(...availableStackers),
      }).map((stacker) => ({
        ...r,
        stacker: wallets.get(stacker.stacker)!,
      })).chain((resultWithStacker) => {
        return fc.record({
          unlockBurnHt: fc.constant(
            currentCycleFirstBlock(network) +
              1050 * (resultWithStacker.period + 1),
          ),
        }).map((additionalProps) => ({
          ...resultWithStacker,
          ...additionalProps,
        }));
      }).chain((resultWithUnlockHeight) => {
        return fc.record({
          amount: fc.bigInt({
            min: 0n,
            max: BigInt(resultWithUnlockHeight.stacker.delegatedMaxAmount),
          }),
        }).map((amountProps) => ({
          ...resultWithUnlockHeight,
          ...amountProps,
        }));
      });
    }).map((finalResult) => {
      return new DelegateStackStxCommand(
        finalResult.operator,
        finalResult.stacker,
        finalResult.startBurnHt,
        finalResult.period,
        finalResult.amount,
        finalResult.unlockBurnHt,
      );
    }),
    // DelegateStackIncreaseCommand
    fc.record({
      operator: fc.constantFrom(...wallets.values()),
      stacker: fc.constantFrom(...wallets.values()),
      increaseBy: fc.bigInt({ min: 0n, max: 100_000_000_000_000n }),
    }).chain((r) => {
      const availableStackers = r.operator.poolMembers.length > 0
        ? r.operator.poolMembers
        : [r.operator.stxAddress];

      return fc.record({
        stacker: fc.constantFrom(...availableStackers),
      }).map((stacker) => ({
        ...r,
        stacker: wallets.get(stacker.stacker)!,
      }));
    }).map((final) => {
      return new DelegateStackIncreaseCommand(
        final.operator,
        final.stacker,
        final.increaseBy,
      );
    }),
    // AllowContractCallerCommand
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
      allowanceTo: fc.constantFrom(...wallets.values()),
      alllowUntilBurnHt: fc.oneof(
        fc.constant(Cl.none()),
        fc.integer({ min: 1 }).map((value) => Cl.some(Cl.uint(value))),
      ),
    })
      .map(
        (r: {
          wallet: Wallet;
          allowanceTo: Wallet;
          alllowUntilBurnHt: OptionalCV<UIntCV>;
        }) =>
          new AllowContractCallerCommand(
            r.wallet,
            r.allowanceTo,
            r.alllowUntilBurnHt,
          ),
      ),
    // GetStxAccountCommand
    fc.record({
      wallet: fc.constantFrom(...wallets.values()),
    }).map((
      r: {
        wallet: Wallet;
      },
    ) =>
      new GetStxAccountCommand(
        r.wallet,
      )
    ),
  ];

  // More on size: https://github.com/dubzzz/fast-check/discussions/2978
  // More on cmds: https://github.com/dubzzz/fast-check/discussions/3026
  return fc.commands(cmds, { size: "large" });
}

const currentCycle = (network: Simnet) =>
  Number(cvToValue(
    network.callReadOnlyFn(
      "ST000000000000000000002AMW42H.pox-4",
      "current-pox-reward-cycle",
      [],
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    ).result,
  ));

export const currentCycleFirstBlock = (network: Simnet) =>
  Number(cvToValue(
    network.callReadOnlyFn(
      "ST000000000000000000002AMW42H.pox-4",
      "reward-cycle-to-burn-height",
      [Cl.uint(currentCycle(network))],
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    ).result,
  ));

const nextCycleFirstBlock = (network: Simnet) =>
  Number(cvToValue(
    network.callReadOnlyFn(
      "ST000000000000000000002AMW42H.pox-4",
      "reward-cycle-to-burn-height",
      [Cl.uint(currentCycle(network) + 1)],
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    ).result,
  ));
