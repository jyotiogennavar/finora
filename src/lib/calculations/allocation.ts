import type { AllocationItem } from "@/features/analytics/types";
import type { Asset, Holding } from "@/features/portfolios/types";
import type { AssetClass } from "@/types/common";

export function calculateAllocation(
  holdings: Holding[],
  assets: Asset[],
  cashBalance = 0
): AllocationItem[] {
  const assetMap = new Map(assets.map((asset) => [asset.id, asset]));

  const allocation = new Map<AssetClass, number>();

  for (const holding of holdings) {
    const asset = assetMap.get(holding.assetId);

    if (!asset) continue;

    const value = holding.quantity * holding.currentPrice;

    allocation.set(
      asset.assetClass,
      (allocation.get(asset.assetClass) ?? 0) + value
    );
  }

  if (cashBalance > 0) {
    allocation.set("CASH", (allocation.get("CASH") ?? 0) + cashBalance);
  }

  const totalValue = [...allocation.values()].reduce(
    (total, value) => total + value,
    0
  );

  if (totalValue <= 0) return [];

  return [...allocation.entries()]
    .map(([assetClass, value]) => ({
      assetClass,
      value,
      percentage: (value / totalValue) * 100,
    }))
    .sort((a, b) => b.value - a.value);
}
