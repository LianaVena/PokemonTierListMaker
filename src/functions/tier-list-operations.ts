import * as React from "react"
import {getPokemonById, getPokemonNameById, PokemonObject} from "./pokemon.ts"
import {logger} from "../components/logger.tsx"
import _ from "lodash"
import {PokeNode} from "../components/tier-list-maker.tsx"

export function popNodePair(
    nodes: PokeNode[],
    setNode1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNode2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>,
    tierList: PokemonObject[],
    setTierList: React.Dispatch<React.SetStateAction<PokemonObject[]>>,
    setDone: React.Dispatch<React.SetStateAction<boolean>>
) {
    logger("POP PAIR...", "debug")
    if (nodes.length > 1) {
        const n1 = nodes[0]
        const n2 = nodes[1]
        setNode1(n1)
        setNode2(n2)
        const nodesCopy = _.cloneDeep(nodes)
        nodesCopy.shift()
        nodesCopy.shift()
        setNodes(nodesCopy)
        return [n1, n2]
    } else {
        setWinnerAndRestart(nodes, tierList, setNodes, setTierList, setDone)
    }
}

export function mergeNodes(
    node1: PokeNode | null,
    node2: PokeNode | null,
    chosenPokemon: PokemonObject | null,
    nodes: PokeNode[],
    setNode1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNode2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>
) {
    logger("MERGE NODES...", "debug")
    if (node1 && node2 && chosenPokemon) {
        if (node1.node === chosenPokemon.id) {
            pushUpdatedNode(node1, node2, nodes, setNode1, setNode2, setNodes)
        } else if (node2.node === chosenPokemon.id) {
            pushUpdatedNode(node2, node1, nodes, setNode2, setNode1, setNodes)
        } else {
            logger("Chosen pokemon " + chosenPokemon.name + " not in nodes: " +
                getPokemonNameById(node1.node) + " " + getPokemonNameById(node2.node), "warn")
        }
    } else {
        logger("NULL VALUE: chosenPokemon=" +
            (chosenPokemon ? chosenPokemon.name : "null") +
            " node1=" + (node1 ? getPokemonNameById(node1.node) : "null") +
            " node2=" + (node2 ? getPokemonNameById(node2.node) : "null"), "warn")
    }
}

function pushUpdatedNode(
    n1: PokeNode,
    n2: PokeNode,
    nodes: PokeNode[],
    setN1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setN2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>
) {
    logger("PUSH NODE...", "debug")
    const nodesCopy = _.cloneDeep(nodes)
    n1.leaves.push(n2)
    nodesCopy.push(n1)
    setNodes(nodesCopy)
    setN1(null)
    setN2(null)
}

function setWinnerAndRestart(
    nodes: PokeNode[],
    tierList: PokemonObject[],
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>,
    setTierList: React.Dispatch<React.SetStateAction<PokemonObject[]>>,
    setDone: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (nodes.length === 0) {
        setDone(true)
    } else {
        const node0 = nodes[0]
        const winner = getPokemonById(node0.node)
        if (winner) {
            const tierListCopy = _.cloneDeep(tierList)
            tierListCopy.push(winner)
            setTierList(tierListCopy)
            printTierList(tierListCopy)
            const newNodes: PokeNode[] = []
            for (const node of node0.leaves) {
                newNodes.push(node)
            }
            setNodes(newNodes)
        } else {
            logger("NO WINNER???", "error")
        }
    }
}

function printTierList(tierList: PokemonObject[]) {
    let result = "Result: "
    for (const pokemon of tierList) {
        result += pokemon.name + " "
    }
    logger(result, "debug")
}
