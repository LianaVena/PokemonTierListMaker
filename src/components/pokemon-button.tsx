import {PokemonObject} from "../functions/pokemon.ts"

export default function PokemonButton({pokemon, onChosenChange}: {
    pokemon: PokemonObject | null,
    onChosenChange: (_: PokemonObject) => void
}) {
    const imageSize = Math.min(window.innerWidth, window.innerHeight) / 2

    function handleClick() {
        if (pokemon) {
            onChosenChange(pokemon)
        }
    }

    return (
        <>
            {pokemon ?
                (<button className="inline" onClick={handleClick}>
                    <img src={pokemon.imageUrl} alt={pokemon.name} width={imageSize} height={imageSize}/>
                    <h3>{pokemon.id + ". " + pokemon.name}</h3>
                </button>)
                : (<></>)

            }
        </>
    )
}
