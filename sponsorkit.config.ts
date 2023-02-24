import { defineConfig, presets } from "sponsorkit";

export default defineConfig({
  tiers: [
    {
      title: "Past Sponsors",
      monthlyDollars: -1,
      preset: presets.xs,
    },
    {
      title: "Backers",
      preset: presets.small,
    },
    {
      title: "Sponsors",
      monthlyDollars: 10,
      preset: presets.base,
    },
    {
      title: "Bronze Sponsors",
      monthlyDollars: 50,
      preset: presets.medium,
    },
    {
      title: "Silver Sponsors",
      monthlyDollars: 100,
      preset: presets.large,
    },
    {
      title: "Gold Sponsors",
      monthlyDollars: 500,
      preset: presets.xl,
    },
  ],
});
