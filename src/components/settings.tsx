import {Tier} from "./tier-list-maker.tsx"
import * as React from "react"
import {useForm} from "react-hook-form"
import _ from "lodash"

export default function Settings({tiers, setTiers, length}: {
    tiers: Tier[],
    setTiers: React.Dispatch<React.SetStateAction<Tier[]>>,
    length: number
}) {
    const {register, handleSubmit, formState: {errors}} = useForm<Tier>()

    const indexRequiredMessage = "Please choose which index of the ordered Pokémon should this tier start with. Minimum value is 0."
    const nameRequiredMessage = "Please choose the displayed label for the tier."

    return (
        <>
            <form
                onSubmit={handleSubmit((data) => {
                    const result = _.cloneDeep(tiers)
                    result.push({startIndex: Number(data.startIndex), name: data.name, color: data.color})
                    setTiers(result)
                })}
            >
                <label>
                    Starting Index
                    <input
                        type="number"
                        placeholder="Starting index of the tier"
                        {...register("startIndex", {required: indexRequiredMessage, max: length - 1})}
                    />
                    <p>{errors.startIndex?.message}</p>
                </label>

                <label>
                    Name
                    <input
                        type="text"
                        placeholder="Tier name"
                        {...register("name", {required: nameRequiredMessage})}
                    />
                    <p>{errors.name?.message}</p>
                </label>

                <label>
                    Color
                    <input type="color" {...register("color")} />
                </label>

                <button type="submit">Add Tier</button>
            </form>
            <form>
                <label>
                    <select style={{minWidth: "177px"}} className="inline">
                        {tiers.map((tier, index) =>
                            <option key={index}>{tier.name}</option>
                        )}
                    </select>
                    Tiers:
                </label>
            </form>
        </>
    )
}
