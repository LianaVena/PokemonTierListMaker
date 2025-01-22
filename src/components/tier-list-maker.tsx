import PairChooser from "./pair-chooser.tsx"
import {allPokemonInput, getPokemonById, getPokemonNameById, PokemonObject} from "../functions/pokemon.ts"
import * as React from "react"
import {useEffect, useRef, useState} from "react"
import {logger} from "../functions/logger.ts"
import _ from "lodash"
import {mergeNodes, popNodePair} from "../functions/tier-list-operations.ts"
import {downloadJson, importFromJson, validateJson} from "../functions/import-export.ts"

export interface PokeNode {
    node: number
    leaves: PokeNode[]
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

    useEffect(() => {
        if (node1 && node2) {
            setPokemon1(getPokemonById(node1.node) || null)
            setPokemon2(getPokemonById(node2.node) || null)
        }
    }, [node1, node2, jsonData])

    if (!done) {
        if (node1 === null || node2 === null) {
            const pair = popNodePair(nodes, setNode1, setNode2, setNodes, tierList, setTierList, setDone)
            if (pair) {
                setPokemon1(getPokemonById(pair[0].node) || null)
                setPokemon2(getPokemonById(pair[1].node) || null)
            }
        }
    }

    return (
        <> {done ? (
            <>
                <h2>Your Tier List:</h2>
                {tierList.map((pokemon) =>
                    <div key={pokemon.id} className="inline">
                        <img src={pokemon.imageUrl} alt={pokemon.name} width="50px" height="50px"/>
                        <p>{pokemon.id + ". " + pokemon.name}</p>
                    </div>
                )}
                <p>Comparisons made: {counter}</p>
            </>
        ) : (
            <>
                <PairChooser pokemon1={pokemon1}
                             pokemon2={pokemon2}
                             onChosenChange={choosePokemon}>
                </PairChooser>
                <p>Comparisons made: {counter}</p>
                <button onClick={handleExport} className="inline">Export</button>
                <form className="inline">
                    <button onClick={handleImport}>Import</button>
                    <input ref={inputRef} type="file" hidden onChange={handleFileUpload}/>
                </form>
            </>
        )}
        </>
    )
}

function nodeToString(node: PokeNode | null): string {
    const parentheses = [
        ["(", ")"],
        ["[", "]"],
        ["{", "}"]
    ]

    function traverse(node: PokeNode | null, level: number): string {
        if (!node) {
            return ""
        }
        const [open, close] = parentheses[level % parentheses.length]
        const children = node.leaves.map(child => traverse(child, level + 1)).join(close + open)
        return `${node.node + "." + getPokemonNameById(node.node)}${children ? open + children + close : ""}`
    }

    return traverse(node, 0)
}

function printAllNodes(nodes: PokeNode[]) {
    logger("-----------", "debug")
    for (let i = 0; i < nodes.length; i++) {
        logger("nodes[" + i + "] = " + nodeToString(nodes[i]), "debug")
    }
}

function getNodes() {
    const nodes: PokeNode[] = []
    for (const [key] of allPokemonInput) {
        nodes.push({node: key, leaves: []})
    }
    return nodes
}

function shuffle(array: PokeNode[]) {
    const result = _.cloneDeep(array)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}
