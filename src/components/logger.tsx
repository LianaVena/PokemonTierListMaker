export const logger = (message: string, level: "debug" | "info" | "warn" | "error" = "info") => {
    const date = new Date()
    const timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds()

    const stack = new Error().stack
    let componentName = stack
        ? stack.split("\n")[2]?.trim().split(" ")[1] || "UnknownComponent"
        : "UnknownComponent"

    const urlMatch = componentName.match(/.*\/([^]+\.tsx):(\d+):(\d+)/)

    if (urlMatch) {
        const fileName = urlMatch[1]
        const line = urlMatch[2]
        const column = urlMatch[3]
        componentName = `[${fileName} ${line}:${column}]`
    } else {
        const urlMatchWithQuery = componentName.match(/^(.*\/)([^/]+\.tsx)\?t=\d+:(\d+):(\d+)$/)

        if (urlMatchWithQuery) {
            const fileName = urlMatchWithQuery[2]
            const line = urlMatchWithQuery[3]
            const column = urlMatchWithQuery[4]
            componentName = `${fileName} ${line}:${column}`
        }
    }

    const levels = {
        debug: "DEBUG",
        info: "INFO",
        warn: "WARN",
        error: "ERROR"
    }

    const logMessage = `[${timestamp}] [${levels[level]}] [${componentName}] ${message}`

    switch (level) {
        case "debug":
            console.debug(logMessage)
            break
        case "info":
            console.info(logMessage)
            break
        case "warn":
            console.warn(logMessage)
            break
        case "error":
            console.error(logMessage)
            break
        default:
            console.log(logMessage)
    }
}
