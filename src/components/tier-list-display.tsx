import {PokemonObject} from "../functions/pokemon.ts"
import {Tier} from "./tier-list-maker.tsx"
import TierListSubDisplay from "./tier-list-sub-display.tsx"

export default function TierListDisplay({tiers, tierList, forDownload}: {
    tiers: Tier[],
    tierList: PokemonObject[],
    forDownload: boolean
}) {
    return (
        <>
            {tiers.length > 0 ?
                <>
                    {tiers.map((tier, index) => {
                        const startIndex = tier.startIndex
                        const nextTierStartIndex = index + 1 < tiers.length ? tiers[index + 1].startIndex : tierList.length
                        const tierItems = tierList.slice(startIndex, nextTierStartIndex)
                        return (
                            <div key={index * 10000 + tier.startIndex}>
                                <h3 style={{backgroundColor: tier.color}}>{tier.name}</h3>
                                <TierListSubDisplay items={tierItems} forDownload={forDownload}></TierListSubDisplay>
                            </div>
                        )
                    })}
                </>
                :
                <TierListSubDisplay items={tierList} forDownload={forDownload}></TierListSubDisplay>
            }
        </>
    )
}