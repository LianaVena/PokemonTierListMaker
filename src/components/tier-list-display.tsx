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
                    {
                        !tiers.find(x => x.startIndex == 1) &&
                        <TierListSubDisplay items={tierList.slice(0, tiers[0].startIndex - 1)} index={0}
                                            forDownload={forDownload}></TierListSubDisplay>
                    }
                    {tiers.map((tier, index) => {
                        const startIndex: number = tier.startIndex - 1
                        const nextTierStartIndex = index + 1 < tiers.length ? tiers[index + 1].startIndex - 1 : tierList.length
                        const tierItems = tierList.slice(startIndex, nextTierStartIndex)
                        return (
                            <div key={index * 10000 + tier.startIndex}>
                                <h3 style={{backgroundColor: tier.color}}>{tier.name}</h3>
                                <TierListSubDisplay items={tierItems} index={startIndex}
                                                    forDownload={forDownload}></TierListSubDisplay>
                            </div>
                        )
                    })}
                </>
                :
                <TierListSubDisplay items={tierList} index={0} forDownload={forDownload}></TierListSubDisplay>
            }
        </>
    )
}