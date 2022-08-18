import {adjectives, colors, Config, names, uniqueNamesGenerator} from "unique-names-generator";

export function generateUserName(): string {
    const customConfig: Config = {
        dictionaries: [names, adjectives, colors],
        separator: '-',
        style: "lowerCase"
    };
    return uniqueNamesGenerator(customConfig);
}