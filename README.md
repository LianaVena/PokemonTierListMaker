# Pokémon Tier List Maker

> WIP - Currently only contains 5 Pokémon

Creates a tier list by letting the user make a preference choice between pairs of Pokémon.

## Motivation

I didn't see anything like this already existing.
Closest is [Favorite Pokémon Chooser](https://quetzle.github.io/FavoritePokemon/) which only goes up to generation 6,
shows you 10 favorites and doesn't cache your progress.

I would like to mention other great "favorite Pokémon" websites:

- [TierMaker](https://tiermaker.com/create/every-pokmon-ever-fall-2020-all-dlc-601526) - lets you manually sort Pokémon
  into tiers
- [Ultimate Favorite Pokemon Picker](https://cajunavenger.github.io) - incredible table where user chooses their
  favorites based on types and generation
- [Favorite Pokémon Picker](https://www.dragonflycave.com/favorite.html) - lets user choose favorites and progressively
  limit them until the best one is chosen (can return multiple favorites and has many customization options)

## Algorithm

Pokémon are represented as a `PokeNode` that contains `node` - ID of Pokémon and `leaves` - array of nodes that are
considered worse by the user. At the beginning we load all Pokémon and create PokeNodes out of them with empty leaves.
They are then shuffled so that the pairs shown to the user are random.

1. A pair of PokeNodes is taken out of the beginning of the array.
2. After a user chooses their preference, the worse Pokémon is placed into the leaves of the better Pokémon and the
   better Pokémon is pushed to the end of the array.
3. This is repeated until there is only one PokeNode in the array.
4. That Pokémon is added to the tier list and its leaves create the new array.

## Planned features

- Cache state in browser
- Lets user set tiers
- Alternative lists (Mega Evolutions, only one generation...)

## Sources

Images sourced from [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page)

## Preview

![preview1](/public/preview1.png)
![preview2](/public/preview2.png)