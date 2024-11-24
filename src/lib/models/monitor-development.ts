export type MonitorDevelopment = {
    id: string;
    title: string;
    weight: string;
    height: string;
    width: string;
    healthStatus: string;
    checkUpAt: string;
}

export type CreateMonitorDevelopment = {
    pigId: string;
    weight: number;
    height: number;
    width: number;
    note: string;
    status: number;
}