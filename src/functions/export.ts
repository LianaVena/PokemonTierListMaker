import {PokeNode} from "../components/tier-list-maker.tsx"
import {PokemonObject} from "./pokemon.ts"

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
        leaves: node.leaves.map(node => processNode(node))
    }
}
