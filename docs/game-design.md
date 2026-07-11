# Game Design Overview

> **Status:** Early design. The game systems described here are not implemented yet. The repository currently contains a cross-platform persistence demo for the web and desktop applications.

## Vision

Over Yonder is envisioned as a desktop companion and idle game. It should provide a persistent, atmospheric scene that can stay open alongside the player's daily activities. The experience centers on exploring maps, choosing a location, and settling into an ambient scene.

The current design uses the following references:

| Area                 | Direction              |
| -------------------- | ---------------------- |
| Experience reference | _Ithya: Magic Studies_ |
| Visual direction     | Moebius-inspired art   |

These references communicate the intended experience and visual tone; they do not imply feature parity.

## Content Model

Game content is organized as a hierarchy. Each parent can contain multiple children:

```mermaid
flowchart LR
    Game["Game"] -->|contains many| Map["Map"]
    Map -->|contains many| Coordinate["Coordinate"]
    Coordinate -->|offers many| Scene["Scene"]
```

| Term       | Meaning                                                                    |
| ---------- | -------------------------------------------------------------------------- |
| Game       | The application and top-level container for all available maps.            |
| Map        | An image-based overview that contains coordinate markers.                  |
| Coordinate | A selectable location rendered on a map.                                   |
| Scene      | An ambient experience available at a coordinate.                           |
| Scene Pack | Configuration and related assets describing maps, coordinates, and scenes. |

The hierarchy describes the product model, not a concrete storage schema.

## Scene Packs

A Scene Pack groups the configuration and assets required to present its maps, coordinates, and scenes. The design should support:

- Official maps included with or distributed by the game.
- Downloaded third-party maps.
- User-created content.

The package format, validation rules, compatibility policy, and installation flow have not been defined yet.

## Scene Media

Each scene references exactly one visual media file:

- An **Image Scene** displays a single image.
- A **Video Scene** displays a single video.

Scenes do not combine multiple visual layers or contain scripts, state machines, interactive hotspots, or other executable behavior. Details such as video autoplay, looping, and muting are implementation concerns and are not defined by this design.

## Basic Player Flow

1. The player opens the game and chooses an available map.
2. The selected map is displayed as an image.
3. The game renders coordinate markers over the map.
4. Selecting a coordinate opens a scene-selection drawer.
5. The player chooses one of the scenes available at that coordinate.
6. The selected scene becomes the main desktop companion view.
7. To choose another map, coordinate, or scene, the player returns to the map and follows the same selection flow again.

This flow establishes navigation between content. It does not yet define progression, unlock requirements, or rewards.

## Scene Interface

The scene view is the primary idle and companion surface. It has two responsibilities:

- Display the scene's image or video.
- Let the player return to the current map.

The scene view does not provide direct map or scene selection. Those choices are made through the map and coordinate flow.

## Out of Scope

The following systems are outside the current baseline and must not be assumed to exist:

- Scene variants, including weather or time-of-day changes.
- TODO lists, timers, or other productivity tools.
- Background music or ambient audio systems.
- Playback, pause, progress, or volume controls.
- Victory, failure, or completion conditions.
- Player progression or long-term growth.
- Economy, currencies, or resource management.
- Combat or other challenge systems.
- Layered scenes, scripts, state machines, or interactive hotspots.
- A concrete Scene Pack file format or runtime API.
- Save-game structure and cross-platform compatibility rules.

These areas should be documented when their product requirements are defined.
