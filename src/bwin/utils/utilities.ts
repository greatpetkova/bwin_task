
export function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function getRandomInRange(minValue: number, maxValue: number) {
    return Math.floor(Math.random() * (maxValue - 1) + minValue);
}

export const toSportSlug = async (sport: string, sportID: string): Promise<string> => {
    // Convert the sport name to a slug format by replacing all spaces with hyphens
    return sport.toLowerCase().replace(/ /g, '-') + "-" + sportID;
};