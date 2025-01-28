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
    ["2", {mapId: "2", id: 2, name: "Ivysaur", image: "0002Ivysaur"}],
    ["3", {mapId: "3", id: 3, name: "Venusaur", image: "0003Venusaur"}],
    ["4", {mapId: "4", id: 4, name: "Charmander", image: "0004Charmander"}],
    ["5", {mapId: "5", id: 5, name: "Charmeleon", image: "0005Charmeleon"}],
    ["6", {mapId: "6", id: 6, name: "Charizard", image: "0006Charizard"}],
    ["7", {mapId: "7", id: 7, name: "Squirtle", image: "0007Squirtle"}],
    ["8", {mapId: "8", id: 8, name: "Wartortle", image: "0008Wartortle"}],
    ["9", {mapId: "9", id: 9, name: "Blastoise", image: "0009Blastoise"}],
    ["25", {mapId: "25", id: 25, name: "Pikachu", image: "0025Pikachu"}],
    ["133", {mapId: "133", id: 133, name: "Eevee", image: "0133Eevee"}]
])
