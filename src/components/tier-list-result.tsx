import {useRef} from "react"
import {toPng} from "html-to-image"
import {logger} from "../functions/logger.ts"
import {PokemonObject} from "../functions/pokemon.ts"

export default function TierListResult({tierList, counter}: { tierList: PokemonObject[], counter: number }) {
    const imageRef = useRef<HTMLDivElement>(null)

    function handleClick() {
        if (imageRef.current) {
            toPng(imageRef.current, {backgroundColor: "#242424"}).then((dataUrl) => {
                const link = document.createElement("a")
                link.download = "pokemon-tier-list-image.png"
                link.href = dataUrl
                link.click()
            }).catch((err) => {
                logger(err, "warn")
            })
        }
    }

    return (
        <>
            <div ref={imageRef}>
                <h2>Your Tier List:</h2>
                {tierList.map((pokemon, index) =>
                    <div key={index + pokemon.id} className="inline">
                        <img src={import.meta.env.BASE_URL + "pokemon-images/" + pokemon.image + ".png"}
                             alt={pokemon.name} width="50px"
                             height="50px"/>
                        <p>{(index + 1) + ". " + pokemon.name}</p>
                    </div>
                )}
            </div>
            <p>Comparisons made: {counter}</p>
            <button onClick={handleClick}>Download Image</button>
        </>
    )
}
