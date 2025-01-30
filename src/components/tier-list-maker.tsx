import PairChooser from "./pair-chooser.tsx"
import {getPokemonById, PokemonObject} from "../functions/pokemon.ts"
import * as React from "react"
import {useEffect, useRef, useState} from "react"
import {logger} from "../functions/logger.ts"
import {mergeNodes, popNodePair} from "../functions/tier-list-functions.ts"
import {downloadJson, importFromJson, validateJson} from "../functions/import-export.ts"
import {getNodes, printAllNodes, shuffle} from "../functions/pokenode-functions.ts"
import TierListResultScreen from "./tier-list-result-screen.tsx"

export interface PokeNode {
    id: string
    leaves: PokeNode[]
}

export type Tier = {
    startIndex: number
    name: string
    color: string
}

export default function TierListMaker() {
    const [nodes, setNodes] = useState<PokeNode[]>(shuffle(getNodes()))
    const [node1, setNode1] = useState<PokeNode | null>(null)
    const [node2, setNode2] = useState<PokeNode | null>(null)
    const [pokemon1, setPokemon1] = useState<PokemonObject | null>(null)
    const [pokemon2, setPokemon2] = useState<PokemonObject | null>(null)
    const [tierList, setTierList] = useState<PokemonObject[]>([])
    const [counter, setCounter] = useState<number>(0)
    const [done, setDone] = useState<boolean>(false)
    const [jsonData, setJsonData] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    logger("Number of nodes: " + nodes.length, "debug")
    printAllNodes(nodes)

    function choosePokemon(pokemon: PokemonObject) {
        if (pokemon) {
            setCounter((prev) => prev + 1)
            mergeNodes(node1, node2, pokemon, nodes, setNode1, setNode2, setNodes)
        }
    }

    function handleExport() {
        downloadJson(node1, node2, nodes, tierList, counter)
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (files) {
            const file = files[0]
            try {
                const fileContents = await file.text()
                const jsonData = JSON.parse(fileContents)
                validateJson(jsonData)
                setJsonData(jsonData)
                importFromJson(jsonData, setNode1, setNode2, setNodes, setTierList, setCounter)
                alert("Import successful.")
            } catch (err) {
                alert(err)
            }
        }
    }

    function handleImport(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (inputRef?.current) {
            inputRef.current.click()
        }
    }

    function handleReset() {
        if (window.confirm("Are you sure you want to reset?")) {
            setNodes(shuffle(getNodes()))
            setNode1(null)
            setNode2(null)
            setPokemon1(null)
            setPokemon2(null)
            setTierList([])
            setCounter(0)
            setDone(false)
            setJsonData("")
        }
    }

    useEffect(() => {
        if (node1 && node2) {
            setPokemon1(getPokemonById(node1.id) || null)
            setPokemon2(getPokemonById(node2.id) || null)
        }
    }, [node1, node2, jsonData])

    if (!done) {
        if (node1 === null || node2 === null) {
            const pair = popNodePair(nodes, setNode1, setNode2, setNodes, tierList, setTierList, setDone)
            if (pair) {
                setPokemon1(getPokemonById(pair[0].id) || null)
                setPokemon2(getPokemonById(pair[1].id) || null)
            }
        }
    }

    const tiers: Tier[] = [
        {startIndex: 0, name: "S", color: "DarkOliveGreen"},
        {startIndex: 3, name: "A", color: "Gold"},
        {startIndex: 7, name: "B", color: "Tomato"}
    ]

    return (
        <>
            {done ? (
                <TierListResultScreen tiers={tiers} tierList={tierList} counter={counter}></TierListResultScreen>
            ) : (
                <>
                    <PairChooser pokemon1={pokemon1}
                                 pokemon2={pokemon2}
                                 onChosenChange={choosePokemon}>
                    </PairChooser>
                    <p>Comparisons made: {counter}</p>

                </>
            )}
            <button onClick={handleExport} className="inline">Export</button>
            <form className="inline">
                <button onClick={handleImport}>Import</button>
                <input ref={inputRef} type="file" hidden onChange={handleFileUpload}/>
            </form>
            <button onClick={handleReset} className="inline">Reset</button>
        </>
    )
}
