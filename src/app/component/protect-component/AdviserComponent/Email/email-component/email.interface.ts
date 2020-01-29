
export interface EmailInterfaceI {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    isRead: boolean;
}

export interface GmailInboxResponseI {
    historyId: string | null,
    id: string | null,
    messages: GmailSingleMessageI[]
}

export interface EmailAttachmentI {
    filename: string,
    size: number,
    mimeType: string,
    data: string
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

export interface ExtractedGmailDataI {
    position: number;
    idsOfThread: { historyId: string, id: string },
    parsedData: { decodedPart: string[], headers: {}[] },
    labelIdsFromMessages: { labelIds: string[] }[],
    emailers: string,
    subjectMessage: { subject: string, message: string },
    date: string
}

export interface MessageListArray {
    position: number,
    emailers: string,
    subjectMessage: string,
    date: string
}