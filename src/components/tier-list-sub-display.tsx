import {PokemonObject} from "../functions/pokemon.ts"

export default function TierListSubDisplay({items, index, forDownload}: {
    items: PokemonObject[],
    index: number,
    forDownload: boolean
}) {
    const startIndex: number = index

    return (
        <div style={forDownload ? {
            display: "grid",
            gridTemplateColumns: `repeat(10, max-content)`,
            justifyContent: "center",
            width: "auto"
        } : {}}>
            {items.map((pokemon, index) =>
                <div key={index * 10000 + pokemon.id} className="inline">
                    <img
                        src={import.meta.env.BASE_URL + "pokemon-images/" + pokemon.image + ".png"} alt={pokemon.name}
                        width="50px" height="50px"/>
                    <p>{(startIndex + index + 1) + ". " + pokemon.name}</p>
                </div>
            )}
        </div>
    )
}
