import PokemonButton from "./pokemon-button.tsx"
import {PokemonObject} from "../pokemon.ts"

export default function PairChooser({pokemon1, pokemon2, onChosenChange}: {
    pokemon1: PokemonObject | null,
    pokemon2: PokemonObject | null,
    onChosenChange: (pokemon: PokemonObject) => void
}) {
    return (
        <>
            <h2>Choose which you prefer:</h2>
            <PokemonButton pokemon={pokemon1} onChosenChange={onChosenChange}></PokemonButton>
            <PokemonButton pokemon={pokemon2} onChosenChange={onChosenChange}></PokemonButton>
        </>
    )
}