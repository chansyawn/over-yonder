import type { LocalizedText, ScenePackDefinition } from "../model.ts";

const assetBaseUrl = "https://pub-c650704a0a0344179ceaa6f95c731202.r2.dev";
const destinationPath = `${assetBaseUrl}/packs/official/destinations/7Yp3mK9Qa2Xv`;
const scenePath = `${destinationPath}/scenes/3nT7cQ5yV9Lm`;

function text(en: string, zhCN: string): LocalizedText {
  return { en, "zh-CN": zhCN };
}

export const rainyLakeCabinPack = {
  id: "official",
  locales: ["en", "zh-CN"],
  title: text("Rainy Lake Cabin", "雨湖小屋"),
  destinations: [
    {
      id: "7Yp3mK9Qa2Xv",
      title: text("Rainy Lake Cabin", "雨湖小屋"),
      description: text(
        "A warm timber retreat tucked between a quiet lake and rain-soaked forest.",
        "一间坐落在静谧湖泊与雨林之间的温暖木屋。",
      ),
      image: {
        src: `${destinationPath}/map.webp`,
      },
      scenes: [
        {
          id: "3nT7cQ5yV9Lm",
          kind: "video",
          title: text("Rain by the Lake", "湖畔听雨"),
          description: text(
            "Settle beside the stove while rain drifts across the lake and forest.",
            "在炉火旁静坐，看雨幕掠过湖面与森林。",
          ),
          position: { x: 0.43, y: 0.39 },
          media: {
            src: `${scenePath}/media.mp4`,
            label: text(
              "A warm living room overlooking a rainy mountain lake",
              "一间俯瞰雨中山湖的温暖客厅",
            ),
            poster: {
              src: `${scenePath}/poster.webp`,
            },
          },
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;
