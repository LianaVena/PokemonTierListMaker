import {PokemonObject} from "../functions/pokemon.ts"

export default function PokemonButton({pokemon, onChosenChange}: {
    pokemon: PokemonObject | null,
    onChosenChange: (_: PokemonObject) => void
}) {
    function handleClick() {
        if (pokemon) {
            onChosenChange(pokemon)
        }
    }

    return (
        <>
            {pokemon &&
                <button className="inline" onClick={handleClick}>
                    <img className="pokemon-image"
                         src={import.meta.env.BASE_URL + "pokemon-images/" + pokemon.image + ".png"}
                         alt={pokemon.name}/>
                    <h3>{pokemon.name}</h3>
                </button>
            }
        </>
    )
}
