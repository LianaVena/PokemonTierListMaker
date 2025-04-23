import {useRef, useState} from "react"
import {toPng} from "html-to-image"
import {logger} from "../functions/logger.ts"
import {PokemonObject} from "../functions/pokemon.ts"
import {Tier} from "./tier-list-maker.tsx"
import TierListDisplay from "./tier-list-display.tsx"

export default function TierListResultScreen({tiers, tierList, counter}: {
    tiers: Tier[],
    tierList: PokemonObject[],
    counter: number
}) {
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
                <TierListDisplay tiers={tiers} tierList={tierList} forDownload={false}></TierListDisplay>
            </div>
            <p>Comparisons made: {counter}</p>
            <button onClick={handleClick} className="inline">Download Image</button>
            {show &&
                <div ref={imageRef} style={{width: "max-content"}}>
                    <h2>My favorite Pokémon</h2>
                    <TierListDisplay tiers={tiers} tierList={tierList} forDownload={true}></TierListDisplay>
                </div>
            }
        </>
    )
}
