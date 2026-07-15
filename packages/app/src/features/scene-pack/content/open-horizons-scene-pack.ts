import type { ImageAssetDefinition, LocalizedText, ScenePackDefinition } from "../model.ts";

const assetBaseUrl = "https://pub-c650704a0a0344179ceaa6f95c731202.r2.dev";

function text(en: string, zhCN: string): LocalizedText {
  return { en, "zh-CN": zhCN };
}

function imageAsset(path: string): ImageAssetDefinition {
  return {
    src: `${assetBaseUrl}/${path}`,
  };
}

export const openHorizonsPack = {
  id: "open-horizons",
  locales: ["en", "zh-CN"],
  title: text("Open Horizons", "开阔地平线"),
  destinations: [
    {
      id: "mars-city",
      title: text("Mars City", "火星城"),
      description: text(
        "A connected frontier settlement of industry, gardens, launch facilities, and dense city streets.",
        "一座由工业区、花园、发射设施和密集街道相连的边疆聚居地。",
      ),
      image: imageAsset("maps/mars-city.png"),
      spots: [
        {
          id: "open-pit-mine",
          title: text("Open-Pit Mine", "露天矿场"),
          description: text(
            "A vast excavation ringed by refineries, rail lines, and processing plants.",
            "巨大的矿坑四周环绕着精炼厂、铁路和加工设施。",
          ),
          position: { x: 0.79, y: 0.43 },
          scenes: [
            {
              id: "open-pit-mine-overlook",
              kind: "image",
              title: text("Mine Overlook", "矿场眺望台"),
              description: text(
                "Watch the industrial complex work along the edge of the terraced pit.",
                "眺望阶梯矿坑边缘持续运转的工业设施。",
              ),
              media: imageAsset("scenes/mars-city/open-pit-mine.png"),
            },
          ],
        },
        {
          id: "city-center",
          title: text("City Center", "城市中心"),
          description: text(
            "The settlement's busy circular core, built around a monumental central spire.",
            "聚居地繁忙的环形核心区，围绕宏伟的中央尖塔而建。",
          ),
          position: { x: 0.54, y: 0.73 },
          scenes: [
            {
              id: "city-center-overlook",
              kind: "image",
              title: text("City Overlook", "城市眺望台"),
              description: text(
                "Look across plazas, waterways, towers, and layered neighborhoods.",
                "俯瞰广场、水道、高塔与层叠的街区。",
              ),
              media: imageAsset("scenes/mars-city/city-center.png"),
            },
          ],
        },
        {
          id: "spaceport",
          title: text("Spaceport", "太空港"),
          description: text(
            "Launch towers, transit lines, and hangars connect the settlement to orbit.",
            "发射塔、交通线和机库将聚居地与轨道相连。",
          ),
          position: { x: 0.19, y: 0.2 },
          scenes: [
            {
              id: "spaceport-launch-complex",
              kind: "image",
              title: text("Launch Complex", "发射中心"),
              description: text(
                "Settle beside the rail platforms while a rocket waits on the pad.",
                "在铁路站台旁稍作停留，看火箭静候发射。",
              ),
              media: imageAsset("scenes/mars-city/spaceport.png"),
            },
          ],
        },
        {
          id: "biodome-gardens",
          title: text("Biodome Gardens", "生态穹顶花园"),
          description: text(
            "A green district of glass domes, waterways, farms, and shaded paths.",
            "由玻璃穹顶、水道、农场和林荫小径组成的绿色街区。",
          ),
          position: { x: 0.46, y: 0.42 },
          scenes: [
            {
              id: "biodome-garden-overlook",
              kind: "image",
              title: text("Garden Overlook", "花园眺望台"),
              description: text(
                "Rest above the settlement's reservoirs, conservatories, and cultivated terraces.",
                "在聚居地的蓄水池、温室和种植梯田上方休憩。",
              ),
              media: imageAsset("scenes/mars-city/biodome-gardens.png"),
            },
          ],
        },
      ],
    },
    {
      id: "habitat-home",
      title: text("Habitat Home", "栖居之家"),
      description: text(
        "A compact Martian home with warm rooms for resting, cooking, creating, and watching the city beyond.",
        "一座紧凑温暖的火星住宅，可以休息、烹饪、创作，也能遥望远方的城市。",
      ),
      image: imageAsset("maps/habitat-home.png"),
      spots: [
        {
          id: "living-room",
          title: text("Living Room", "客厅"),
          description: text(
            "A curved sofa and broad window make a quiet place to slow down.",
            "弧形沙发和宽阔窗户围成一处让人慢下来的安静角落。",
          ),
          position: { x: 0.74, y: 0.68 },
          scenes: [
            {
              id: "living-room-journal",
              kind: "image",
              title: text("Window Journal", "窗边手记"),
              description: text(
                "Write beside the window as evening settles over the city.",
                "当暮色落在城市上空，在窗边静静书写。",
              ),
              media: imageAsset("scenes/habitat-home/living-room-1.png"),
            },
            {
              id: "living-room-rest",
              kind: "image",
              title: text("Evening Rest", "晚间小憩"),
              description: text(
                "Stretch out on the sofa and watch the distant skyline.",
                "舒展地躺在沙发上，凝望远处的城市天际线。",
              ),
              media: imageAsset("scenes/habitat-home/living-room-2.png"),
            },
          ],
        },
        {
          id: "kitchen",
          title: text("Kitchen", "厨房"),
          description: text(
            "A small galley kitchen gathered around a table for two.",
            "一间围绕双人餐桌布置的小型走廊式厨房。",
          ),
          position: { x: 0.5, y: 0.68 },
          scenes: [
            {
              id: "kitchen-meal",
              kind: "image",
              title: text("Quiet Meal", "静谧一餐"),
              description: text(
                "Take a seat for a simple meal after a long day outside.",
                "结束漫长的外出后，坐下来享用一顿简单的饭食。",
              ),
              media: imageAsset("scenes/habitat-home/kitchen-1.png"),
            },
            {
              id: "kitchen-preparation",
              kind: "image",
              title: text("Kitchen Routine", "厨房日常"),
              description: text(
                "Prepare something warm at the table beneath the galley lights.",
                "在厨房灯光下的餐桌旁准备一些温暖的食物。",
              ),
              media: imageAsset("scenes/habitat-home/kitchen-2.png"),
            },
          ],
        },
        {
          id: "studio",
          title: text("Studio", "工作室"),
          description: text(
            "Cameras, sketches, and collected field notes fill a working corner of the home.",
            "相机、速写和收集来的野外笔记填满了家中的工作角落。",
          ),
          position: { x: 0.72, y: 0.31 },
          scenes: [
            {
              id: "studio-sketch",
              kind: "image",
              title: text("Field Sketch", "野外速写"),
              description: text(
                "Develop a new landscape study at the drawing desk.",
                "在绘图桌前展开一幅新的风景习作。",
              ),
              media: imageAsset("scenes/habitat-home/studio-1.png"),
            },
            {
              id: "studio-camera",
              kind: "image",
              title: text("Camera Setup", "调试相机"),
              description: text(
                "Adjust the camera and prepare to document another expedition.",
                "调整相机，为记录下一次远行做好准备。",
              ),
              media: imageAsset("scenes/habitat-home/studio-2.png"),
            },
          ],
        },
        {
          id: "bedroom",
          title: text("Bedroom", "卧室"),
          description: text(
            "A sheltered sleeping nook looks out across the red landscape.",
            "一处安稳的睡眠角落，窗外铺展着红色大地。",
          ),
          position: { x: 0.34, y: 0.3 },
          scenes: [
            {
              id: "bedroom-reading",
              kind: "image",
              title: text("Morning Reading", "晨间阅读"),
              description: text(
                "Read on the bed while soft light reaches through the window.",
                "柔和的光线穿过窗户，在床上安静阅读。",
              ),
              media: imageAsset("scenes/habitat-home/bedroom-1.png"),
            },
            {
              id: "bedroom-packing",
              kind: "image",
              title: text("Packing Up", "整理行装"),
              description: text(
                "Gather supplies beside the bed before heading outside.",
                "出门前在床边收拾好所需物资。",
              ),
              media: imageAsset("scenes/habitat-home/bedroom-2.png"),
            },
          ],
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;
