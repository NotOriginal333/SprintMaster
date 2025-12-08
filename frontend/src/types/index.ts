export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'PM' | 'DEV' | 'QA';
}

export interface BugReport {
    id: number;
    title: string;
    description: string;
    status: 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'FIXED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    created_at: string;
    reporter: number;
    reporter_details?: User;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    status: 'ACTIVE' | 'ON_HOLD' | 'ARCHIVED';
    start_date: string;
    manager: number;
    manager_details?: User;
    members: number[];
    members_details?: User[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'NEW' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    story_points: number;
    project: number;
    sprint: number | null;
    assignee: number | null;
    assignee_details?: User | null;
    bugs?: BugReport[];
}

export interface Report {
    id: number;
    project: number;
    report_type: 'SPRINT' | 'PROJECT' | 'BUGS';
    data: any;
    created_at: string;
    is_ready: boolean;
    generated_by: number;
}