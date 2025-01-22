export interface PokemonObject {
    id: number
    name: string
    imageUrl: string
}

export const allPokemonInput = new Map<number, PokemonObject>([
    [1, {id: 1, name: "Bulbasaur", imageUrl: "https://archives.bulbagarden.net/media/upload/f/fb/0001Bulbasaur.png"}],
    [4, {id: 4, name: "Charmander", imageUrl: "https://archives.bulbagarden.net/media/upload/2/27/0004Charmander.png"}],
    [7, {id: 7, name: "Squirtle", imageUrl: "https://archives.bulbagarden.net/media/upload/5/54/0007Squirtle.png"}],
    [25, {id: 25, name: "Pikachu", imageUrl: "https://archives.bulbagarden.net/media/upload/4/4a/0025Pikachu.png"}],
    [133, {id: 133, name: "Eevee", imageUrl: "https://archives.bulbagarden.net/media/upload/4/4c/0133Eevee.png"}]
])