export function getPokemonById(id: string) {
    return allPokemonInput.get(id)
}

export function getPokemonNameById(id: string) {
    const pokemon = allPokemonInput.get(id)
    if (pokemon) {
        return pokemon.name
    }
    return ""
}

export interface PokemonObject {
    mapId: string
    id: number
    name: string
    image: string
}

export const allPokemonInput = new Map<string, PokemonObject>([
    ["1", {mapId: "1", id: 1, name: "Bulbasaur", image: "0001Bulbasaur"}],
    ["4", {mapId: "4", id: 4, name: "Charmander", image: "0004Charmander"}],
    ["7", {mapId: "7", id: 7, name: "Squirtle", image: "0007Squirtle"}],
    ["25", {mapId: "25", id: 25, name: "Pikachu", image: "0025Pikachu"}],
    ["133", {mapId: "133", id: 133, name: "Eevee", image: "0133Eevee"}]
])
