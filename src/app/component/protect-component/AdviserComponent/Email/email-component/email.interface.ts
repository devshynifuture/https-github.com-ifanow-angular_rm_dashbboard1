
export interface EmailInterfaceI {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    isRead: boolean;
}

export interface GmailInboxResponseI {
    historyId: string,
    id: string,
    messages: GmailSingleMessageI[]
}

export interface GmailSingleMessageI {
    historyId: string,
    id: string,
    internalDate: number,
    labelIds: string[],
    payload: GmailPayloadI,
    sizeEstimate: number,
    snippet: string,
    threadId: string
}

export interface GmailPayloadI {
    body: { size: number, data: any },
    fileName: any,
    headers: { name: string, value: string }[],
    mimeType: string,
    partId: string,
    parts: GmailPartI[],
}

export interface GmailPartI {
    body: { size: number, data: string },
    fileName: any,
    headers: { name: string, value: string }[],
    mimeType: string,
    partId: string
}