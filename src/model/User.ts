export class User {
    username: string;
    email: string;
    country: string;
    bio: string;
    githubAccountLink: string;
    mobileAuthPassword: string;

    skillList: Set<string>;
    dialogs: Map<object, object>;

    submittedProjects: string[];
    projectsAppliedTo: string[];

    notifications: any;
    
    lastOnlineDate: number;
    banned: boolean;
    hasSeenGlobalMessage: boolean;
    isAdmin: boolean;
}