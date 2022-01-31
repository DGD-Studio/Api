import colors from "colors"
const { bold, cyan, white, italic, red, yellow } = colors

export enum Loglevels {
    Debug,
    Info,
    Warn,
    Error,
    Fatal
}

const prefixes = new Map<Loglevels, string>([
    [Loglevels.Debug, "DEBUG"],
    [Loglevels.Info, "INFO"],
    [Loglevels.Warn, "WARN"],
    [Loglevels.Error, "ERROR"],
    [Loglevels.Fatal, "FATAL"],
]);

const noColor: (str: string) => string = (msg) => msg;
const colorFunctions = new Map<Loglevels, (str: string) => string>([
    [Loglevels.Debug, white],
    [Loglevels.Info, cyan],
    [Loglevels.Warn, yellow],
    [Loglevels.Error, (str: string) => red(str)],
    [Loglevels.Fatal, (str: string) => red(bold(italic(str)))],
]);

export function logger({
    logLevel = Loglevels.Info,
    name,
}: {
    logLevel?: Loglevels;
    name?: string;
} = {}) {
    function log(level: Loglevels, ...args: string[]) {
        if (level < logLevel) return;

        let color = colorFunctions.get(level);
        if (!color) color = noColor;

        const date = new Date();
        const log = [
            `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,
            color(prefixes.get(level) || "DEBUG"),
            name ? `${name} >` : ">",
            ...args,
        ];

        switch (level) {
            case Loglevels.Debug:
                return console.debug(...log);
            case Loglevels.Info:
                return console.info(...log);
            case Loglevels.Warn:
                return console.warn(...log);
            case Loglevels.Error:
                return console.error(...log);
            case Loglevels.Fatal:
                return console.error(...log);
            default:
                return console.log(...log);
        }
    }

    function setLevel(level: Loglevels) {
        logLevel = level;
    }

    function debug(...args: string[]) {
        log(Loglevels.Debug, ...args);
    }

    function info(...args: string[]) {
        log(Loglevels.Info, ...args);
    }

    function warn(...args: string[]) {
        log(Loglevels.Warn, ...args);
    }

    function error(...args: string[]) {
        log(Loglevels.Error, ...args);
    }

    function fatal(...args: string[]) {
        log(Loglevels.Fatal, ...args);
    }

    return {
        log,
        setLevel,
        debug,
        info,
        warn,
        error,
        fatal,
    };
}

export interface LoggerType {
    log: (level: Loglevels, ...args: string[]) => void;
    setLevel: (level: Loglevels) => void;
    debug: (...args: string[]) => void;
    info: (...args: string[]) => void;
    warn: (...args: string[]) => void;
    error: (...args: string[]) => void;
    fatal: (...args: string[]) => void;
}