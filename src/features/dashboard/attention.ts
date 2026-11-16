import type { EntityStatus, RiskProfile } from "@/types/common";

import type { AttentionKind } from "./types";

/**
 * Equity share of a client's book, including cash.
 * A client outside the band is listed for review.
 */
export const equityBands: Record<RiskProfile, { min: number; max: number }> = {
  CONSERVATIVE: { min: 0, max: 40 },
  MODERATE: { min: 30, max: 70 },
  AGGRESSIVE: { min: 60, max: 100 },
};

const driftTolerance = 0.5;

export function attentionKind(input: {
  status: EntityStatus;
  riskProfile: RiskProfile;
  equityPercentage: number;
  returnPercentage: number;
}): { kind: AttentionKind; severity: number } | null {
  if (input.status === "INACTIVE") {
    return { kind: "inactive", severity: 100 };
  }

  const band = equityBands[input.riskProfile];
  const above = input.equityPercentage - band.max;
  const below = band.min - input.equityPercentage;
  const drift = Math.max(above, below, 0);
  const loss =
    input.returnPercentage < -0.05 ? Math.abs(input.returnPercentage) : 0;

  if (drift < driftTolerance && loss === 0) return null;

  if (drift >= driftTolerance && drift >= loss) {
    return {
      kind: above >= below ? "equity-high" : "equity-low",
      severity: drift,
    };
  }

  return { kind: "negative-return", severity: loss };
}
