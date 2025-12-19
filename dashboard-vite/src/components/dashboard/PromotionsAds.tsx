import { AddOnMarketplace } from "./AddOnMarketplace";

export function PromotionsAds() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Promotions & Ads</h2>
          <p className="text-slate-400 text-sm">Manage your visibility campaigns and ranking boosts.</p>
        </div>
      </div>

      {/* Add-Ons Marketplace (Extensions & Boosts) */}
      <div className="pt-0">
         <h3 className="text-xl font-bold text-white mb-6">Boost Your Ranking</h3>
         <AddOnMarketplace />
      </div>
    </div>
  );
}
