import {PokeNode} from "../components/tier-list-maker.tsx"
import {PokemonObject} from "./pokemon.ts"
import * as React from "react"

export function downloadJson(node1: PokeNode | null, node2: PokeNode | null, nodes: PokeNode[], tierList: PokemonObject[], counter: number): void {
    const jsonString = createExportJson(node1, node2, nodes, tierList, counter)
    const blob = new Blob([jsonString], {type: "application/json"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `$pokemon-tier-list-state.json`
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

function createExportJson(node1: PokeNode | null, node2: PokeNode | null, nodes: PokeNode[], tierList: PokemonObject[], counter: number) {
    const exportData = {
        node1: node1 ? processNode(node1) : null,
        node2: node2 ? processNode(node2) : null,
        nodes: nodes.map(processNode),
        tierList: tierList,
        counter: counter
    }
    return JSON.stringify(exportData, null, 2)
}

function processNode(node: PokeNode): object {
    return {
        node: node.node,
        leaves: node.leaves.map(processNode)
    }
}

export interface JsonData {
    node1: PokeNode | null,
    node2: PokeNode | null,
    nodes: PokeNode[],
    tierList: PokemonObject[],
    counter: number
}

export function importFromJson(
    importJson: JsonData,
    setNode1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNode2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>,
    setTierList: React.Dispatch<React.SetStateAction<PokemonObject[]>>,
    setCounter: React.Dispatch<React.SetStateAction<number>>
) {
    setNode1(importJson.node1)
    setNode2(importJson.node2)
    setNodes(importJson.nodes)
    setTierList(importJson.tierList)
    setCounter(importJson.counter)
}

export function validateJson(importJson: JsonData) {
    if (!importJson || typeof importJson !== "object") {
        throw new Error("File is not a valid JSON file.")
    }
    if (!(importJson.node1 === null || isPokeNode(importJson.node1))) {
        throw new Error("Node1 isn't readable.")
    }
    if (!(importJson.node2 === null || isPokeNode(importJson.node2))) {
        throw new Error("Node2 isn't readable.")
    }
    if (!Array.isArray(importJson.nodes)) {
        throw new Error("Nodes must be an array.")
    }
    if (!importJson.nodes.every(isPokeNode)) {
        throw new Error("One of nodes isn't valid.")
    }
    if (!Array.isArray(importJson.tierList)) {
        throw new Error("TierList must be an array.")
    }
    if (!importJson.tierList.every(isPokemonObject)) {
        throw new Error("One of tierList Pokemon isn't valid.")
    }
    if (!importJson.counter) {
        throw new Error("Counter is missing.")
    }
}

function isPokeNode(node: PokeNode) {
    return (
        node &&
        typeof node === "object" &&
        node.node &&
        Array.isArray(node.leaves) &&
        node.leaves.every(isPokeNode)
    )
}

function isPokemonObject(pokemon: PokemonObject) {
    return (
        pokemon &&
        typeof pokemon === "object" &&
        pokemon.id &&
        pokemon.name &&
        pokemon.imageUrl
    )
}
