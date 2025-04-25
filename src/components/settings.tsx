import {Tier} from "./tier-list-maker.tsx"
import * as React from "react"
import {ChangeEvent, useEffect} from "react"
import {useForm} from "react-hook-form"
import _ from "lodash"

export default function Settings({tiers, setTiers, length}: {
    tiers: Tier[],
    setTiers: React.Dispatch<React.SetStateAction<Tier[]>>,
    length: number
}) {
    const {register, handleSubmit, setValue, formState: {errors}} = useForm<Tier>()
    const [selectedTier, setSelectedTier] = React.useState<string>()
    const [inputIndex, setInputIndex] = React.useState<number>(0)
    const [inputName, setInputName] = React.useState<string>("")

    const indexRequiredMessage = "Please choose which index of the ordered Pokémon should this tier start with. Minimum value is 0."
    const nameRequiredMessage = "Please choose the displayed label for the tier."

    function handleSelectionChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value.split(" ")
        const index = Number(value[0])
        const name = value[1]
        setSelectedTier(e.target.value)
        setInputIndex(index)
        setValue("startIndex", index)
        setInputName(name)
        setValue("name", name)
    }

    function handleInputIndexChange(e: ChangeEvent<HTMLInputElement>) {
        setInputIndex(Number(e.target.value))
    }

    function handleInputNameChange(e: ChangeEvent<HTMLInputElement>) {
        setInputName(String(e.target.value))
    }

    useEffect(() => {
        if (!selectedTier && tiers.length > 0) {
            setSelectedTier(tiers[0].startIndex + " " + tiers[0].name)
        }
    }, [selectedTier, tiers])

    return (
        <>
            <form
                onSubmit={handleSubmit((data) => {
                    const result = _.cloneDeep(tiers)
                    const existing = result.find(x => x.startIndex == data.startIndex)
                    if (existing) {
                        existing.name = data.name
                        existing.color = data.color
                        setTiers(result)
                    } else {
                        result.push({startIndex: Number(data.startIndex), name: data.name, color: data.color})
                        setTiers(_.sortBy(result, "startIndex"))
                    }
                    setSelectedTier(data.startIndex + " " + data.name)
                })}
            >
                <label>
                    Starting Index:
                    <input
                        type="number"
                        placeholder="Starting index of the tier"
                        {...register("startIndex", {required: indexRequiredMessage, max: length - 1})}
                        value={inputIndex}
                        onChange={handleInputIndexChange}
                        className="inline-row"
                    />
                    <p>{errors.startIndex?.message}</p>
                </label>

                <label>
                    Name:
                    <input
                        type="text"
                        placeholder="Tier name"
                        {...register("name", {required: nameRequiredMessage})}
                        value={inputName}
                        onChange={handleInputNameChange}
                        className="inline-row"
                    />
                    <p>{errors.name?.message}</p>
                </label>

                <label>
                    Color:
                    <input type="color" {...register("color")} className="inline-row"/>
                </label>

                <button type="submit">{tiers.find(x => x.startIndex == inputIndex) ? "Edit Tier" : "Add Tier"}</button>
            </form>

            <form
                onSubmit={handleSubmit(() => {
                    const result = _.cloneDeep(tiers)
                    _.remove(result, x => x.startIndex.toString() == selectedTier?.split(" ")[0])
                    setTiers(result)
                    setSelectedTier(undefined)
                    if (tiers.length > 0) {
                        const tier0 = result[0]
                        setInputIndex(tier0.startIndex)
                        setValue("startIndex", tier0.startIndex)
                        setInputName(tier0.name)
                        setValue("name", tier0.name)
                    } else {
                        setInputIndex(0)
                        setValue("startIndex", 0)
                        setInputName("")
                        setValue("name", "")
                    }
                })}
            >
                <label>
                    Tiers:
                    <select value={selectedTier} onChange={handleSelectionChange} style={{minWidth: "177px"}}
                            className="inline">
                        {tiers.map((tier, index) =>
                            <option
                                key={index + tier.startIndex}
                                value={`${tier.startIndex} ${tier.name}`}>
                                {tier.startIndex + " " + tier.name}</option>
                        )}
                    </select>
                </label>
                {selectedTier !== undefined &&
                    <button type="submit">Delete</button>
                }
            </form>
        </>
    )
}
