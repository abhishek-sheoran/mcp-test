export const NEXT_PUBLIC_MYKAARMA_USERNAME = process.env.NEXT_PUBLIC_MYKAARMA_USERNAME;
export const NEXT_PUBLIC_MYKAARMA_PASSWORD = process.env.NEXT_PUBLIC_MYKAARMA_PASSWORD;
export const NEXT_PUBLIC_MYKAARMA_BASE_URL = process.env.NEXT_PUBLIC_MYKAARMA_BASE_URL;

export const getBase64 = (username: string , password: string) => {
    return Buffer.from(`${username}:${password}`).toString('base64');
}

export const getAuthToken = () => {
    return getBase64(NEXT_PUBLIC_MYKAARMA_USERNAME!, NEXT_PUBLIC_MYKAARMA_PASSWORD!);
}

