import {useRef, useState} from "react"
import {toPng} from "html-to-image"
import {logger} from "../functions/logger.ts"
import {PokemonObject} from "../functions/pokemon.ts"

export default function TierListResult({tierList, counter}: { tierList: PokemonObject[], counter: number }) {
    const [show, setShow] = useState(false)
    const imageRef = useRef<HTMLDivElement>(null)

    async function handleClick() {
        setShow(true)
        setTimeout(async () => {
            if (imageRef.current) {
                try {
                    const image = await toPng(imageRef.current, {backgroundColor: "#242424"})
                    const link = document.createElement("a")
                    link.download = "pokemon-tier-list-image.png"
                    link.href = image
                    link.click()
                } catch (error) {
                    logger("Could not generate image. " + error, "error")
                } finally {
                    setShow(false)
                }
            }
        }, 0)
    }

    return (
        <>
            <div>
                <h2>Your Tier List:</h2>
                {tierList.map((pokemon, index) =>
                    <div key={index * 10000 + pokemon.id} className="inline">
                        <img src={import.meta.env.BASE_URL + "pokemon-images/" + pokemon.image + ".png"}
                             alt={pokemon.name} width="50px"
                             height="50px"/>
                        <p>{(index + 1) + ". " + pokemon.name}</p>
                    </div>
                )}
            </div>
            <p>Comparisons made: {counter}</p>
            <button onClick={handleClick}>Download Image</button>
            {show &&
                <div ref={imageRef}>
                    <h2>My favorite Pokémon</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(10, max-content)`,
                        justifyContent: "center",
                        width: "auto"
                    }}>
                        {tierList.map((pokemon, index) =>
                            <div key={index * 10000 + pokemon.id} className="inline">
                                <img src={import.meta.env.BASE_URL + "pokemon-images/" + pokemon.image + ".png"}
                                     alt={pokemon.name} width="50px"
                                     height="50px"/>
                                <p>{(index + 1) + ". " + pokemon.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}
