# Pokémon Tier List Maker

> WIP - Currently only contains 11 Pokémon

Creates a tier list by letting the user make a preference choice between pairs of Pokémon.

## Motivation

I wanted to be able to create a tier list of all Pokémon in a simpler way than manually sorting them. There are some
websites with similar functionality, but I decided to make my own to satisfy all my requirements.

Similar websites:

- [Ultimate Favorite Pokemon Picker](https://cajunavenger.github.io) - Incredible table where user chooses their
  favorites based on types and generation (Really fun!)
- [Favorite Pokémon Picker](https://www.dragonflycave.com/favorite.html) - Closest to my functionality thanks to many
  customization options. Lets user choose favorites and progressively limit them until the best one is chosen
- [TierMaker](https://tiermaker.com/create/every-pokmon-ever-fall-2020-all-dlc-601526) - Lets user manually sort Pokémon
  into tiers
- [Favorite Pokémon Chooser](https://quetzle.github.io/FavoritePokemon/) - Only goes up to generation 6 and shows you 10
  favorites

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

- Alternative lists (Mega Evolutions, only one generation...)

## Sources

Images sourced from [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page)

## Preview

![preview1](/public/preview1.png)
![preview2](/public/preview2.png)
![result](/public/result.png)