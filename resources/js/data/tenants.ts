export type TenantStatus = 'Current' | 'Expiring Soon' | 'Overdue' | 'Notice Given';

export interface TenantRecord {
    id: number;
    name: string;
    property: string;
    unit: string;
    leaseStart: string;
    leaseEnd: string;
    rent: string;
    balance: string;
    status: TenantStatus;
    email: string;
    phone: string;
    concierge: string;
}

export const tenantRecords: TenantRecord[] = [
    {
        id: 1,
        name: 'Amelia Watson',
        property: 'Azure Heights',
        unit: 'Apt 405',
        leaseStart: 'Apr 1, 2024',
        leaseEnd: 'Mar 31, 2025',
        rent: '$2,450',
        balance: '$0',
        status: 'Current',
        email: 'amelia.watson@example.com',
        phone: '(415) 555-0145',
        concierge: 'Jonah Pierce',
    },
    {
        id: 2,
        name: 'Miguel Hernandez',
        property: 'Harbor Point',
        unit: 'Unit 1203',
        leaseStart: 'Jun 15, 2024',
        leaseEnd: 'Jun 14, 2025',
        rent: '$3,150',
        balance: '$420',
        status: 'Overdue',
        email: 'miguel.hernandez@example.com',
        phone: '(206) 555-0199',
        concierge: 'Sasha Young',
    },
    {
        id: 3,
        name: 'Priya Patel',
        property: 'Luna Residences',
        unit: 'Townhome 6',
        leaseStart: 'Oct 1, 2023',
        leaseEnd: 'Sep 30, 2024',
        rent: '$4,300',
        balance: '$0',
        status: 'Expiring Soon',
        email: 'priya.patel@example.com',
        phone: '(312) 555-0177',
        concierge: 'Elena Brooks',
    },
    {
        id: 4,
        name: 'Jackson Li',
        property: 'Harbor Point',
        unit: 'Unit 809',
        leaseStart: 'Jan 10, 2024',
        leaseEnd: 'Jan 9, 2025',
        rent: '$2,980',
        balance: '$0',
        status: 'Current',
        email: 'jackson.li@example.com',
        phone: '(917) 555-0110',
        concierge: 'Sasha Young',
    },
    {
        id: 5,
        name: 'Gabrielle Martin',
        property: 'Luna Residences',
        unit: 'Loft 21B',
        leaseStart: 'Aug 20, 2024',
        leaseEnd: 'Aug 19, 2025',
        rent: '$3,650',
        balance: '$0',
        status: 'Current',
        email: 'gabrielle.martin@example.com',
        phone: '(213) 555-0180',
        concierge: 'Elena Brooks',
    },
    {
        id: 6,
        name: 'Noah Fischer',
        property: 'Azure Heights',
        unit: 'Penthouse 2',
        leaseStart: 'Dec 1, 2023',
        leaseEnd: 'Nov 30, 2024',
        rent: '$5,800',
        balance: '$0',
        status: 'Notice Given',
        email: 'noah.fischer@example.com',
        phone: '(347) 555-0152',
        concierge: 'Jonah Pierce',
    },
    {
        id: 7,
        name: 'Elise Dubois',
        property: 'Riviera Flats',
        unit: 'Suite 304',
        leaseStart: 'May 5, 2024',
        leaseEnd: 'May 4, 2025',
        rent: '$2,720',
        balance: '$0',
        status: 'Current',
        email: 'elise.dubois@example.com',
        phone: '(305) 555-0168',
        concierge: 'Harper Lin',
    },
    {
        id: 8,
        name: 'Liam Carter',
        property: 'Summit Row',
        unit: 'Unit 1102',
        leaseStart: 'Feb 18, 2024',
        leaseEnd: 'Feb 17, 2025',
        rent: '$2,380',
        balance: '$120',
        status: 'Overdue',
        email: 'liam.carter@example.com',
        phone: '(480) 555-0129',
        concierge: 'Harper Lin',
    },
];
