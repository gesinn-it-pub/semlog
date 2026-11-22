import chalk from 'chalk';

export { chalk };

export interface SemlogConfig {
    silent: boolean;
    colorize: boolean;
    printYaml: boolean;
    logDateTime: boolean;
    printTime: boolean;
    printDateTime: boolean;
    printDebug: boolean;
    printVerbose: boolean;
    /** Maximum number of history entries, 0 for none */
    historySize: number;
}

export interface SemlogStatistics {
    debug: number;
    warning: number;
    error: number;
    total: number;
}

export function log(obj: unknown, silent?: boolean): void;
export function message(msg: unknown, silent?: boolean): void;
export function debug(obj: unknown, silent?: boolean): void;
export function error(obj: unknown, silent?: boolean): void;
export function addToHistory(obj: unknown): void;
export function addMarker(marker: string, color: string): void;
export function colorize(msg: string): string;
export function getConfig(): SemlogConfig;
export function getStatistics(): SemlogStatistics;
export function updateConfig(config: Partial<SemlogConfig>): SemlogConfig;
export function clearLogHistory(): void;
export function getLogHistory(): string[];
