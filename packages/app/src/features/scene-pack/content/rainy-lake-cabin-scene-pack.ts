import type { LocalizedText, ScenePackDefinition } from "../model.ts";

const assetBaseUrl = "https://pub-c650704a0a0344179ceaa6f95c731202.r2.dev";

function text(en: string, zhCN: string): LocalizedText {
  return { en, "zh-CN": zhCN };
}

export const rainyLakeCabinPack = {
  id: "rainy-lake-cabin",
  locales: ["en", "zh-CN"],
  title: text("Rainy Lake Cabin", "雨湖小屋"),
  destinations: [
    {
      id: "rainy-lake-cabin",
      title: text("Rainy Lake Cabin", "雨湖小屋"),
      description: text(
        "A warm timber retreat tucked between a quiet lake and rain-soaked forest.",
        "一间坐落在静谧湖泊与雨林之间的温暖木屋。",
      ),
      image: {
        src: `${assetBaseUrl}/maps/rainy-lake-cabin.webp`,
      },
      spots: [
        {
          id: "rainy-lake-cabin-living-room",
          title: text("Lakeside Living Room", "临湖客厅"),
          description: text(
            "A music-filled living room overlooking the lake through broad glass walls.",
            "一间充满音乐气息的客厅，透过宽阔玻璃幕墙可以眺望湖面。",
          ),
          position: { x: 0.43, y: 0.39 },
          scenes: [
            {
              id: "rainy-lake-cabin-living-room-rain",
              kind: "video",
              title: text("Rain by the Lake", "湖畔听雨"),
              description: text(
                "Settle beside the stove while rain drifts across the lake and forest.",
                "在炉火旁静坐，看雨幕掠过湖面与森林。",
              ),
              media: {
                src: `${assetBaseUrl}/scenes/rainy-lake-cabin/living-room.mp4`,
                label: text(
                  "A warm living room overlooking a rainy mountain lake",
                  "一间俯瞰雨中山湖的温暖客厅",
                ),
                poster: {
                  src: `${assetBaseUrl}/maps/rainy-lake-cabin.webp`,
                },
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;
