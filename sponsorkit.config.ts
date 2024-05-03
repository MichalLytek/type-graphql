import { BadgePreset, defineConfig } from "sponsorkit";

const presets = {
  past: {
    avatar: {
      size: 20,
    },
    boxWidth: 25,
    boxHeight: 25,
    container: {
      sidePadding: 30,
    },
  },
  backers: {
    avatar: {
      size: 30,
    },
    boxWidth: 35,
    boxHeight: 35,
    container: {
      sidePadding: 30,
    },
  },
  members: {
    avatar: {
      size: 45,
    },
    boxWidth: 55,
    boxHeight: 55,
    container: {
      sidePadding: 30,
    },
  },
  bronze: {
    avatar: {
      size: 75,
    },
    boxWidth: 90,
    boxHeight: 100,
    container: {
      sidePadding: 20,
    },
    name: {
      maxLength: 10,
    },
  },
  silver: {
    avatar: {
      size: 100,
    },
    boxWidth: 105,
    boxHeight: 125,
    container: {
      sidePadding: 20,
    },
    name: {
      maxLength: 16,
    },
  },
  gold: {
    avatar: {
      size: 150,
    },
    boxWidth: 175,
    boxHeight: 175,
    container: {
      sidePadding: 20,
    },
    name: {
      maxLength: 20,
    },
  },
} satisfies Record<string, BadgePreset>;

export default defineConfig({
  includePastSponsors: true,
  formats: ["svg"],
  github: {
    login: "TypeGraphQL",
    type: "organization",
  },
  // opencollective: {
  //   type: "collective",
  //   slug: "typegraphql",
  // },
  tiers: [
    {
      title: "Past Sponsors ⏳",
      monthlyDollars: -1,
      preset: presets.past,
    },
    {
      title: "Backers ☕",
      preset: presets.backers,
    },
    {
      title: "Members 💪",
      monthlyDollars: 15,
      preset: presets.members,
    },
    {
      title: "Bronze Sponsors 🥉",
      monthlyDollars: 50,
      preset: presets.bronze,
    },
    {
      title: "Silver Sponsors 🥈",
      monthlyDollars: 100,
      preset: presets.silver,
    },
    {
      title: "Gold Sponsors 🏆",
      monthlyDollars: 300,
      preset: presets.gold,
    },
  ],
});
