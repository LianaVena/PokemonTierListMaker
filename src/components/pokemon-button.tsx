import {PokemonObject} from "../pokemon.ts"

export default function PokemonButton({pokemon, onChosenChange}: {
    pokemon: PokemonObject | null,
    onChosenChange: (pokemon: PokemonObject) => void
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
                (<button className="pokemon" onClick={handleClick}>
                    <img src={pokemon.imageUrl} alt={pokemon.name} width={imageSize} height={imageSize}/>
                    <h3>{pokemon.id + ". " + pokemon.name}</h3>
                </button>)
                : (<></>)

            }
        </>
    )
}
