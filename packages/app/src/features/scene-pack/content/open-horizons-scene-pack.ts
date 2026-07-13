import type { ImageAsset, ScenePackDefinition } from "../model.ts";

const assetBaseUrl = "https://pub-c650704a0a0344179ceaa6f95c731202.r2.dev";

function imageAsset(path: string, alt: string): ImageAsset {
  return {
    src: `${assetBaseUrl}/${path}`,
    alt,
    width: 1672,
    height: 941,
  };
}

export const openHorizonsPack = {
  id: "open-horizons",
  title: "Open Horizons",
  destinations: [
    {
      id: "mars-city",
      title: "Mars City",
      description:
        "A connected frontier settlement of industry, gardens, launch facilities, and dense city streets.",
      image: imageAsset(
        "maps/mars-city.png",
        "An illustrated overview of a connected city and industrial settlements across the Martian desert",
      ),
      spots: [
        {
          id: "open-pit-mine",
          title: "Open-Pit Mine",
          description: "A vast excavation ringed by refineries, rail lines, and processing plants.",
          position: { x: 0.79, y: 0.43 },
          scenes: [
            {
              id: "open-pit-mine-overlook",
              kind: "image",
              title: "Mine Overlook",
              description: "Watch the industrial complex work along the edge of the terraced pit.",
              media: imageAsset(
                "scenes/mars-city/open-pit-mine.png",
                "A large terraced Martian mine surrounded by refineries and a passing freight train",
              ),
            },
          ],
        },
        {
          id: "city-center",
          title: "City Center",
          description:
            "The settlement's busy circular core, built around a monumental central spire.",
          position: { x: 0.54, y: 0.73 },
          scenes: [
            {
              id: "city-center-overlook",
              kind: "image",
              title: "City Overlook",
              description: "Look across plazas, waterways, towers, and layered neighborhoods.",
              media: imageAsset(
                "scenes/mars-city/city-center.png",
                "A panoramic view over a dense circular Martian city with gardens and tall spires",
              ),
            },
          ],
        },
        {
          id: "spaceport",
          title: "Spaceport",
          description: "Launch towers, transit lines, and hangars connect the settlement to orbit.",
          position: { x: 0.19, y: 0.2 },
          scenes: [
            {
              id: "spaceport-launch-complex",
              kind: "image",
              title: "Launch Complex",
              description: "Settle beside the rail platforms while a rocket waits on the pad.",
              media: imageAsset(
                "scenes/mars-city/spaceport.png",
                "A rocket standing at a Martian spaceport surrounded by rail platforms and hangars",
              ),
            },
          ],
        },
        {
          id: "biodome-gardens",
          title: "Biodome Gardens",
          description: "A green district of glass domes, waterways, farms, and shaded paths.",
          position: { x: 0.46, y: 0.42 },
          scenes: [
            {
              id: "biodome-garden-overlook",
              kind: "image",
              title: "Garden Overlook",
              description:
                "Rest above the settlement's reservoirs, conservatories, and cultivated terraces.",
              media: imageAsset(
                "scenes/mars-city/biodome-gardens.png",
                "A lush Martian garden district filled with glass biodomes, pools, and cultivated terraces",
              ),
            },
          ],
        },
      ],
    },
    {
      id: "habitat-home",
      title: "Habitat Home",
      description:
        "A compact Martian home with warm rooms for resting, cooking, creating, and watching the city beyond.",
      image: imageAsset(
        "maps/habitat-home.png",
        "A cutaway illustration of a compact two-level home on Mars",
      ),
      spots: [
        {
          id: "living-room",
          title: "Living Room",
          description: "A curved sofa and broad window make a quiet place to slow down.",
          position: { x: 0.74, y: 0.68 },
          scenes: [
            {
              id: "living-room-journal",
              kind: "image",
              title: "Window Journal",
              description: "Write beside the window as evening settles over the city.",
              media: imageAsset(
                "scenes/habitat-home/living-room-1.png",
                "A person writing on a curved sofa beside a large window overlooking the Martian city",
              ),
            },
            {
              id: "living-room-rest",
              kind: "image",
              title: "Evening Rest",
              description: "Stretch out on the sofa and watch the distant skyline.",
              media: imageAsset(
                "scenes/habitat-home/living-room-2.png",
                "A person resting on a curved sofa beside a panoramic window over the Martian city",
              ),
            },
          ],
        },
        {
          id: "kitchen",
          title: "Kitchen",
          description: "A small galley kitchen gathered around a table for two.",
          position: { x: 0.5, y: 0.68 },
          scenes: [
            {
              id: "kitchen-meal",
              kind: "image",
              title: "Quiet Meal",
              description: "Take a seat for a simple meal after a long day outside.",
              media: imageAsset(
                "scenes/habitat-home/kitchen-1.png",
                "A person seated at a round table in a warm compact habitat kitchen",
              ),
            },
            {
              id: "kitchen-preparation",
              kind: "image",
              title: "Kitchen Routine",
              description: "Prepare something warm at the table beneath the galley lights.",
              media: imageAsset(
                "scenes/habitat-home/kitchen-2.png",
                "A person preparing food at a round table in a compact Martian kitchen",
              ),
            },
          ],
        },
        {
          id: "studio",
          title: "Studio",
          description:
            "Cameras, sketches, and collected field notes fill a working corner of the home.",
          position: { x: 0.72, y: 0.31 },
          scenes: [
            {
              id: "studio-sketch",
              kind: "image",
              title: "Field Sketch",
              description: "Develop a new landscape study at the drawing desk.",
              media: imageAsset(
                "scenes/habitat-home/studio-1.png",
                "A person drawing a Martian landscape in a studio filled with cameras and field photographs",
              ),
            },
            {
              id: "studio-camera",
              kind: "image",
              title: "Camera Setup",
              description: "Adjust the camera and prepare to document another expedition.",
              media: imageAsset(
                "scenes/habitat-home/studio-2.png",
                "A person adjusting a camera on a tripod in a warm, equipment-filled studio",
              ),
            },
          ],
        },
        {
          id: "bedroom",
          title: "Bedroom",
          description: "A sheltered sleeping nook looks out across the red landscape.",
          position: { x: 0.34, y: 0.3 },
          scenes: [
            {
              id: "bedroom-reading",
              kind: "image",
              title: "Morning Reading",
              description: "Read on the bed while soft light reaches through the window.",
              media: imageAsset(
                "scenes/habitat-home/bedroom-1.png",
                "A person reading on a bed beside a round window overlooking the Martian landscape",
              ),
            },
            {
              id: "bedroom-packing",
              kind: "image",
              title: "Packing Up",
              description: "Gather supplies beside the bed before heading outside.",
              media: imageAsset(
                "scenes/habitat-home/bedroom-2.png",
                "A person packing supplies beside a bed in a compact Martian bedroom",
              ),
            },
          ],
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;
