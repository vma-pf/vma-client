export type MonitorDevelopment = {
    id: string;
    title: string;
    weight: string;
    height: string;
    width: string;
    healthStatus: string;
    checkupAt: string;
}

export type CreateMonitorDevelopment = {
    pigId: string;
    cageId: string;
    weight: number;
    height: number;
    width: number;
    note: string;
    status: number;
}