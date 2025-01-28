import {PokemonObject} from "../functions/pokemon.ts"
import {useEffect, useState} from "react"

export default function PokemonButton({pokemon, onChosenChange}: {
    pokemon: PokemonObject | null,
    onChosenChange: (_: PokemonObject) => void
}) {
    const [imageSize, setImageSize] = useState<number>(Math.min(window.innerWidth, window.innerHeight) / 2.1)

    function handleClick() {
        if (pokemon) {
            onChosenChange(pokemon)
        }
    }

    useEffect(() => {
        function handleSize() {
            setImageSize(Math.min(window.innerWidth, window.innerHeight) / 2.1)
        }

        window.addEventListener("resize", handleSize)
        return () => {
            window.removeEventListener("resize", handleSize)
        }
    }, [])

    return (
        <>
            {pokemon ?
                (<button className="inline" onClick={handleClick}>
                    <img src={import.meta.env.BASE_URL + "pokemon-images/" + pokemon.image + ".png"} alt={pokemon.name}
                         width={imageSize}
                         height={imageSize}/>
                    <h3>{pokemon.name}</h3>
                </button>)
                : (<></>)

            }
        </>
    )
}
